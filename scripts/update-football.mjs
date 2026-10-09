// Public-data collector only. No AI, credentials, private notes, or invented missing values.
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {collect as collectSchool} from './update-schedule.mjs';

export const LC='https://www.maxpreps.com/ok/tulsa/lincoln-christian-bulldogs/football/';
export const clean=s=>String(s??'').replace(/<[^>]*>/g,' ').replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(+n)).replace(/&#x([\da-f]+);/gi,(_,n)=>String.fromCharCode(parseInt(n,16))).replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&apos;|&#39;|&#x27;/g,"'").replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const norm=s=>clean(s).toLowerCase().replace(/[^a-z0-9]/g,'');
export function localDay(now=new Date()){const p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).map(p=>[p.type,p.value]));return `${p.year}-${p.month}-${p.day}`;}
const allowed=url=>{try{const u=new URL(url);return u.protocol==='https:'&&['www.maxpreps.com','lcssports.com','turbostatslive.com'].includes(u.hostname)&&!u.username&&!u.password;}catch{return false;}};
async function read(url){if(!allowed(url))throw Error('Unexpected source host');const r=await fetch(url,{signal:AbortSignal.timeout(25000),headers:{'User-Agent':'LincolnBroadcastDesk/1.1 (weekly public football preparation)'}});if(!r.ok)throw Error('Source HTTP '+r.status);if(!allowed(r.url))throw Error('Unexpected redirect');return r.text();}
export function nextData(markup){const m=markup.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);if(!m)throw Error('No recognizable public data');return JSON.parse(m[1]).props.pageProps;}
function identity(p,name,season){const c=p.teamContext?.data;if(c?.sport!=='Football'||c.level!=='Varsity'||norm(c.schoolName)!==norm(name)||c.year!==season.slice(2,4)+'-'+season.slice(-2))throw Error('School, sport or season mismatch');return c;}
export function parseTeamSchedule(markup,name,season,checkedAt){
 const p=nextData(markup),c=identity(p,name,season);
 if(!Array.isArray(p.contests))throw Error('Schedule format changed');
 const events=p.contests.map(r=>{
  const own=(r[0]||[]).find(a=>a[1]===c.teamId),opp=(r[0]||[]).find(a=>a[1]!==c.teamId);
  if(!own||!opp||!/\/football\/$/.test(opp[13]||'')||/\/pseudo\/|non.varsity|unknown opponent/i.test(opp[13]+' '+opp[14]))return null;
  const date=String(r[11]||'').slice(0,10);if(!/^20\d{2}-\d{2}-\d{2}$/.test(date))throw Error('Unrecognized contest date');
  const resultRow=r.find(a=>Array.isArray(a)&&a[1]===c.teamId&&typeof a[3]==='string'),result=clean(resultRow?.[3]);
  const final=/^[WLT]\b/.test(result)&&Number.isFinite(own[6])&&Number.isFinite(opp[6]);
  const visibleTime=String(r[11]||'').slice(11,16);
  return {id:String(r[1]),date,time:/^([01]\d|2[0-3]):[0-5]\d$/.test(visibleTime)?visibleTime:'',opponent:clean(opp[14]),opponentBase:opp[13],mascot:clean(opp[21]),site:own[11]===0?'Home':own[11]===1?'Away':'Not listed',district:own[12]===0,result:final?result:'',score:final?own[6]:null,opponentScore:final?opp[6]:null,status:final?'completed':'scheduled',url:allowed(r[18])?r[18]:'',kind:clean(r[21])||'Game'};
 }).filter(Boolean).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
 if(!events.length)throw Error('No recognizable varsity games');
 const standing=p.teamContext.standingsData;
 return {school:name,season,source:p.canonicalUrl,checkedAt,status:'ok',events,record:standing?.overallStanding?.overallWinLossTies||'',districtRecord:standing?.leagueStanding?.conferenceWinLossTies||'',districtPlace:standing?.leagueStanding?.conferenceStandingPlacement||'',districtName:standing?.leagueStanding?.leagueName||'',pointsFor:standing?.overallStanding?.points??null,pointsAgainst:standing?.overallStanding?.pointsAgainst??null,streak:standing?.overallStanding?String(standing.overallStanding.streak)+standing.overallStanding.streakResult:'',mascot:c.schoolMascot};
}
export function parseRoster(markup,name,season,checkedAt){
 const p=nextData(markup);identity(p,name,season);if(!Array.isArray(p.athleteData))throw Error('Roster format changed');
 const players=p.athleteData.map(a=>{if(typeof a[33]!=='string'||!a[33].trim()||a[8]==null)throw Error('Incomplete roster identity');return {sourceId:String(a[4]),number:String(a[8]),name:clean(a[33]),grade:clean(a[36]),position:clean(a[32]),height:clean(a[34]),weight:Number.isFinite(a[11])&&a[11]>0?a[11]+' lb':'',profile:typeof a[31]==='string'&&allowed(a[31])?a[31]:''};});
 if(players.length>150)throw Error('Unexpected roster size');
 return {source:p.canonicalUrl,checkedAt,status:players.length?'ok':'not-published',players};
}
function cls(markup,name){return clean(markup.match(new RegExp('<(?:span|div)[^>]*class="[^"]*\\b'+name+'\\b[^"]*"[^>]*>([\\s\\S]*?)<\\/(?:span|div)>'))?.[1]);}
export function parseOfficialRoster(markup,checkedAt){
 if(!/<title>[^<]*2026-27 Football Roster[^<]*Lincoln Christian/i.test(markup))throw Error('Official roster season changed');
 const starts=[...markup.matchAll(/<li[^>]*data-player-id="(\d+)"[^>]*>/g)].filter(m=>m[0].includes('class="sidearm-roster-player"'));
 const players=starts.map((m,i)=>{let chunk=markup.slice(m.index,starts[i+1]?.index||markup.length);chunk=chunk.slice(0,chunk.indexOf('</li>')+5);const name=clean(chunk.match(/aria-label="([^"]+) - View (?:Profile|Full Bio)"/)?.[1]),number=cls(chunk,'sidearm-roster-player-jersey-number');if(!name)throw Error('Incomplete official roster name');return {sourceId:'official-'+m[1],name,number,grade:cls(chunk,'sidearm-roster-player-academic-year'),position:clean(chunk.match(/sidearm-roster-player-position[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/)?.[1]),height:cls(chunk,'sidearm-roster-player-height'),weight:cls(chunk,'sidearm-roster-player-weight')};}).filter(p=>!p.number||/^\d{1,3}$/.test(p.number));
 if(!players.length||players.length>150)throw Error('No recognizable official players');
 return {source:'https://lcssports.com/sports/football/roster',checkedAt,status:'ok',players};
}
export function parseStats(markup){
 const cells=s=>[...s.matchAll(/<(?:th|td)\b[^>]*>([\s\S]*?)<\/(?:th|td)>/g)].map(m=>clean(m[1]));
 const tables=[...markup.matchAll(/<h3[^>]*>(.*?)<\/h3>\s*<table[^>]*>([\s\S]*?)<\/table>/g)].map(m=>{const head=m[2].match(/<thead>([\s\S]*?)<\/thead>/)?.[1]||'',headers=cells(head),rows=[...(m[2].match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1]||'').matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)].map(r=>{const values=cells(r[1]),name=r[1].match(/<a[^>]*title="([^"]+)"/);if(name)values[1]=clean(name[1]);return values;});const total=[...(m[2].match(/<tfoot>([\s\S]*?)<\/tfoot>/)?.[1]||'').matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)].map(r=>cells(r[1])).find(r=>r.includes('Season Totals'))||[];if(!headers.includes('Athlete Name')||rows.some(r=>r.length!==headers.length))throw Error('Stats columns changed');return {title:clean(m[1]),headers,titles:[...head.matchAll(/<th\b[^>]*title="([^"]*)"/g)].map(m=>clean(m[1])),rows,total};});
 if(!tables.length)throw Error('No published stat tables');return tables;
}
async function collectStats(base,name,season,checkedAt){const source=base+'stats/',p=nextData(await read(source));identity(p,name,season);const print=p.sharedStatsLinks?.find(l=>l.displayText==='Print')?.canonicalUrl;if(!print)return {source,checkedAt,status:'not-published',tables:[],games:null};const markup=await read(print),updated=p.playerStatLeadersData?.lastUpdated?.timeStamp;if(!/<h3[^>]*>.*?<\/h3>\s*<table/.test(markup)&&!updated&&!p.playerStatLeadersData?.leaders?.length)return {source,checkedAt,status:'not-published',tables:[],games:null};const tables=parseStats(markup),games=Math.max(...tables.flatMap(t=>t.rows.map(r=>Number(r[t.headers.indexOf('GP')])||0)));return {source,checkedAt,status:'ok',tables,games,updatedAt:updated?updated.replace(/Z$/,'')+'Z':null};}
export function targetGame(schedule,now=new Date()){return (schedule?.events||[]).filter(e=>e.date>=localDay(now)&&e.kind!=='Scrimmage'&&!e.result&&e.status!=='cancelled'&&!/\bopen\b|\bbye\b/i.test(e.opponent)).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time))[0]||null;}
export async function retained(source,previous,checkedAt,operation){try{return await operation();}catch(error){console.error(source+': '+error.message);return {...(previous||{}),source,status:'error',attemptedAt:checkedAt,warning:'Source could not be refreshed. Last successful data retained; do not treat its timestamp as a new verification.'};}}
async function news(checkedAt){const h=await read('https://lcssports.com/sports/football'),urls=[...h.matchAll(/(?:href=|"url":)"((?:https:\/\/lcssports\.com)?\/news\/20\d{2}\/\d+\/\d+\/football[^"#]+\.aspx)"/g)].map(m=>new URL(m[1],'https://lcssports.com').href),unique=[...new Set(urls)].sort((a,b)=>{const date=u=>u.match(/\/news\/(\d{4})\/(\d+)\/(\d+)\//).slice(1).map(s=>s.padStart(2,'0')).join('-');return date(b).localeCompare(date(a));}).slice(0,4);if(!unique.length)throw Error('No recognizable official football news links');const articles=await Promise.all(unique.map(async url=>{const html=await read(url),title=clean(html.match(/<meta\s+(?:property|name)="og:title"\s+content="([^"]+)"/)?.[1]||html.match(/<title>([\s\S]*?)<\/title>/)?.[1]).replace(/ - Lincoln Christian School$/,'');const date=url.match(/\/news\/(\d{4})\/(\d+)\/(\d+)\//).slice(1).map(s=>s.padStart(2,'0')).join('-');return {title: title.split(' ').slice(0,24).join(' '),url,date};}));return {source:'https://lcssports.com/sports/football',checkedAt,status:'ok',articles};}
export async function collectFootball(previous,official,now=new Date()){
 const checkedAt=now.toISOString(),season=official.season,teams={},target=targetGame(official,now),lcSchedule=await retained(LC+'schedule/',previous.teams?.['Lincoln Christian']?.schedule,checkedAt,()=>read(LC+'schedule/').then(h=>parseTeamSchedule(h,'Lincoln Christian',season,checkedAt)));
 const registry=new Map([['Lincoln Christian',LC]]);(lcSchedule.events||[]).forEach(e=>registry.set(e.opponent,e.opponentBase));
 const list=[...registry.entries()];for(let i=0;i<list.length;i+=3)await Promise.all(list.slice(i,i+3).map(async([name,base])=>{const old=previous.teams?.[name]||{};const [schedule,roster]=await Promise.all([name==='Lincoln Christian'?lcSchedule:retained(base+'schedule/',old.schedule,checkedAt,()=>read(base+'schedule/').then(h=>parseTeamSchedule(h,name,season,checkedAt))),retained(base+'roster/',old.roster,checkedAt,()=>read(base+'roster/').then(h=>parseRoster(h,name,season,checkedAt)))]);teams[name]={base,schedule,roster,stats:old.stats||null};}));
 const currentOpponent=(lcSchedule.events||[]).find(e=>e.date===target?.date&&norm(target.opponent).startsWith(norm(e.opponent)))?.opponent;
 for(const name of ['Lincoln Christian',currentOpponent].filter(Boolean)){const team=teams[name];team.stats=await retained(team.base+'stats/',team.stats,checkedAt,()=>collectStats(team.base,name,season,checkedAt));}
 const officialRoster=await retained('https://lcssports.com/sports/football/roster',previous.officialRoster,checkedAt,()=>read('https://lcssports.com/sports/football/roster').then(h=>parseOfficialRoster(h,checkedAt)));
 const reports=await retained('https://lcssports.com/sports/football',previous.news,checkedAt,()=>news(checkedAt));
 const sources=[official,officialRoster,reports,...Object.values(teams).flatMap(t=>[t.schedule,t.roster,t.stats].filter(Boolean))];
 return {version:1,timeZone:'America/Chicago',season,generatedAt:checkedAt,target:target?{date:target.date,opponent:currentOpponent||target.opponent,time:target.time,site:target.site,source:official.source}:null,officialSchedule:official,officialRoster,teams,news:reports,failures:sources.filter(s=>s.status==='error').length,mode:'public-data-only'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const target=process.argv[2]||'football-feed.json',scheduleTarget=process.argv[3]||'schedule-feed.json';let previous={},priorSchedule={};try{previous=JSON.parse(await fs.readFile(target,'utf8'));}catch{}try{priorSchedule=JSON.parse(await fs.readFile(scheduleTarget,'utf8'));}catch{}
 const {feed:school,failures:scheduleFailures}=await collectSchool(priorSchedule);const feed=await collectFootball(previous,school.sports.football);await fs.writeFile(target,JSON.stringify(feed,null,2)+'\n');await fs.writeFile(scheduleTarget,JSON.stringify(school,null,2)+'\n');console.log(JSON.stringify({target:feed.target,teams:Object.keys(feed.teams).length,statsGames:feed.teams['Lincoln Christian']?.stats?.games,failures:feed.failures,scheduleFailures,rosterWarnings:Object.entries(feed.teams).filter(([,t])=>t.roster.status!=='ok').map(([name,t])=>({name,status:t.roster.status}))}));if(feed.failures||scheduleFailures)process.exitCode=1;
}
