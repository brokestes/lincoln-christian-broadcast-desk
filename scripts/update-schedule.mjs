import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

export const sources = {
 football:'https://lcssports.com/sports/football/schedule',
 'boys-basketball':'https://lcssports.com/sports/boys-basketball/schedule',
 'girls-basketball':'https://lcssports.com/sports/womens-basketball/schedule'
};
const clean = value => String(value||'').replace(/<[^>]*>/g,' ').replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(+n)).replace(/&#x([\da-f]+);/gi,(_,n)=>String.fromCharCode(parseInt(n,16))).replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&apos;|&#39;/g,"'").replace(/\s+/g,' ').trim();
function field(markup,cls) {
 return markup.match(new RegExp('<div[^>]*class="[^"\\n]*\\b'+cls+'\\b[^"\\n]*"[^>]*>([\\s\\S]*?)<\\/div>'))?.[1]||'';
}
export function parseSchedule(markup,sport,checkedAt) {
 const title=clean(markup.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);
 const season=title.match(/\b(20\d{2})-(\d{2}|20\d{2})\b/);
 if(!season||!title.includes('Lincoln Christian'))throw new Error('Unrecognized school/season');
 const startYear=+season[1],endYear=season[2].length===2?2000+(+season[2]):+season[2];
 const starts=[...markup.matchAll(/<li\b[^>]*data-game-id="(\d+)"[^>]*>/g)];
 if(!starts.length)throw new Error('No recognizable game rows');
 const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
 const events=starts.map((row,i)=>{
  const chunk=markup.slice(row.index,starts[i+1]?.index||markup.length);
  const spans=[...field(chunk,'sidearm-schedule-game-opponent-date').matchAll(/<span[^>]*>([\s\S]*?)<\/span>/g)].map(x=>clean(x[1]));
  const dm=(spans[0]||'').match(/^([A-Za-z]{3}) (\d{1,2})\b/),month=dm?months.indexOf(dm[1]):-1;
  const opponent=clean(field(chunk,'sidearm-schedule-game-opponent-name'));
  if(month<0||!opponent)throw new Error('Incomplete game row '+row[1]);
  const year=month>=6?startYear:endYear,date=year+'-'+String(month+1).padStart(2,'0')+'-'+dm[2].padStart(2,'0');
  const tm=(spans[1]||'').match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  const time=tm?String((+tm[1]%12)+(tm[3].toUpperCase()==='PM'?12:0)).padStart(2,'0')+':'+tm[2]:'';
  if(new Date(date+'T12:00:00Z').toISOString().slice(0,10)!==date)throw new Error('Invalid date');
  const result=clean(field(chunk,'sidearm-schedule-game-result'));
  const site=/sidearm-schedule-home-game\b/.test(row[0])?'Home':/sidearm-schedule-away-game\b/.test(row[0])?'Away':/sidearm-schedule-neutral-game\b/.test(row[0])?'Neutral':'Not listed';
  return {id:'official-'+sport+'-'+row[1],sourceId:row[1],sport,date,time,opponent,site,venue:clean(field(chunk,'sidearm-schedule-game-location')),district:!!clean(field(chunk,'sidearm-schedule-game-conference-conference')),result,kind:/scrimmage/i.test(opponent)?'Scrimmage':'Game',status:/cancel/i.test(result)?'cancelled':result?'completed':'scheduled'};
 }).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
 const duplicates=new Set();for(const event of events){if(duplicates.has(event.id))throw new Error('Duplicate game');duplicates.add(event.id);}
 return {source:sources[sport],season:season[0],checkedAt,status:'ok',events};
}
export async function collect(previous={sports:{}},now=new Date()) {
 const sports={};let failures=0;
 await Promise.all(Object.entries(sources).map(async([sport,url])=>{
  try {
   const response=await fetch(url,{signal:AbortSignal.timeout(25000),headers:{'User-Agent':'LincolnBroadcastDesk/1.0 (public school schedule refresh)'}});
   if(!response.ok)throw new Error('Source returned '+response.status);
   sports[sport]=parseSchedule(await response.text(),sport,now.toISOString());
  }catch(error){failures++;sports[sport]={...(previous.sports?.[sport]||{source:url,events:[]}),status:'error',attemptedAt:now.toISOString(),warning:'Official source could not be refreshed; last successfully checked schedule retained.'};console.error(sport+': '+error.message);}
 }));
 return {feed:{version:1,timeZone:'America/Chicago',generatedAt:now.toISOString(),sports},failures};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const target=process.argv[2]||'schedule-feed.json';let previous={};
 try{previous=JSON.parse(await fs.readFile(target,'utf8'));}catch{}
 const {feed,failures}=await collect(previous);
 await fs.writeFile(target,JSON.stringify(feed,null,2)+'\n');
 console.log(JSON.stringify(Object.fromEntries(Object.entries(feed.sports).map(([sport,data])=>[sport,{season:data.season,events:data.events.length,status:data.status}]))));
 if(failures)process.exitCode=1;
}
