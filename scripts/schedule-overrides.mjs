import fs from 'node:fs/promises';
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
export function validateOverrides(data){
 if(data?.version!==1||!Array.isArray(data.entries)||data.entries.length>100)throw Error('Invalid confirmed schedule updates');
 const seen=new Set();
 for(const e of data.entries){
  if(!['football','boys-basketball','girls-basketball'].includes(e.sport)||!/^20\d{2}-\d{2}-\d{2}$/.test(e.date)||e.status!=='cancelled'||typeof e.opponent!=='string'||!Array.isArray(e.opponentNames)||!e.opponentNames.includes(e.opponent)||e.opponentNames.some(n=>typeof n!=='string'||!n.trim())||!e.confirmedAt||isNaN(new Date(e.confirmedAt))||typeof e.provenance!=='string'||typeof e.note!=='string')throw Error('Invalid cancellation update');
  const key=e.sport+'|'+e.date+'|'+norm(e.opponent);if(seen.has(key))throw Error('Duplicate cancellation update');seen.add(key);
  if(e.publishedAward){const a=e.publishedAward,safe=u=>{try{const v=new URL(u);return v.protocol==='https:'&&!v.username&&!v.password&&['www.maxpreps.com','lcssports.com','www.touchdownfridaynight.com'].includes(v.hostname);}catch{return false;}};if(a.kind!=='forfeit'||!Number.isInteger(a.score)||!Number.isInteger(a.opponentScore)||a.score<0||a.opponentScore<0||a.score===a.opponentScore||a.result!==(a.score>a.opponentScore?'W ':'L ')+a.score+'-'+a.opponentScore||!safe(a.source)||!safe(a.confirmationSource)||!a.checkedAt||isNaN(new Date(a.checkedAt)))throw Error('Invalid published forfeit award');}
 }
 return data.entries;
}
export async function readOverrides(){return validateOverrides(JSON.parse(await fs.readFile(new URL('../schedule-overrides.json',import.meta.url),'utf8')));}
export function applyOverrides(schedule,sport,entries){
 for(const event of schedule?.events||[]){
  const entry=entries.find(e=>e.sport===sport&&e.date===event.date&&e.opponentNames.some(name=>norm(name)===norm(event.opponent)));
  if(!entry)continue;
  if(!event.confirmedUpdate)event.providerStatus=event.status;
  event.status=entry.status;
  event.confirmedUpdate={status:entry.status,confirmedAt:entry.confirmedAt,provenance:entry.provenance,note:entry.note};
  if(entry.publishedAward)event.publishedAward={...entry.publishedAward};else delete event.publishedAward;
 }
 return schedule;
}
