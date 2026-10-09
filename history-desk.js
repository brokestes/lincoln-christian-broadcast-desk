(function () {
  'use strict';
  var data = window.SCHOOL_HISTORY || {schools:{},series:{},directory:'https://www.iwasatthegame.com/Schools.aspx'};
  var labels = {football:'Football','boys-basketball':'Boys basketball','girls-basketball':'Girls basketball'};
  var sports = {football:'FOOTBALL','boys-basketball':'BASKETBALL (BOYS)','girls-basketball':'BASKETBALL (GIRLS)'};
  function html(value) { return String(value == null ? '' : value).replace(/[&<>"']/g,function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]; }); }
  // Only this verified schedule entry disambiguates Sequoyah Tahlequah from Sequoyah Claremore.
  function opponent(game) { return game.id === 'fb-sequoyah' && game.opponent === 'Sequoyah' ? 'Sequoyah Tahlequah' : game.opponent; }
  function row(rows,sport) { return (rows || []).find(function (r) { return r[0] === sports[sport]; }); }
  function facts(name,sport) {
    var s = data.schools[name];
    if (!s || s.status === 'not-listed') return [];
    var result = [], title = row(s.titles,sport), qualifier = row(s.qualifiers,sport);
    if (sport === 'football' && s.football) {
      var f = s.football;
      result.push({text:'Archived football W–L–T: ' + f.wins + '–' + f.losses + '–' + f.ties + ' in ' + f.games + ' games (' + f.years + '). Does not include 2026.',url:f.source});
    }
    result.push({text:title ? 'State title years: ' + title[1] + '.' : 'No ' + labels[sport].toLowerCase() + ' state title is listed in this archive.',url:s.titlesSource});
    if (qualifier) {
      var years = qualifier[1].split(/,\s*/);
      result.push({text:(sport === 'football' ? 'Playoff seasons' : 'State-tournament seasons') + ': ' + years.length + ' listed; latest listed ' + years[0] + '. Recent entries: ' + years.slice(0,3).join(', ') + '.',url:s.qualifiersSource});
    } else result.push({text:'No ' + labels[sport].toLowerCase() + ' tournament appearances are listed in this archive.',url:s.qualifiersSource});
    if (sport === 'boys-basketball' && s.boysCareerPoints) {
      var scorer = s.boysCareerPoints.match(/(\d+):\s*([^()]+)\((\d{4})\)/);
      if (scorer) result.push({text:'School career scoring list is headed by ' + scorer[2].trim() + ': ' + Number(scorer[1]).toLocaleString('en-US') + ' points (' + scorer[3] + ').',url:s.recordSource});
    }
    if (sport === 'football') {
      var other = (s.titles || []).find(function (r) { return r[0] !== 'FOOTBALL'; });
      if (other) result.push({text:'Beyond football — ' + other[0].toLowerCase() + ' title years: ' + other[1] + '.',url:s.titlesSource});
    }
    return result;
  }
  function teamMarkup(name,side,sport,printing) {
    var s = data.schools[name], body;
    if (!s) body = '<p class="source-note">History has not been researched for this school yet. Use the school directory to verify it; no facts have been guessed.</p>';
    else if (s.status === 'not-listed') body = '<p class="source-note">' + html(s.reason) + '</p>';
    else {
      body = '<ul class="history-facts">' + facts(name,sport).map(function (fact) { return '<li>' + html(fact.text) + ' <a href="' + html(fact.url) + '" target="_blank" rel="noreferrer">Source ↗</a></li>'; }).join('') + '</ul>';
      var qualifier = row(s.qualifiers,sport);
      if (qualifier && !printing) body += '<details class="history-details"><summary>All listed ' + (sport === 'football' ? 'playoff' : 'state-tournament') + ' years</summary><p>' + html(qualifier[1]) + '</p></details>';
      if (!printing) body += '<button class="small-btn" data-history-note="' + side + '">Add these facts to ' + (side === 'lincoln' ? 'Lincoln' : 'opponent') + ' notes</button>';
    }
    return '<article class="history-team' + (printing ? ' print-section' : '') + '"><h3>' + html(name) + '</h3>' + body + '</article>';
  }
  function seriesMarkup(game,sport,printing) {
    if (sport !== 'football') return '';
    var name = opponent(game), series = data.series[name], text, list = '';
    if (!series || series.status !== 'published') {
      text = series ? 'No Lincoln–' + name + ' results are listed in the source’s matchup selector. This does not establish a first-ever meeting.' : 'No verified matchup history loaded for this opponent.';
    } else {
      var completed = series.games.filter(function (r) { return /^[WLT]$/.test(r[1]); });
      var wins = completed.filter(function (r) { return r[1] === 'W'; }).length, losses = completed.filter(function (r) { return r[1] === 'L'; }).length, ties = completed.filter(function (r) { return r[1] === 'T'; }).length;
      var latest = series.games.reduce(function (max,r) { return Math.max(max,Number(r[0])); },0);
      text = 'Lincoln’s record in the listed, scored meetings: ' + wins + '–' + losses + (ties ? '–' + ties : '') + '. Latest year listed: ' + latest + '. This is archive coverage, not a complete current series record.';
      if (completed.length !== series.games.length) text += ' ' + (series.games.length - completed.length) + ' unscored source ' + (series.games.length - completed.length === 1 ? 'entry is' : 'entries are') + ' excluded; not counted as a tie.';
      list = '<ul class="history-facts">' + completed.slice(0,3).map(function (r) { return '<li>' + html(r[0] + ' · ' + r[2]) + '</li>'; }).join('') + '</ul>';
      if (!printing) list += '<details class="history-details"><summary>All ' + series.games.length + ' archive entries</summary><ul class="history-facts">' + series.games.map(function (r) { return '<li>' + html(r[0] + ' · ' + r[2]) + (r[1] === '-' ? ' · No score listed' : '') + '</li>'; }).join('') + '</ul></details>';
    }
    return '<div class="history-series' + (printing ? ' print-section' : '') + '"><h3>Past Lincoln–' + html(name) + ' meetings</h3><p>' + html(text) + '</p>' + list + (series ? '<a href="' + html(series.source) + '" target="_blank" rel="noreferrer">Open head-to-head archive' + (series.status === 'published' ? ' · select Lincoln and ' + html(name) : '') + ' ↗</a>' : '') + '</div>';
  }
  function markup(sport,game,printing) {
    return '<div class="panel-heading split"><div><span class="eyebrow">I WAS AT THE GAME · HISTORICAL CONTEXT</span><h2>History &amp; broadcast nuggets</h2></div><a href="' + html(data.directory) + '" target="_blank" rel="noreferrer">School directory ↗</a></div><p class="history-caveat">Checked Oct. 8, 2026 · Dated research snapshot, not automatic live synchronization. Football W–L–T totals end in 2025; title and tournament lists have their own coverage. An absent entry is not proof that an event never happened.</p><div class="matchup-history-grid">' + teamMarkup('Lincoln Christian','lincoln',sport,printing) + (game ? teamMarkup(opponent(game),'opponent',sport,printing) : '<article class="history-team"><h3>Opponent</h3><p>Add a verified game to see the opposing school’s history.</p></article>') + '</div>' + (game ? seriesMarkup(game,sport,printing) : '');
  }
  window.LincolnHistory = {
    render:function (sport,game) { document.getElementById('matchupHistory').innerHTML = markup(sport,game,false); },
    printMarkup:function (sport,game) { return '<section class="history-print-section">' + markup(sport,game,true) + '</section>'; },
    sources:function (game) {
      return [{name:'I Was At The Game — schools',note:'Historical records and broadcast context',url:data.directory}].concat(['Lincoln Christian',opponent(game)].map(function (name) {
        var s = data.schools[name];
        return s && s.status !== 'not-listed' ? {name:name + ' — history archive',note:'School-specific titles, records and appearances',url:s.source} : null;
      }).filter(Boolean));
    },
    addToNotes:function (sport,game,side) {
      if (!game || !['lincoln','opponent'].includes(side)) return false;
      var name = side === 'lincoln' ? 'Lincoln Christian' : opponent(game), entries = facts(name,sport);
      if (!entries.length) return false;
      var field = side === 'lincoln' ? 'lincolnStory' : 'opponentStory';
      var block = 'I Was At The Game · ' + name + ' · ' + labels[sport] + ' · checked Oct. 8, 2026\n' + entries.map(function (f) { return f.text + '\n' + f.url; }).join('\n\n');
      var previous = game.notes[field] || '';
      if (previous.indexOf(block) >= 0) return false;
      game.notes[field] = previous + (previous.trim() ? '\n\n' : '') + block;
      return true;
    }
  };
}());
