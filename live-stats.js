(function () {
  'use strict';
  const DEFAULT_URL = 'https://www.turbostatslive.com/football/webcast/08002611450495';
  let game = null, persist = null, timer = null, controller = null, generation = 0, feed = null, received = null, changed = null, fingerprint = '', error = '', loading = false;
  const escape = s => String(s == null ? '' : s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g,'');
  function feedId(value) {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !['turbostatslive.com','www.turbostatslive.com'].includes(url.hostname) || url.username || url.password || url.port) throw new Error('Use an HTTPS TurboStats football webcast link.');
    const match = url.pathname.match(/^\/football\/webcast\/(\d+)\/?$/);
    if (!match) throw new Error('Use the football/webcast link from TurboStats.');
    return match[1];
  }
  function dateISO(s) {
    const match = String(s).match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
    return match ? (match[3].length===2?'20'+match[3]:match[3])+'-'+match[1].padStart(2,'0')+'-'+match[2].padStart(2,'0') : '';
  }
  function matches(selected, data) {
    if (!selected || !data) return false;
    const names = data.teams.map(t=>normalize(t.name));
    return dateISO(data.gameInfo.date) === selected.date && names.includes('lincolnchristian') && names.includes(normalize(selected.opponent));
  }
  const value = v => v === undefined || v === null || v === '' ? '—' : v;
  const at = (obj,path) => path.split('.').reduce((v,k)=>v == null ? undefined : v[k],obj);
  function table(headers,rows) {
    return '<div class="table-scroll"><table class="season-table"><thead><tr>'+headers.map(x=>'<th>'+escape(x)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(x=>'<td>'+escape(value(x))+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  }
  const totalFields = [['Total offense','totoffyards'],['Offensive plays','totoffplays'],['Yards / play','totoffavg'],['Rush attempts','rush.att'],['Rush yards','rush.yds'],['Rush TD','rush.td'],['Pass completions','pass.comp'],['Pass attempts','pass.att'],['Pass yards','pass.yds'],['Pass TD','pass.td'],['Interceptions thrown','pass.int'],['First downs','firstdowns.no'],['Third down made','conversions.thirdconv'],['Third down attempts','conversions.thirdatt'],['Fourth down made','conversions.fourthconv'],['Fourth down attempts','conversions.fourthatt'],['Penalties','penalties.no'],['Penalty yards','penalties.yds'],['Fumbles lost','fumbles.lost'],['Possession','misc.top']];
  function totals(data) { return table(['Team stat',...data.teams.map(t=>t.name)],totalFields.map(([label,path])=>[label,...data.teams.map(t=>at(t.totals,path))])); }
  function playerTables(data) {
    const categories = [
      ['Passing','pass',[['Comp','comp'],['Att','att'],['Yds','yds'],['TD','td'],['INT','int']]],
      ['Rushing','rush',[['Att','att'],['Yds','yds'],['TD','td'],['Long','long']]],
      ['Receiving','rcv',[['Rec','no'],['Yds','yds'],['TD','td'],['Long','long']]],
      ['Defense','defense',[['Solo','tackua'],['Assist','tacka'],['Tackles','tack'],['TFL solo','tflua'],['TFL assist','tfla'],['Sacks','sacks'],['INT','int'],['FF','ff'],['FR','fr'],['PBU','brup']]]
    ];
    return data.teams.map(team=>'<section class="live-team"><h3>'+escape(team.name)+' · live player stats</h3>'+categories.map(([title,key,cols])=>{
      const players = (team.players || []).filter(p=>p.stats && p.stats[key] && Object.values(p.stats[key]).some(v=>Number(v)>0));
      if (!players.length) return '<p class="source-note">'+title+': no player entries recorded in this feed yet.</p>';
      return '<details class="stat-details"'+(key==='defense'?'':' open')+'><summary>'+title+'</summary>'+table(['#','Player',...cols.map(c=>c[0])],players.map(p=>{
        const number = p.uni || String(p.name).match(/^\d+\s/)?.[0]?.trim() || '—';
        const name = p.uni ? p.name : String(p.name).replace(/^\d+\s+/,'');
        return [number,name,...cols.map(c=>p.stats[key][c[1]])];
      }))+'</details>';
    }).join('')+'</section>').join('');
  }
  function details(data) {
    const info=data.gameInfo, down=info.downToGo || {};
    const warnings = data.teams.filter(t=>(t.qtrs || []).length && t.qtrs.reduce((sum,q)=>sum+Number(q),0)!==Number(t.score)).map(t=>t.name+': provider quarter totals do not add up to its reported final score. Confirm with the scorekeeper.');
    const quality = warnings.length ? '<p class="warning">Source check: '+escape(warnings.join(' '))+'</p>' : '';
    return quality+'<div class="live-scoreboard">'+data.teams.map(t=>'<div><span>'+escape(t.name)+'</span><strong>'+escape(t.score)+'</strong><small>Quarters: '+escape((t.qtrs||[]).join(' · '))+'</small></div>').join('')+'</div><p class="live-game-info">'+escape(info.date)+' · '+escape(info.venue)+' · <strong>'+escape(info.clock || 'Clock not supplied')+'</strong></p><p>'+escape([down.team,down.qtr?'Q'+down.qtr:'',down.down?'Down '+down.down:'',down.togo?'To go '+down.togo:'',down.spot].filter(Boolean).join(' · '))+'</p><p>'+escape(down.lastplay || '')+'</p><details class="stat-details" open><summary>Live team totals</summary>'+totals(data)+'</details>'+playerTables(data)+'<details class="stat-details"><summary>Scoring summary</summary>'+table(['Q','Clock','Team','Scorer','Play','Yds','Away','Home'],(data.scoreSummary||[]).map(p=>[p.qtr,p.clock,p.team,p.scorer,p.how,p.yds,p.vscore,p.hscore]))+'</details><details class="stat-details"><summary>Recent plays</summary>'+table(['Q','Team','Player','Play'],(data.lastPlays||[]).map(p=>[p.qtr,p.team,p.player,p.event]))+'</details>';
  }
  function render() {
    const panel=document.getElementById('livePanel');
    if (document.activeElement && document.activeElement.id==='liveUrl') return;
    const scroll = panel.querySelector('.live-feed-content')?.scrollTop || 0;
    const expanded = Array.from(panel.querySelectorAll('details')).map(d=>d.open);
    if (!game) { panel.innerHTML='<div class="panel-heading"><h2>Live stats</h2><p>TurboStats football feed is available when a football game is selected. Basketball live feed has not been configured.</p></div>';return; }
    const match=matches(game,feed);
    panel.innerHTML='<div class="panel-heading split"><div><span class="eyebrow">LIVE GAME DESK</span><h2>TurboStats · automatic feed</h2></div><span class="live-badge">'+(loading?'Checking…':error?'Connection issue':!game.livePaused?'Auto · 20 sec':'Paused')+'</span></div><div class="live-controls"><label class="field"><span>Reusable football webcast link</span><input id="liveUrl" type="url" value="'+escape(game.liveUrl || DEFAULT_URL)+'"></label><button class="small-btn" data-live="save">Use link</button><button class="small-btn" data-live="refresh">Refresh now</button><button class="small-btn" data-live="pause">'+(game.livePaused?'Resume auto':'Pause auto')+'</button><a target="_blank" rel="noreferrer" href="'+escape(game.liveUrl || DEFAULT_URL)+'">Open original ↗</a></div><div class="live-status" role="status">'+(error?'<p class="warning">'+escape(error)+' Any retained numbers below are the last successful retrieval, not current.</p>':'')+(feed&&!match?'':feed?'<p class="match-notice">Feed matches this game. Statistics are supplied by the scorekeeper.</p>':'<p>Waiting for a valid feed. Manual quick stats remain available in the Stats tab.</p>')+(received?'<p class="source-note">Last retrieved '+escape(received.toLocaleTimeString())+' · last observed change '+escape(changed.toLocaleTimeString())+' · '+(feed.config.complete?'Provider marks game complete.':'Refreshes every 20 seconds while this tab is visible; provider may update less often.')+'</p>':'')+'</div><div class="live-feed-content">'+(feed?details(feed):'')+'</div>';
    if (feed) {
      panel.querySelectorAll('details').forEach((d,i)=>{if(expanded[i]!==undefined)d.open=expanded[i];});
      panel.querySelector('.live-feed-content').scrollTop=scroll;
      if(match && game.result) {
        const score=game.result.match(/(\d+)\D+(\d+)/);
        const lc=feed.teams.find(t=>normalize(t.name)==='lincolnchristian');
        if(score && Number(score[1])!==Number(lc.score)) panel.querySelector('.live-status').innerHTML+='<p class="warning">Source discrepancy: the saved schedule result is '+escape(game.result)+'; TurboStats reports '+escape(lc.score)+'. Confirm the final with Lincoln before announcing it.</p>';
      }
    }
  }
  async function refresh() {
    if (!game || loading) return;
    const version=generation;
    loading=true;error='';render();
    controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
    try {
      const id=feedId(game.liveUrl || DEFAULT_URL);
      const response=await fetch('https://turbostatslive.com/api/v1/gamecast/'+id+'?sport=football',{signal:controller.signal,cache:'no-store'});
      if (!response.ok) throw new Error('Provider returned HTTP '+response.status);
      const data=await response.json();
      if (!data || !data.gameInfo || !Array.isArray(data.teams) || data.teams.length!==2 || !data.config) throw new Error('No valid game feed received');
      if (version!==generation) return;
      const now=new Date(), key=JSON.stringify(data);
      if (key!==fingerprint) { changed=now;fingerprint=key; }
      feed=data;received=now;
    } catch(e) { if (version===generation) error=e.name==='AbortError'?'Live feed timed out.':'Could not update: '+e.message+'.'; }
    finally { clearTimeout(timeout); if(version===generation){loading=false;controller=null;render();} }
  }
  function schedule() { clearInterval(timer);timer=null;if(game&&!game.livePaused)timer=setInterval(()=>{if(!document.hidden)refresh();},20000); }
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&game&&!game.livePaused)refresh();});
  document.addEventListener('click',e=>{
    const button=e.target.closest('[data-live]');if(!button||!game)return;
    if(button.dataset.live==='refresh')refresh();
    if(button.dataset.live==='pause'){game.livePaused=!game.livePaused;persist();schedule();render();}
    if(button.dataset.live==='save'){
      const input=document.getElementById('liveUrl');
      try{feedId(input.value);game.liveUrl=input.value.trim();persist();generation++;if(controller)controller.abort();loading=false;feed=null;received=null;changed=null;fingerprint='';schedule();refresh();}
      catch(err){input.setCustomValidity(err.message);input.reportValidity();input.addEventListener('input',()=>input.setCustomValidity(''),{once:true});}
    }
  });
  window.LincolnLive={
    configure(selected,save){
      persist=save;
      if(game===selected){render();return;}
      generation++;if(controller)controller.abort();clearInterval(timer);game=selected;feed=null;received=null;changed=null;fingerprint='';error='';loading=false;render();schedule();if(game)refresh();
    },
    printMarkup(selected){
      if(!matches(selected,feed))return '<section class="print-section"><h2>Live stats</h2><p>No matching live feed for this selected game. Old or different-game numbers are excluded.</p></section>';
      const printable = details(feed).replaceAll('<details','<section').replaceAll('</details>','</section>').replaceAll('<summary','<h3').replaceAll('</summary>','</h3>');
      return '<div class="print-stat-group"><h2>TurboStats · '+escape(feed.gameInfo.date)+'</h2><p>Retrieved '+escape(received.toLocaleString())+(error?' — CONNECTION ISSUE; retained last retrieval':'')+' · '+escape(game.liveUrl || DEFAULT_URL)+(selected.result?' · Saved schedule result: '+escape(selected.result):'')+'</p>'+printable+'</div>';
    }
  };
})();
