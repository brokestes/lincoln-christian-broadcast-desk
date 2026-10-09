(function () {
  'use strict';
  var data = window.BROADCAST_DATA || {}, history = window.SCHOOL_HISTORY || {};
  var recap = 'https://lcssports.com/news/2026/10/5/football-no-1-lincoln-dominates-at-victory-in-62-6-road-district-win.aspx';
  var preview = 'https://lcssports.com/news/2026/10/2/football-week-5-preview-top-ranked-bulldogs-back-on-road-to-face-rival-victory.aspx';
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];}); }
  function entry(text,url,date,label) { return {text:text,url:url,date:date,label:label||'Source'}; }
  function table(name) { return (data.stats || []).find(function(t){return t.title === name;}); }
  function value(t,r,key) { return t && r ? r[t.headers.indexOf(key)] : ''; }
  function total(name,key) { var t=table(name);return value(t,t && t.total,key); }
  function leader(name,key) {
    var t=table(name);if(!t)return null;
    return t.rows.filter(function(r){var v=value(t,r,key);return v!=='' && Number.isFinite(Number(v));}).slice().sort(function(a,b){return Number(value(t,b,key))-Number(value(t,a,key));})[0] || null;
  }
  function statFact(name,key,description) {
    var t=table(name),r=leader(name,key);if(!r)return null;
    return entry('#'+value(t,r,'#')+' '+value(t,r,'Athlete Name')+' — '+description(t,r)+'.',data.statsSource,'Through five games · updated Oct. 3, 2026','MaxPreps');
  }
  function titleFact(name,sport) {
    var school=(history.schools || {})[name];if(!school || school.status==='not-listed')return null;
    var label={football:'FOOTBALL','boys-basketball':'BASKETBALL (BOYS)','girls-basketball':'BASKETBALL (GIRLS)'}[sport];
    var titles=(school.titles || []).find(function(r){return r[0]===label;});
    return titles ? entry('State championship years: '+titles[1]+'.',school.titlesSource,'Archive checked Oct. 8, 2026','History archive') : null;
  }
  function facts(sport,game) {
    var result={lincolnStory:[],opponentStory:[],keys:[]};if(!game)return result;
    var opponent=game.id==='fb-sequoyah' && game.opponent==='Sequoyah'?'Sequoyah Tahlequah':game.opponent;
    result.lincolnStory.push(titleFact('Lincoln Christian',sport));
    result.opponentStory.push(titleFact(opponent,sport));
    var school=(history.schools || {})[opponent];
    var qualifier=school && (school.qualifiers || []).find(function(r){return r[0]==={football:'FOOTBALL','boys-basketball':'BASKETBALL (BOYS)','girls-basketball':'BASKETBALL (GIRLS)'}[sport];});
    if(qualifier)result.opponentStory.push(entry('Latest archived '+(sport==='football'?'playoff':'state-tournament')+' season: '+qualifier[1].split(',')[0]+'. Archive coverage, not a prediction.',school.qualifiersSource,'Checked Oct. 8, 2026','History archive'));
    // This football snapshot is usable only after its five source games, in this season.
    if(sport==='football' && game.date>='2026-10-09' && game.date<='2026-11-06') {
      var pass=total('Passing','Y/G'),rush=total('Rushing','Y/G'),yards=total('Total Yards','Y/G');
      if(pass && rush && yards)result.keys.push(entry('OFFENSE · '+yards+' yards/game: '+rush+' rushing and '+pass+' passing. Published five-game season totals.',data.statsSource,'Updated Oct. 3, 2026','MaxPreps'));
      result.keys.push(statFact('Passing','Yds',function(t,r){return value(t,r,'Yds')+' passing yards, '+value(t,r,'TD')+' TD, '+value(t,r,'Int')+' INT';}));
      result.keys.push(statFact('Rushing','Yds',function(t,r){return value(t,r,'Yds')+' rushing yards, '+value(t,r,'TD')+' TD, '+value(t,r,'Avg')+' yards/carry';}));
      result.keys.push(statFact('Receiving','Yds',function(t,r){return value(t,r,'Rec')+' catches, '+value(t,r,'Yds')+' yards, '+value(t,r,'TD')+' TD';}));
      result.keys.push(statFact('Tackles','Tot Tckls',function(t,r){return 'DEFENSE · '+value(t,r,'Tot Tckls')+' total tackles'+(value(t,r,'TFL')?', '+value(t,r,'TFL')+' TFL':'');}));
      result.keys.push(statFact('Sacks','Sacks',function(t,r){return value(t,r,'Sacks')+' sacks';}));
      var interceptions=total('Defensive Statistics','Int'),recoveries=total('Defensive Statistics','Fmb Rec');
      if(interceptions && recoveries)result.keys.push(entry('DEFENSE · MaxPreps lists '+interceptions+' interceptions and '+recoveries+' fumble recoveries. Lincoln’s Oct. 5 recap reports 10 takeaways; source totals differ.',data.statsSource,'Five-game snapshot · compare official recap','MaxPreps'));
      result.lincolnStory.push(entry('Coaching context: Jerry Ricke is head coach; Jeff Comfort is defensive coordinator.',preview,'Official preview · Oct. 2, 2026','Lincoln athletics'));
    }
    if(sport==='football' && game.id==='fb-heavener' && game.opponent==='Heavener' && game.date==='2026-10-09') {
      result.lincolnStory.push(entry('STREAK WATCH · Official Oct. 2 preview: 51 consecutive district wins and nine straight district titles before Victory. That district win makes 52 consecutive wins entering Heavener (calculated from those sources).',preview,'Oct. 2 preview + Oct. 5 recap','Lincoln athletics'));
      result.lincolnStory.push(entry('RECENT FORM · Against Victory, Lincoln totaled 502 yards on 36 plays and allowed 101 yards. Ronan Jones returned a kickoff 88 yards for a touchdown.',recap,'Official recap · Oct. 5, 2026','Lincoln athletics'));
      result.opponentStory.push(entry('Head coach: Jeff Broyles. Listed assistants: Matt Adams, Jody Clubb and Nathan Janway. Career record/tenure not independently verified.',(data.opponents.Heavener || {}).source,'Roster checked Oct. 8, 2026','MaxPreps staff'));
      result.keys.push(entry('LAST GAME · Victory converted 1 of 10 third downs; Lincoln forced eight punts in 11 possessions. The official recap reports 10 takeaways through five games.',recap,'Oct. 2 game · reported Oct. 5, 2026','Lincoln athletics'));
      result.keys.push(entry('VERIFY BEFORE AIR · Victory final is 62–6 in the official headline/live feed but 61–6 in MaxPreps and the recap text. The older sheet’s Monsey #54 / Peterson #5 differ from the current official roster’s #3 / #0. Confirm final score and game-day jerseys.',recap,'Source conflicts · checked Oct. 9, 2026','Official recap'));
      result.keys.push(entry('First-ever meeting, coaching career records, eight straight semifinals and the sheet’s home-record claim are not confirmed here. Do not announce these as verified facts.',preview,'Older-sheet claims not carried forward','Published context'));
    }
    if(sport==='football') {
      var info=(data.opponents || {})[game.opponent];
      (info && info.players || []).filter(function(p){return p.referenceHighlight;}).forEach(function(p){
        var fact=(p.facts || []).find(function(f){return /touchdown|interception/i.test(f.text);}) || (p.facts || []).find(function(f){return /basketball|individual/i.test(f.text);});
        if(fact)result.opponentStory.push(entry('#'+p.number+' '+p.name+' — '+fact.text,fact.url,fact.date,'Player background'));
      });
    }
    Object.keys(result).forEach(function(k){result[k]=result[k].filter(Boolean);});return result;
  }
  function markup(items,printing) {
    if(!items.length)return printing?'':'<p class="highlight-empty">No verified highlights researched for this matchup yet. Your notes remain available below.</p>';
    return '<div class="'+(printing?'print-highlights':'note-highlights')+'"><strong>RESEARCHED HIGHLIGHTS</strong>'+(!printing?'<p>Already prepared for you · included in Print packet · dated research, not live updates.</p>':'')+'<ul>'+items.map(function(f){return '<li>'+esc(f.text)+' <a href="'+esc(/^https:\/\//.test(f.url || '')?f.url:'#')+'" target="_blank" rel="noreferrer">'+esc(f.label)+' ↗</a><small>'+esc(f.date)+'</small></li>';}).join('')+'</ul></div>';
  }
  window.LincolnPrep={facts:facts,markup:markup,render:function(sport,game){var f=facts(sport,game);Object.keys(f).forEach(function(k){document.getElementById(k+'Highlights').innerHTML=markup(f[k],false);});}};
}());
