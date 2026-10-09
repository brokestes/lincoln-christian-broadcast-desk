(function(){
 'use strict';
 var labels={football:'Football','boys-basketball':'Boys basketball','girls-basketball':'Girls basketball'};
 var sources={football:'https://lcssports.com/sports/football/schedule','boys-basketball':'https://lcssports.com/sports/boys-basketball/schedule','girls-basketball':'https://lcssports.com/sports/womens-basketball/schedule'};
 var api=null,feed=null,filter='all',expanded=false,busy=false,connectionWarning='',timer=null;
 var remote='https://raw.githubusercontent.com/brokestes/lincoln-christian-broadcast-desk/main/schedule-feed.json';
 function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
 function today(now){var parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now||new Date());var values={};parts.forEach(function(p){values[p.type]=p.value;});return values.year+'-'+values.month+'-'+values.day;}
 function readableTime(time){if(!/^\d{2}:\d{2}$/.test(time||''))return 'Time TBD';var hour=+time.slice(0,2);return (hour%12||12)+time.slice(2)+' '+(hour>=12?'PM':'AM')+' CT';}
 function stamp(date){if(!date||isNaN(new Date(date)))return 'Not checked';return new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(date));}
 function validFeed(value){
  if(!value||value.version!==1||value.timeZone!=='America/Chicago'||!value.sports)throw Error('Invalid schedule feed');
  Object.keys(labels).forEach(function(sport){var data=value.sports[sport];if(!data||data.source!==sources[sport]||!Array.isArray(data.events)||data.events.length>250)throw Error('Invalid sport schedule');var seen={};data.events.forEach(function(e){if(e.sport!==sport||typeof e.id!=='string'||seen[e.id]||typeof e.opponent!=='string'||!/^20\d{2}-\d{2}-\d{2}$/.test(e.date)||e.time&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(e.time))throw Error('Invalid event');seen[e.id]=true;});});return value;
 }
 function matches(a,b){var norm=function(n){return String(n).toLowerCase().replace(/[^a-z0-9 ]/g,'').trim();};var x=norm(a.opponent),y=norm(b.opponent);return a.sport===b.sport && (a.id===b.id || a.sourceId && a.sourceId===b.scheduleSourceId || a.date===b.date && (x===y||x.indexOf(y+' ')===0||y.indexOf(x+' ')===0));}
 function allEvents(state){
  var result=[];
  Object.keys(labels).forEach(function(sport){var data=feed&&feed.sports[sport];(data?data.events:[]).forEach(function(e){result.push(Object.assign({},e,{source:data.source,checkedAt:data.checkedAt}));});
   state.sports[sport].games.forEach(function(g){var local=Object.assign({},g,{sport:sport,sourceId:g.scheduleSourceId,source:sources[sport],local:true,kind:/scrimmage/i.test(g.opponent)?'Scrimmage':'Game'});if(!result.some(function(e){return matches(e,local);}))result.push(local);});
  });return result;
 }
 function upcoming(events,now){var day=today(now);return events.filter(function(e){return e.date>=day&&!e.result&&e.status!=='cancelled'&&e.status!=='completed';}).sort(function(a,b){return (a.date+(a.time||'99:99')).localeCompare(b.date+(b.time||'99:99'))||a.sport.localeCompare(b.sport);});}
 function eventButton(e,label,cls){return '<button class="'+(cls||'small-btn')+'" data-home-event="'+esc(e.id)+'" data-home-sport="'+esc(e.sport)+'">'+esc(label||'Open prep')+' <span aria-hidden="true">↗</span></button>';}
 function render(){
  if(!api)return;
  var state=api.getState(),events=allEvents(state),next=upcoming(events),day=today();
  document.getElementById('homeToday').textContent=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',weekday:'long',month:'long',day:'numeric',year:'numeric'}).format(new Date())+' · Tulsa time';
  var first=next[0];
  document.getElementById('homeNext').innerHTML=first?'<div><span class="eyebrow">NEXT ON THE CALENDAR</span><strong>Lincoln vs '+esc(first.opponent)+'</strong><span>'+esc(labels[first.sport])+' · '+esc(new Date(first.date+'T12:00:00Z').toLocaleDateString('en-US',{timeZone:'UTC',month:'short',day:'numeric',weekday:'short'}))+' · '+esc(readableTime(first.time))+' · '+esc(first.site)+'</span></div>'+eventButton(first,'Open game desk','home-next-button'):'<div><span class="eyebrow">NEXT ON THE CALENDAR</span><strong>No upcoming dates loaded</strong><span>Check the official schedules or add a confirmed game.</span></div>';
  var shown=next.filter(function(e){return filter==='all'||e.sport===filter;}),list=expanded?shown:shown.slice(0,8);
  document.getElementById('homeEvents').innerHTML=list.length?list.map(function(e){var date=new Date(e.date+'T12:00:00Z');return '<article class="home-event"><div class="home-event-date"><span>'+esc(date.toLocaleDateString('en-US',{timeZone:'UTC',month:'short'}))+'</span><strong>'+esc(date.getUTCDate())+'</strong><small>'+esc(date.toLocaleDateString('en-US',{timeZone:'UTC',weekday:'short'}))+'</small></div><div class="home-event-details"><span class="home-sport-tag '+esc(e.sport)+'">'+esc(labels[e.sport])+'</span>'+(e.kind==='Scrimmage'?'<span class="home-event-kind">Scrimmage</span>':'')+(e.local?'<span class="home-event-kind">Saved on this device</span>':'')+'<h3>'+esc(e.opponent)+'</h3><p>'+esc(e.date===day?'Today · ':'')+esc(readableTime(e.time))+' · '+esc(e.site)+(e.venue?' · '+esc(e.venue):'')+'</p></div>'+eventButton(e)+'</article>';}).join(''):'<p class="source-note">No upcoming events loaded for this sport. Check its official schedule below.</p>';
  document.getElementById('homeMore').hidden=shown.length<=8;document.getElementById('homeMore').textContent=expanded?'Show fewer events':'Show all '+shown.length+' upcoming events';
  var status=feed?Object.keys(labels).map(function(s){var d=feed.sports[s],stale=!d.checkedAt||Date.now()-new Date(d.checkedAt).getTime()>24*60*60*1000;return '<a href="'+sources[s]+'" target="_blank" rel="noreferrer">'+esc(labels[s])+' ↗</a>: '+esc(stamp(d.checkedAt))+(d.status!=='ok'?' · refresh failed; retained data':stale?' · needs a fresh source check':'');}).join('<br>'):'Official feed is loading. Showing saved game dates until it arrives.';
  document.getElementById('homeFeedStatus').innerHTML=(connectionWarning?'<strong>'+esc(connectionWarning)+'</strong><br>':'')+status+'<span class="home-feed-cadence">School checks scheduled every 3 hours · this page checks the feed every 5 minutes.</span>';
  document.getElementById('homeRefresh').disabled=busy;document.getElementById('homeRefresh').textContent=busy?'Checking…':'Refresh';
  var selected=state.sports[state.activeSport].games.find(function(g){return g.id===state.activeGameIds[state.activeSport];});
  document.getElementById('homeSelectedGame').textContent=selected?'Tools open your selected game: '+labels[state.activeSport]+' vs '+selected.opponent+'.':'Choose an upcoming game to start a broadcast packet.';
  var school=window.SCHOOL_HISTORY&&window.SCHOOL_HISTORY.schools['Lincoln Christian'];
  var footballTitles=school&&(school.titles||[]).find(function(t){return t[0]==='FOOTBALL';});
  var girlsTitles=school&&(school.titles||[]).find(function(t){return t[0]==='BASKETBALL (GIRLS)';});
  document.getElementById('homeLegacy').innerHTML='<div class="home-legacy-stat"><strong>'+esc(footballTitles?footballTitles[1].split(',').length:'—')+'</strong><span>Football state titles<br><small>'+esc(footballTitles?footballTitles[1]:'Not researched')+'</small></span></div><div class="home-legacy-stat"><strong>'+esc(girlsTitles?girlsTitles[1].split(',').length:'—')+'</strong><span>Girls basketball state titles<br><small>'+esc(girlsTitles?girlsTitles[1]:'Not researched')+'</small></span></div>';
  document.getElementById('homeRecords').innerHTML=Object.keys(labels).map(function(sport){var data=feed&&feed.sports[sport],finals=(data?data.events:[]).filter(function(e){return e.kind!=='Scrimmage'&&/^[WLT][, ]/i.test(e.result);}),wins=finals.filter(function(e){return /^W/i.test(e.result);}).length,losses=finals.filter(function(e){return /^L/i.test(e.result);}).length,ties=finals.length-wins-losses,last=finals[finals.length-1];return '<article class="panel home-record-card"><span class="eyebrow">'+esc(labels[sport])+'</span><strong>'+esc(finals.length?wins+'–'+losses+(ties?'–'+ties:''):'No finals posted')+'</strong><p>'+esc(last?'Latest posted: '+last.result+' vs '+last.opponent:'Upcoming '+(data?data.season:'season')+' schedule. No record inferred from missing results.')+'</p><a href="'+sources[sport]+'" target="_blank" rel="noreferrer">Official schedule & results ↗</a><small>'+esc(stamp(data&&data.checkedAt))+(data&&data.status!=='ok'?' · retained data':'')+'</small>'+(sport==='football'?'<small class="home-conflict">Oct. 2 score differs between sources: official 62–6, MaxPreps 61–6. Confirm with the scorekeeper.</small>':'')+'</article>';}).join('');
 }
 async function refresh(){
  if(busy)return;busy=true;render();
  try{var response=await fetch(remote+'?t='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('No feed');var value=validFeed(await response.json());if(!feed||new Date(value.generatedAt)>=new Date(feed.generatedAt))feed=value;connectionWarning='';}
  catch(e){connectionWarning='Could not retrieve the latest feed. Showing the last available schedule; check source dates below.';}
  finally{busy=false;render();}
 }
 function init(options){
  api=options;render();
  fetch('schedule-feed.json',{cache:'no-store'}).then(function(r){if(!r.ok)throw Error('No local feed');return r.json();}).then(function(v){v=validFeed(v);if(!feed||new Date(v.generatedAt)>new Date(feed.generatedAt))feed=v;render();}).catch(function(){});
  refresh();clearInterval(timer);timer=setInterval(function(){if(!document.hidden)refresh();},300000);
  document.addEventListener('visibilitychange',function(){if(!document.hidden){render();refresh();}});
  document.addEventListener('click',function(event){var target=event.target.closest('[data-home-event],[data-home-section],#homeRefresh,#homeMore');if(!target)return;if(target.id==='homeRefresh')refresh();if(target.id==='homeMore'){expanded=!expanded;render();}if(target.dataset.homeSection)api.openSection(target.dataset.homeSection);if(target.dataset.homeEvent){var entry=allEvents(api.getState()).find(function(e){return e.id===target.dataset.homeEvent&&e.sport===target.dataset.homeSport;});if(entry)api.openEvent(entry);}});
  document.getElementById('homeSportFilter').addEventListener('change',function(){filter=this.value;expanded=false;render();});
 }
 window.LincolnHome={init:init,render:render,refresh:refresh};
})();
