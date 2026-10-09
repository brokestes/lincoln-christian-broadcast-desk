(function () {
  "use strict";

  var STORAGE_KEY = "lincoln-broadcast-desk-v1";
  var SOURCE_DATE = "Oct. 8, 2026";
  var research = window.BROADCAST_DATA;
  var rosterTeam = "lincoln";
  var sportLabels = {
    football: "Football",
    "boys-basketball": "Boys basketball",
    "girls-basketball": "Girls basketball"
  };

  var footballRoster = [
    ["0","Caleb Peterson","Jr.","WR / DB"],["1","Eli Summerlin","Sr.","DB / WR"],["2","Kade Wilson","So.","WR / DB"],
    ["3","Colt Monsey","Sr.","TE / DL"],["5","Cayden Mathurin","Jr.","DB / WR"],["6","Parker Rogers","Sr.","LB / WR"],
    ["7","Max Madrid","So.","RB / DB"],["8","Major Brooks","So.","QB"],["9","Micah Torres","Fr.","QB / DB"],
    ["10","Nate Johnston","Sr.","RB / LB"],["11","Isaac Beisel","Jr.","LB / RB"],["12","Braxton McGinnis","Jr.","LB / RB"],
    ["13","Nathan Shaugnessy","Sr.","WR / DB"],["14","Christian Katsis","So.",""],["15","Brock Katsis","Fr.",""],
    ["16","Noah Wilhelm","Jr.",""],["17","Drake Sheffield","So.","LB"],["18","Ronan Jones","Fr.",""],
    ["19","Jarrison Moore","So.",""],["20","Kolden Pratt","Fr.",""],["21","Arion Stokes","So.",""],
    ["22","London Mcginnis","So.",""],["23","Andrew Araskog","Fr.","WR / DB"],["24","Kevin Bonner","Jr.","WR / DB"],
    ["25","Jack Jewell","Fr.","TE / LB"],["26","Maverick Rea","Jr.","RB / LB"],["27","Davi Fernandes","Sr.","WR / DB"],
    ["28","Kohen Bruce","Jr.","WR / DB"],["29","Easton Smith","So.","RB / LB"],["30","Lawson Torres","Fr.","RB / LB"],
    ["31","Grayer Murtaugh","Fr.","WR / DB"],["32","Eli Huntsinger","So.",""],["33","Gideon Torres","Sr.",""],
    ["40","Ethan Lopez","Fr.",""],["41","Dani Fernandes","Fr.",""],["42","Luke Connors","Fr.",""],
    ["43","Sam Barnes","Jr.",""],["44","Rain Ragland","Sr.","DL"],["45","Tucker Tatum","Fr.",""],
    ["50","Nate Uyetake","Jr.","DL"],["51","Josiah Faulkner","So.",""],["52","Lincoln Torres","Sr.","DL"],
    ["53","Callum Campbell","So.",""],["54","Trey Autaubo","Fr.",""],["55","Griffin Crawford","Jr.",""],
    ["56","Sam Severston","Sr.",""],["58","AJ Maier","So.",""],["59","Hudson Shaw","So.",""],
    ["60","Colby Pisachubbie","Fr.",""],["61","Ollie Crawford","Fr.",""],["62","Gideon Carney","So.",""],
    ["63","James Turpin","Fr.",""],["64","Ryder Jones","So.",""],["66","Landon Campbell","Jr.",""],
    ["73","Caleb Delozier","Fr.",""],["74","Ryder Swaggart","Sr.",""],["78","Josh Foster","So.",""],
    ["79","Simeon Jones","Fr.",""],["80","Landon Tidwell","Jr.",""],["82","Coleson Henrie","So.",""],
    ["88","Kade Delozier","So.",""]
  ].map(function (p, index) {
    var background = "";
    if (p[1] === "Parker Rogers") background = "Navy commit; 45 tackles and 7 TFL in 2025, per official 2026 preview.";
    if (p[1] === "Lincoln Torres") background = "Senior defensive leader; 65 tackles, 23 TFL and 7 sacks in 2025.";
    if (p[1] === "Colt Monsey") background = "40 tackles, 11 TFL and 3 sacks in 2025.";
    if (p[1] === "Rain Ragland") background = "Four-year starter; 28 tackles and 9 TFL in nine 2025 games.";
    if (p[1] === "Isaac Beisel") background = "Team-high 81 tackles and 13 TFL in 2025; verify current number.";
    if (p[1] === "Drake Sheffield") background = "Projected middle linebacker in official preseason preview.";
    return { id: "fbp-" + index, number: p[0], name: p[1], grade: p[2], position: p[3], note: background, spotlight: index < 11 };
  });

  function blankNotes() {
    return { opening: "", lincolnStory: "", opponentStory: "", film: "", keys: "", calls: "", liveLog: "", opponentUpdate: "", reference: "" };
  }
  function blankChecklist() {
    return { sources: false, roster: false, history: false, film: false, stats: false, opening: false };
  }
  function footballStats() {
    return [
      { id: uid(), label: "Score", lincoln: "", opponent: "" },
      { id: uid(), label: "Rush yards", lincoln: "", opponent: "" },
      { id: uid(), label: "Pass yards", lincoln: "", opponent: "" },
      { id: uid(), label: "Turnovers", lincoln: "", opponent: "" },
      { id: uid(), label: "Penalties", lincoln: "", opponent: "" }
    ];
  }
  function basketballStats() {
    return [
      { id: uid(), label: "Score", lincoln: "", opponent: "" },
      { id: uid(), label: "Field goals", lincoln: "", opponent: "" },
      { id: uid(), label: "3-pointers", lincoln: "", opponent: "" },
      { id: uid(), label: "Free throws", lincoln: "", opponent: "" },
      { id: uid(), label: "Rebounds", lincoln: "", opponent: "" },
      { id: uid(), label: "Turnovers", lincoln: "", opponent: "" },
      { id: uid(), label: "Fouls", lincoln: "", opponent: "" }
    ];
  }
  function uid() {
    return "id-" + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
  }
  function makeGame(id, date, opponent, mascot, site, venue, district, result) {
    return {
      id: id, date: date, time: "19:00", opponent: opponent, mascot: mascot || "", site: site, venue: venue || "",
      district: !!district, result: result || "", lincolnRecord: "", opponentRecord: "", snapshot: [],
      notes: blankNotes(), checklist: blankChecklist(), stats: footballStats(), sources: []
    };
  }

  var games = [
    makeGame("fb-jones","2026-08-27","Jones","Longhorns","Away","Jones, Oklahoma",false,"W 25–13"),
    makeGame("fb-heritage","2026-09-04","Heritage Hall","Chargers","Away","Oklahoma City, Oklahoma",false,"W 20–19"),
    makeGame("fb-shiloh","2026-09-11","Shiloh Christian","Saints","Home","Dennis Byrd Stadium / Willie George Field",false,"L 14–41"),
    makeGame("fb-sequoyah","2026-09-25","Sequoyah","Indians","Home","Dennis Byrd Stadium / Willie George Field",true,"W 35–21"),
    makeGame("fb-victory","2026-10-02","Victory Christian","Conquerors","Away","Tulsa, Oklahoma",true,"W 61–6"),
    makeGame("fb-heavener","2026-10-09","Heavener","Wolves","Home","Dennis Byrd Stadium / Willie George Field",true,""),
    makeGame("fb-spiro","2026-10-15","Spiro","Bulldogs","Away","Spiro, Oklahoma",true,""),
    makeGame("fb-checotah","2026-10-23","Checotah","Wildcats","Home","Dennis Byrd Stadium / Willie George Field",true,""),
    makeGame("fb-hugo","2026-10-30","Hugo","Buffaloes","Away","Hugo, Oklahoma",true,""),
    makeGame("fb-roland","2026-11-06","Roland","Rangers","Home","Dennis Byrd Stadium / Willie George Field",true,"")
  ];
  games.forEach(function (game) {
    game.sources = [
      { name: "Official Lincoln schedule", note: "Primary schedule", url: "https://lcssports.com/sports/football/schedule" },
      { name: "MaxPreps matchup & scores", note: "Scores and opponent record", url: "https://www.maxpreps.com/ok/tulsa/lincoln-christian-bulldogs/football/schedule/" },
      { name: "SKORDLE", note: "Oklahoma schedule check", url: "https://skordle.com/" }
    ];
  });
  var heavener = games.filter(function (g) { return g.id === "fb-heavener"; })[0];
  heavener.lincolnRecord = "4–1 · 2–0 district";
  heavener.opponentRecord = "1–4 · 0–2 district";
  heavener.snapshot = [
    "Heavener has scored 99 and allowed 153 through five games.",
    "Last game: lost 36–29 to Hugo after a 52–0 loss at Checotah.",
    "A local preseason report described skill-position talent and young offensive and defensive lines."
  ];
  heavener.notes.lincolnStory = "Lincoln is 4–1 overall and 2–0 in Class 2A-I District 3. The Bulldogs entered 2026 as three-time defending Class 3A champions, then moved to 2A-I. Their 44-game winning streak ended against Shiloh Christian on Sept. 11.";
  heavener.notes.opponentStory = "Heavener arrives 1–4 and 0–2 in district play. The Wolves beat Panama 48–7 and most recently lost 36–29 to Hugo. Their first five games produced 99 points scored and 153 allowed.";
  heavener.checklist.sources = true;
  heavener.checklist.roster = true;
  heavener.checklist.history = true;
  heavener.sources = [
    { name: "Official Lincoln athletics", note: "Roster, news and program context", url: "https://lcssports.com/sports/football" },
    { name: "Lincoln roster", note: "Official 2026–27 roster", url: "https://lcssports.com/sports/football/roster" },
    { name: "MaxPreps matchup", note: "Oct. 9 schedule and current records", url: "https://www.maxpreps.com/ok/football/game/heavener-vs-lincoln-christian-tulsa/10-9-2026/?c=0414bb70-0040-4796-ac53-e383361a39a5&tab=Matchup" },
    { name: "Heavener schedule", note: "Opponent results and record", url: "https://www.maxpreps.com/ok/heavener/heavener-wolves/football/schedule/" },
    { name: "Heavener.news", note: "Local preseason context", url: "https://heavener.news/2026-football-season-kicks-off-thursday/" }
  ];

  var defaultState = {
    activeSport: "football",
    activeGameIds: { football: "fb-heavener", "boys-basketball": null, "girls-basketball": null },
    programNotes: "",
    sports: {
      football: { games: games, roster: footballRoster },
      "boys-basketball": { games: [], roster: [] },
      "girls-basketball": { games: [], roster: [] }
    }
  };

  var state = loadState();
  migrateResearch();
  var currentView = "home";
  var deskSections = ['prep','rosters','opponent-schedule','stats','live','history','sources','print'];
  var activeDeskSection = deskSections.includes(state.deskSection) ? state.deskSection : 'prep';
  var activeTab = state.statsTab === 'season' ? 'season' : 'stats';
  var saveTimer = null;

  // Merge new sourced fields without replacing existing user notes, manual stats or highlights.
  function migrateResearch() {
    if (!research) return;
    var fb = state.sports.football;
    fb.roster.forEach(function (p) {
      var m = research.lincolnMeasurements.find(function (r) { return r.name.toLowerCase() === p.name.toLowerCase() && r.number === p.number; });
      if (m) { if (!p.height) p.height = m.height; if (!p.weight) p.weight = m.weight; }
    });
    fb.games.forEach(function (g) {
      var info = research.opponents[g.opponent];
      if (!Array.isArray(g.opponentRoster) && info) g.opponentRoster = clone(info.players);
      if (!g.notes) g.notes = blankNotes();
      // Retain legacy reference data in backups, but do not seed a separate transcription task.
      if (g.notes.reference && !g.referenceIntegrated && !/^PROGRAM \/ STREAKS \(photo transcription/.test(g.notes.reference)) {
        g.notes.keys = (g.notes.keys || '') + '\n\nEarlier saved notes\n' + g.notes.reference;
        g.referenceIntegrated = true;
      }
      if (g.notes.reference) g.notes.reference = g.notes.reference.replace('Coach Rafe: 10th year, 112–14 career record (as written in the sheet).', 'Jerry Ricke is Lincoln’s head coach (official Lincoln athletics, Aug. 28, 2026). Photo lists 10th year and a 112–14 career record; confirm the record before air.');
      if (g.id === 'fb-heavener' && !g.sources.some(function (s) { return s.name === 'Lincoln coaching context'; })) g.sources.push({name:'Lincoln coaching context',note:'Jerry Ricke, head coach; Jeff Comfort, defensive coordinator',url:'https://lcssports.com/news/2026/8/28/football-no-1-lincoln-controls-from-start-to-finish-in-win-at-highly-touted-jones-to-open-2026-season.aspx'});
      // Correct only the old seeded sentence; preserve all other announcer writing.
      if (g.id === 'fb-heavener' && g.notes.lincolnStory) g.notes.lincolnStory = g.notes.lincolnStory.replace('Their 42-game winning streak ended against Shiloh Christian on Sept. 11.', 'Their 44-game winning streak ended against Shiloh Christian on Sept. 11.');
      if (g.id === 'fb-heavener' && !g.sources.some(function (s) { return s.name === 'Lincoln streak context'; })) g.sources.push({name:'Lincoln streak context',note:'Official Sept. 25 preview: 44 consecutive wins before Shiloh loss',url:'https://lcssports.com/news/2026/9/25/football-week-4-preview-no-1-lincoln-looks-to-get-back-on-track-in-district-opener-at-home.aspx'});
    });
    state.printOptions = Object.assign({ offense:true, defense:true, special:false, fullRosters:false, live:true, history:true, opponentSchedule:true }, state.printOptions || {});
    state.researchRevision = "2026-10-08";
  }
  function visibleRoster() {
    var g = currentGame();
    if (rosterTeam === "opponent" && g) { if (!Array.isArray(g.opponentRoster)) g.opponentRoster = []; return g.opponentRoster; }
    return currentSportData().roster;
  }
  function findPlayer(id) { return visibleRoster().find(function (p) { return p.id === id; }); }
  function keyPlayersFirst(roster) {
    return roster.slice().sort(function(a,b){return Number(!!b.spotlight)-Number(!!a.spotlight);});
  }
  function playerFacts(p) {
    var warning=p.sourceAbsent?'<div class="player-fact source-note">Saved entry not matched to the latest published roster. Confirm name and number before air.</div>':'';
    return warning + (p.facts || []).map(function (f) { return '<div class="player-fact">' + html(f.text) + ' <a target="_blank" rel="noreferrer" href="' + html(/^https:\/\//i.test(f.url) ? f.url : '#') + '">Source · ' + html(f.date) + ' ↗</a></div>'; }).join("");
  }
  function renderTeamSwitch() {
    var g = currentGame();
    var buttons = '<button class="small-btn' + (rosterTeam === "lincoln" ? ' selected' : '') + '" data-roster-team="lincoln">Lincoln roster</button><button class="small-btn' + (rosterTeam === "opponent" ? ' selected' : '') + '" data-roster-team="opponent"' + (!g ? ' disabled' : '') + '>' + html(g ? g.opponent : 'Opponent') + ' roster</button>';
    document.getElementById("deskTeamSwitch").innerHTML = buttons;
    document.getElementById("rosterTeamSwitch").innerHTML = buttons;
    var info = g && state.activeSport === "football" ? research.opponents[g.opponent] : null;
    var message = rosterTeam === "lincoln" ? 'Lincoln: official roster; heights and weights cross-checked with MaxPreps. Missing measurements are labeled “Not listed”.' : !info ? 'Opponent roster has not been verified. Add confirmed players or check the original school roster.' : info.status === 'not-published' ? g.opponent + ': no players published on the checked MaxPreps roster. Manual entries can be added.' : info.status === 'unavailable' ? g.opponent + ': roster source could not be verified. This does not mean no roster exists.' : g.opponent + ': ' + visibleRoster().length + ' published players. ' + info.updated + '. Checked Oct. 8, 2026.';
    if (rosterTeam === 'opponent') message += g && g.opponent === 'Heavener' ? ' Public facts only; no verified public GPA found. A missing fact is not a negative claim about a player.' : ' Player background research has not been completed for this opponent. Only verified public facts should be added.';
    if (state.activeSport === 'football' && window.LincolnWeekly) {
      var publicTeam=window.LincolnWeekly.team(rosterTeam==='lincoln'?'Lincoln Christian':g && g.opponent,g);
      var publicRoster=rosterTeam==='lincoln'?research.officialRosterInfo:publicTeam && publicTeam.roster;
      if(publicRoster){message=(rosterTeam==='lincoln'?'Lincoln':g.opponent)+': '+(publicRoster.players||[]).length+' players in the published roster. Last successful check: '+window.LincolnWeekly.stamp(publicRoster.checkedAt)+'. Missing measurements are “Not listed”. '+(publicRoster.status==='error'?'Refresh failed; dated data retained. ':publicRoster.status==='not-published'?'No players published; manual entries are preserved. ':'');
        var absent=visibleRoster().filter(function(p){return p.sourceAbsent;}).length;if(absent)message+=absent+' saved players are not on the latest published roster; kept to preserve your notes. Confirm before air. ';
        if(rosterTeam==='opponent')message+='Background facts have their own source dates; refreshing a roster does not re-verify those facts.';
      }
    }
    var markup = '<p>' + html(message) + (rosterTeam === 'opponent' && info ? ' <a href="' + html(info.source) + '" target="_blank" rel="noreferrer">Open roster ↗</a>' : '') + '</p>';
    document.getElementById("deskRosterStatus").innerHTML = markup;
    document.getElementById("rosterStatus").innerHTML = markup;
  }
  function statGroup(title) { return /Tackles|Sacks|Defensive/.test(title) ? 'defense' : /Kick|Punt|PAT|Points|Touchdowns/.test(title) ? 'special' : 'offense'; }
  function sourceTable(t, compact) {
    var indices = t.headers.map(function (_, i) { return i; });
    if (compact && t.headers.length > 10) indices = indices.filter(function (i) { return !['C/G','Y/G','TD/G','Int/G','Avg','QB Rate','C%','Lng','Blk Pnts','Blk FGs','FR Yds','Int Yds'].includes(t.headers[i]); });
    return '<div class="table-scroll"><table class="season-table"><thead><tr>' + indices.map(function (i) { return '<th title="' + html(t.titles[i] || t.headers[i]) + '">' + html(t.headers[i] === 'Athlete Name' ? 'Player' : t.headers[i]) + '</th>'; }).join('') + '</tr></thead><tbody>' + t.rows.map(function (r) { return '<tr>' + indices.map(function (i) { return '<td>' + html(r[i] || '—') + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody>' + (t.total.length === t.headers.length ? '<tfoot><tr>' + indices.map(function (i) { return '<td><strong>' + html(t.total[i] || '—') + '</strong></td>'; }).join('') + '</tr></tfoot>' : '') + '</table></div>';
  }
  function renderSeasonStats() {
    var el = document.getElementById('seasonStats');
    if (state.activeSport !== 'football') { el.innerHTML = '<p class="source-note">No verified basketball player stats loaded for this season.</p>'; return; }
    var published=window.LincolnWeekly && window.LincolnWeekly.statData(),tables=published?published.tables:research.stats;
    var description=window.LincolnWeekly?window.LincolnWeekly.statDescription(published):'Five-game snapshot · MaxPreps updated Oct. 3, 2026 · checked Oct. 8, 2026';
    el.innerHTML = '<div class="stat-source"><strong>Lincoln player stats · 2026 · '+(published?published.games:'five')+' games</strong><p>'+html(description)+'. Blank source cells remain —. '+html(published?window.LincolnWeekly.coverageWarning('Lincoln Christian'):'This is an older snapshot; a new source check is pending.')+'</p><a href="' + html(published?published.source:research.statsSource) + '" target="_blank" rel="noreferrer">Check latest MaxPreps stats ↗</a></div><div class="stat-group-nav"><a href="#offenseStats">Offense</a><a href="#defenseStats">Defense</a><a href="#specialStats">Special teams</a></div>' + ['offense','defense','special'].map(function (group) {
      return '<section id="' + group + 'Stats"><h3>' + ({offense:'Offense',defense:'Defense',special:'Special teams & scoring'})[group] + '</h3>' + tables.filter(function (t) { return statGroup(t.title) === group; }).map(function (t) { return '<details class="stat-details"' + (['Passing','Rushing','Receiving','Tackles','Defensive Statistics'].includes(t.title) ? ' open' : '') + '><summary>' + html(t.title) + ' <small>' + t.rows.length + ' players</small></summary>' + sourceTable(t,false) + '</details>'; }).join('') + '</section>';
    }).join('');
  }
  function renderPrintOptions() {
    document.getElementById('printOptions').innerHTML = Object.entries({offense:'Offensive stats',defense:'Defensive stats',special:'Special teams stats',fullRosters:'Full rosters (instead of highlights)',live:'Matching live-game stats',history:'Team history & matchup archive',opponentSchedule:'Opponent schedule & results'}).map(function (entry) { return '<label class="check-field"><input type="checkbox" data-print-option="' + entry[0] + '"' + (state.printOptions[entry[0]] ? ' checked' : '') + '>' + entry[1] + '</label>'; }).join('');
  }

  var sourcesBySport = {
    football: [
      { label: "Official athletics schedule", url: "https://lcssports.com/sports/football/schedule" },
      { label: "MaxPreps football", url: "https://www.maxpreps.com/ok/tulsa/lincoln-christian-bulldogs/football/" },
      { label: "SKORDLE football", url: "https://skordle.com/Schools/209/Lincoln_Christian_Bulldogs" },
      { label: "I Was At The Game — school history", url: "https://www.iwasatthegame.com/Schools.aspx" }
    ],
    "boys-basketball": [
      { label: "Official boys schedule", url: "https://lcssports.com/sports/boys-basketball/schedule" },
      { label: "MaxPreps boys basketball", url: "https://www.maxpreps.com/ok/tulsa/lincoln-christian-bulldogs/basketball/" },
      { label: "SKORDLE", url: "https://skordle.com/" },
      { label: "I Was At The Game — school history", url: "https://www.iwasatthegame.com/Schools.aspx" }
    ],
    "girls-basketball": [
      { label: "Official girls schedule", url: "https://lcssports.com/sports/womens-basketball/schedule" },
      { label: "MaxPreps girls basketball", url: "https://www.maxpreps.com/ok/tulsa/lincoln-christian-bulldogs/girls-basketball/" },
      { label: "SKORDLE", url: "https://skordle.com/" },
      { label: "I Was At The Game — school history", url: "https://www.iwasatthegame.com/Schools.aspx" }
    ]
  };
  var researchLibrary = [
    { title: "Lincoln Christian Athletics", note: "Primary source for schedules, rosters, facilities, school traditions and program news.", url: "https://lcssports.com/" },
    { title: "MaxPreps", note: "Cross-check scores, opponent records, rosters and past seasons. Confirm late changes elsewhere.", url: "https://www.maxpreps.com/ok/tulsa/lincoln-christian-bulldogs/" },
    { title: "SKORDLE", note: "Oklahoma schedules, scores and school pages.", url: "https://skordle.com/" },
    { title: "I Was At The Game", note: "Oklahoma school archives: football records, past matchups, title years, playoff and state-tournament appearances. Researched snapshots for Lincoln and the loaded football opponents appear on Game desk and in the print packet. Check coverage dates; these are not live 2026 player stats.", url: "https://www.iwasatthegame.com/Schools.aspx" },
    { title: "Tulsa World — High School Sports", note: "Tulsa-area reporting, previews and game coverage.", url: "https://tulsaworld.com/sports/high-school/" },
    { title: "VYPE Oklahoma — Tulsa", note: "Local athlete features and regional high-school coverage.", url: "https://vypeok.com/tulsa/" },
    { title: "OSSAA", note: "Official classifications, playoff brackets, rules and state championships.", url: "https://www.ossaa.com/" },
    { title: "Lincoln traditions", note: "Official school colors, Bulldog meaning, championships and school history.", url: "https://lcssports.com/sports/2020/6/19/school-colors-mascot" }
  ];

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(defaultState);
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.sports) throw new Error("Invalid save");
      return parsed;
    } catch (err) {
      return clone(defaultState);
    }
  }
  function saveState() {
    clearTimeout(saveTimer);
    var status = document.getElementById("saveStatus");
    if (status) status.textContent = "Saving…";
    saveTimer = setTimeout(function () {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        if (status) status.textContent = "Saved on this device";
      } catch (err) {
        if (status) status.textContent = "Could not save";
        toast("Storage is unavailable. Export a backup.");
      }
    }, 180);
  }
  // Flush the last keystroke if the page reloads before the short autosave debounce finishes.
  window.addEventListener('pagehide', function () {
    clearTimeout(saveTimer);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (err) {}
  });
  function html(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[char];
    });
  }
  function formatDate(value) {
    if (!value) return { month: "TBD", day: "—", dow: "" };
    var date = new Date(value + "T12:00:00");
    return {
      month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      day: date.toLocaleDateString("en-US", { day: "2-digit" }),
      dow: date.toLocaleDateString("en-US", { weekday: "long" })
    };
  }
  function formatFullDate(value) {
    if (!value) return "Date TBD";
    return new Date(value + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  }
  function currentSportData() { return state.sports[state.activeSport]; }
  function currentGame() {
    var id = state.activeGameIds[state.activeSport];
    return currentSportData().games.filter(function (g) { return g.id === id; })[0] || currentSportData().games[0] || null;
  }
  function ensureGameShape(game) {
    game.notes = Object.assign(blankNotes(), game.notes || {});
    game.checklist = Object.assign(blankChecklist(), game.checklist || {});
    if (!Array.isArray(game.stats)) game.stats = state.activeSport === "football" ? footballStats() : basketballStats();
    if (!Array.isArray(game.sources)) game.sources = [];
    if (!Array.isArray(game.snapshot)) game.snapshot = [];
    if (!Array.isArray(game.opponentRoster) && state.activeSport === 'football' && research.opponents[game.opponent]) game.opponentRoster = clone(research.opponents[game.opponent].players);
  }
  function prepPercent(game) {
    if (!game) return 0;
    var values = Object.keys(game.checklist || {}).map(function (k) { return !!game.checklist[k]; });
    return Math.round((values.filter(Boolean).length / Math.max(values.length, 1)) * 100);
  }
  function toast(message) {
    var el = document.getElementById("toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(el._timer);
    el._timer = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }

  function renderAll() {
    renderSportButtons();
    renderHeadings();
    renderDesk();
    renderSchedule();
    renderRoster();
    renderResearch();
    renderSeasonStats();
    renderPrintOptions();
    window.LincolnHistory.render(state.activeSport,currentGame());
    renderDeskTabs();
    window.LincolnLive.configure(state.activeSport === 'football' ? currentGame() : null, saveState);
    if (window.LincolnHome) window.LincolnHome.render();
    if (window.LincolnWeekly) window.LincolnWeekly.render(state.activeSport,currentGame());
  }
  function renderDeskTabs() {
    document.querySelectorAll('[data-desk-tab]').forEach(function (button) {
      var selected = button.dataset.deskTab === activeDeskSection;
      button.classList.toggle('active',selected);
      button.setAttribute('aria-selected',String(selected));
      button.setAttribute('tabindex',selected ? '0' : '-1');
    });
    document.querySelectorAll('[data-desk-panel]').forEach(function (panel) { panel.hidden = panel.dataset.deskPanel !== activeDeskSection; });
    document.querySelectorAll('.tab-btn').forEach(function (button) {
      var selected = button.dataset.tab === activeTab;
      button.classList.toggle('active',selected);
      button.setAttribute('aria-selected',String(selected));
      button.setAttribute('tabindex',selected ? '0' : '-1');
    });
    document.querySelectorAll('[data-tab-panel]').forEach(function (panel) {
      var selected = panel.dataset.tabPanel === activeTab;
      panel.hidden = !selected;
      panel.classList.toggle('active',selected);
    });
  }
  function rememberDeskHash() {
    if (window.history && window.location) window.history.replaceState(null,'',window.location.pathname + window.location.search + '#desk-' + activeDeskSection);
  }
  function setDeskSection(section) {
    if (!deskSections.includes(section)) return;
    activeDeskSection = section;
    state.deskSection = section;
    saveState(); renderDeskTabs(); rememberDeskHash(); keepDeskSectionInView();
  }
  function setStatsTab(tab) {
    if (!['stats','season'].includes(tab)) return;
    activeTab = tab; state.statsTab = tab;
    saveState(); renderDeskTabs(); rememberDeskHash(); keepDeskSectionInView();
  }
  function keepDeskSectionInView() {
    var panel = document.getElementById('desk-panel-' + activeDeskSection);
    var nav = document.querySelector('.desk-subnav');
    if (!panel || !nav || !panel.getBoundingClientRect || !nav.getBoundingClientRect || !window.scrollBy) return;
    var panelTop = panel.getBoundingClientRect().top, navBottom = nav.getBoundingClientRect().bottom;
    if (panelTop < navBottom + 12) window.scrollBy({top:panelTop - navBottom - 20,behavior:'smooth'});
  }
  function applyDeskHash() {
    var hash = window.location ? window.location.hash.slice(1) : '';
    if (['home','schedule','roster','research'].includes(hash)) { setView(hash); return; }
    var statAnchor = ['offenseStats','defenseStats','specialStats'].includes(hash);
    var section = statAnchor ? 'stats' : hash.replace(/^desk-/,'');
    if (!deskSections.includes(section)) return;
    activeDeskSection = section; state.deskSection = section;
    if (statAnchor) { activeTab = 'season'; state.statsTab = 'season'; }
    renderDeskTabs(); saveState();
    if (currentView !== 'desk') setView('desk');
    var anchor = statAnchor ? document.getElementById(hash) : null;
    if (anchor && anchor.scrollIntoView) anchor.scrollIntoView({block:'start'});
  }
  window.addEventListener('hashchange',applyDeskHash);
  function renderSportButtons() {
    document.querySelectorAll(".sport-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.sport === state.activeSport);
    });
  }
  function renderHeadings() {
    document.getElementById("scheduleHeading").textContent = sportLabels[state.activeSport] + " schedule";
    document.getElementById("rosterHeading").textContent = sportLabels[state.activeSport] + " roster book";
  }
  function renderDesk() {
    var game = currentGame();
    if (!game) {
      renderEmptyDesk();
      return;
    }
    ensureGameShape(game);
    var sportName = sportLabels[state.activeSport];
    var publicRecord=function(name){return state.activeSport==='football'&&window.LincolnWeekly?window.LincolnWeekly.pregameRecord(name,game):'';};
    var lincolnRecord=publicRecord('Lincoln Christian')||game.lincolnRecord,opponentRecord=publicRecord(game.opponent)||game.opponentRecord;
    var context = game.scheduleKind === 'Scrimmage' ? 'Scrimmage' : game.scheduleSourceId && !game.district ? 'School schedule' : game.district ? (state.activeSport === "football" ? "Class 2A-I District 3" : "Conference game") : "Non-district";
    function recordMarkup(record) { var parts=(record || 'Record not entered').split(' · ');var isRecord=/^\d+\s*[–-]\s*\d+/.test(parts[0]);return '<strong class="booth-record'+(isRecord?'':' booth-record-text')+'">'+html(parts[0])+(parts[1]?' <small>'+html(parts.slice(1).join(' · '))+'</small>':'')+'</strong>'; }
    document.getElementById("matchupHero").innerHTML =
      '<div class="booth-score-kicker"><div class="game-kicker"><span>' + html(sportName) + '</span><span class="district-pill">' + html(context) + '</span></div><time datetime="'+html(game.date)+'">'+html(formatFullDate(game.date))+'</time></div>' +
      '<div class="booth-score-main"><div class="booth-team"><img src="lincoln-mark.png" alt=""><div><h2>Lincoln Christian</h2><span>Bulldogs</span></div>'+recordMarkup(lincolnRecord)+'</div><span class="booth-vs">VS</span><div class="booth-team"><div><h2>'+html(game.opponent)+'</h2><span>'+html(game.mascot || 'Opponent')+'</span></div>'+recordMarkup(opponentRecord)+'</div></div>' +
      '<div class="booth-game-meta"><span><strong>'+html(displayGameTime(game.time))+'</strong> '+(state.activeSport==='football'?'kickoff':'tip')+'</span><span>'+html(game.site)+'</span><span>'+html(game.venue || 'Venue TBD')+'</span></div>';
    renderChecklist(game);
    document.getElementById("opponentName").textContent = game.opponent + (game.mascot ? " " + game.mascot : "");
    var snapshot = game.snapshot.length ? game.snapshot : ["Add verified opponent record, recent results, style and local reporting notes."];
    document.getElementById("opponentSnapshot").innerHTML =
      '<div class="snapshot-record"><div><strong>' + html((opponentRecord || "—").split(" · ")[0]) + '</strong><span>Posted pregame finals</span></div><div><strong>' + html((opponentRecord || "—").split(" · ")[1] || "—") + '</strong><span>District</span></div><div><strong>' + html(game.site) + '</strong><span>Site</span></div></div>' +
      '<ul class="snapshot-list">' + snapshot.map(function (item) { return '<li>' + html(item) + '</li>'; }).join("") + '</ul>';
    document.getElementById("gameSources").innerHTML = game.sources.concat(window.LincolnHistory.sources(game)).filter(function (source,index,all) { return all.findIndex(function (s) { return s.url === source.url; }) === index; }).map(sourceLink).join("");
    document.querySelectorAll("[data-note]").forEach(function (field) {
      field.disabled = false;
      field.value = game.notes[field.dataset.note] || "";
    });
    renderStats(game);
    if (window.LincolnPrep) window.LincolnPrep.render(state.activeSport,game);
    renderDeskRoster();
  }
  function displayGameTime(value) {
    var time=String(value || '').match(/^(\d{2}):(\d{2})$/);
    if(!time || +time[1]>23 || +time[2]>59)return value || 'Time TBD';
    var hour=+time[1];return (hour%12 || 12)+':'+time[2]+' '+(hour>=12?'PM':'AM')+' CT';
  }
  function renderEmptyDesk() {
    document.getElementById("matchupHero").innerHTML =
      '<div class="matchup-content"><div class="matchup-main"><div class="game-kicker"><span>' + html(sportLabels[state.activeSport]) + '</span></div><div class="versus"><h2>No verified games loaded</h2></div><div class="game-meta"><span>Open the official schedule, then add the first confirmed game.</span></div></div></div>';
    document.getElementById("checklist").innerHTML = "";
    document.getElementById("progressText").textContent = "Start with a game";
    document.getElementById("progressBar").style.width = "0%";
    document.getElementById("opponentName").textContent = "Opponent";
    document.getElementById("opponentSnapshot").innerHTML = '<p class="source-note">No opponent selected.</p>';
    document.getElementById("gameSources").innerHTML = sourcesBySport[state.activeSport].map(function (s) { return sourceLink({name:s.label,note:'Sport research source — no game selected',url:s.url}); }).join('');
    document.querySelectorAll("[data-note]").forEach(function (field) { field.value = ""; field.disabled = true; });
    if (window.LincolnPrep) window.LincolnPrep.render(state.activeSport,null);
    document.getElementById("statGrid").innerHTML = "";
    document.getElementById("deskRoster").innerHTML = '<p class="source-note">Add a roster from the roster book.</p>';
  }
  function renderChecklist(game) {
    var labels = { sources:"Sources", roster:"Roster", history:"History", film:"Film", stats:"Stats", opening:"Opening" };
    var keys = Object.keys(labels);
    var ready = keys.filter(function (key) { return game.checklist[key]; }).length;
    document.getElementById("progressText").textContent = ready + " of " + keys.length + " ready";
    document.getElementById("progressBar").style.width = Math.round(ready / keys.length * 100) + "%";
    document.getElementById("checklist").innerHTML = keys.map(function (key) {
      return '<label class="check-item"><input type="checkbox" data-check="' + key + '"' + (game.checklist[key] ? " checked" : "") + '><span>' + labels[key] + '</span></label>';
    }).join("");
  }
  function sourceLink(source) {
    return '<a class="source-link" href="' + html(source.url) + '" target="_blank" rel="noreferrer"><div><strong>' + html(source.name) + '</strong><span>' + html(source.note) + '</span></div><i>↗</i></a>';
  }
  function renderStats(game) {
    var rows = '<span class="stat-head">Stat</span><span class="stat-head">Lincoln</span><span class="stat-head">' + html(game.opponent) + '</span><span></span>';
    rows += game.stats.map(function (stat) {
      return '<input aria-label="Stat name" data-stat-id="' + stat.id + '" data-stat-field="label" value="' + html(stat.label) + '">' +
        '<input aria-label="Lincoln value for ' + html(stat.label) + '" data-stat-id="' + stat.id + '" data-stat-field="lincoln" value="' + html(stat.lincoln) + '">' +
        '<input aria-label="' + html(game.opponent) + ' value for ' + html(stat.label) + '" data-stat-id="' + stat.id + '" data-stat-field="opponent" value="' + html(stat.opponent) + '">' +
        '<button class="remove-btn" data-delete-stat="' + stat.id + '" aria-label="Remove ' + html(stat.label) + '">×</button>';
    }).join("");
    document.getElementById("statGrid").innerHTML = rows;
  }
  function renderDeskRoster() {
    var query = document.getElementById("deskRosterSearch").value.toLowerCase().trim();
    renderTeamSwitch();
    var roster = keyPlayersFirst(visibleRoster().filter(function (p) {
      return !query || (p.name + " " + p.number + " " + p.position).toLowerCase().indexOf(query) >= 0;
    }));
    document.getElementById("deskRoster").innerHTML = roster.length ? roster.map(function (p,index) {
      var heading = index===0 || !!roster[index-1].spotlight !== !!p.spotlight ? '<h3 class="roster-group-heading">'+(p.spotlight?'Key players':'Remaining roster')+'</h3>' : '';
      return heading + '<div class="person-row' + (p.spotlight ? ' key-player' : '') + '"><input type="checkbox" data-spotlight="' + p.id + '"' + (p.spotlight ? " checked" : "") + ' aria-label="Include ' + html(p.name) + ' on printout">' +
        '<span class="num">#' + html(p.number) + '</span><div><strong>' + html(p.name) + '</strong><small>' + html([p.grade,p.position,p.height || 'Ht. not listed',p.weight || 'Wt. not listed'].filter(Boolean).join(" · ")) + '</small>' + (p.referenceHighlight ? '<span class="highlight-tag">Highlighted in prep sheet</span>' : '') + playerFacts(p) + '</div>' +
        '<input type="text" data-roster-note="' + p.id + '" value="' + html(p.note || "") + '" placeholder="Pronunciation / background note" aria-label="Notes for ' + html(p.name) + '"></div>';
    }).join("") : '<p class="source-note">No matching players.</p>';
  }
  function renderSchedule() {
    var data = currentSportData();
    var activeId = state.activeGameIds[state.activeSport];
    document.getElementById("scheduleEmpty").hidden = data.games.length > 0;
    document.querySelector("#scheduleView .table-scroll").hidden = data.games.length === 0;
    document.getElementById("scheduleBody").innerHTML = data.games.map(function (game) {
      ensureGameShape(game);
      var pct = prepPercent(game);
      var resultClass = game.result.indexOf("W") === 0 ? "result-win" : (game.result.indexOf("L") === 0 ? "result-loss" : "");
      return '<tr class="game-row' + (game.id === activeId ? " active" : "") + '"><td><strong>' + html(formatDate(game.date).month + " " + formatDate(game.date).day) + '</strong><small>' + html(formatDate(game.date).dow) + ' · ' + html(game.time) + '</small></td>' +
        '<td><strong>' + html(game.opponent) + '</strong><small>' + html(game.mascot) + '</small></td><td>' + html(game.site) + '</td><td>' + (game.district ? "Yes" : "—") + '</td>' +
        '<td class="' + resultClass + '">' + html(game.result || "Upcoming") + '</td><td><div class="prep-meter" title="' + pct + '% ready"><i style="width:' + pct + '%"></i></div></td>' +
        '<td><button class="open-game" data-open-game="' + game.id + '">Open</button></td></tr>';
    }).join("");
    document.getElementById("scheduleSources").innerHTML = sourcesBySport[state.activeSport].map(function (source) {
      return '<a href="' + html(source.url) + '" target="_blank" rel="noreferrer">' + html(source.label) + ' ↗</a>';
    }).join("");
  }
  function renderRoster() {
    renderTeamSwitch();
    var query = document.getElementById("rosterSearch").value.toLowerCase().trim();
    var roster = keyPlayersFirst(visibleRoster().filter(function (p) {
      return !query || (p.name + " " + p.number + " " + p.position + " " + p.grade).toLowerCase().indexOf(query) >= 0;
    }));
    document.getElementById("rosterBody").innerHTML = roster.length ? roster.map(function (p,index) {
      var heading = index===0 || !!roster[index-1].spotlight !== !!p.spotlight ? '<tr class="roster-group-row"><th colspan="9">'+(p.spotlight?'Key players':'Remaining roster')+'</th></tr>' : '';
      return heading + '<tr' + (p.spotlight ? ' class="key-player"' : '') + '><td><input type="checkbox" data-spotlight="' + p.id + '"' + (p.spotlight ? " checked" : "") + ' aria-label="Include ' + html(p.name) + ' on printout"></td>' +
        '<td><strong>#' + html(p.number) + '</strong></td><td><strong>' + html(p.name) + '</strong>' + (p.referenceHighlight ? '<span class="highlight-tag">Prep-sheet highlight</span>' : '') + playerFacts(p) + '</td><td>' + html(p.grade) + '</td><td>' + html(p.position || 'Not listed') + '</td><td>' + html(p.height || 'Not listed') + '</td><td>' + html(p.weight || 'Not listed') + '</td>' +
        '<td><input type="text" data-roster-note="' + p.id + '" value="' + html(p.note || "") + '" placeholder="Pronunciation, hometown, family, milestone"></td>' +
        '<td><button class="remove-btn" data-delete-player="' + p.id + '" aria-label="Remove ' + html(p.name) + '">×</button></td></tr>';
    }).join("") : '<tr><td colspan="9">No matching players. Check the roster status above.</td></tr>';
  }
  function renderResearch() {
    document.getElementById("programNotes").value = state.programNotes || "";
    document.getElementById("researchSources").innerHTML = researchLibrary.map(function (source) {
      return '<article class="research-source"><h3>' + html(source.title) + '</h3><p>' + html(source.note) + '</p><a href="' + html(source.url) + '" target="_blank" rel="noreferrer">Open source ↗</a></article>';
    }).join("");
  }

  function setView(view) {
    if (!['home','desk','schedule','roster','research'].includes(view)) return;
    currentView = view;
    document.querySelectorAll(".nav-btn").forEach(function (btn) { btn.classList.toggle("active", btn.dataset.view === view); });
    document.querySelectorAll("[data-view-panel]").forEach(function (panel) { panel.classList.toggle("active", panel.dataset.viewPanel === view); });
    var titles = { home:["BROADCAST HEADQUARTERS","Home"], desk:["GAME PREPARATION","Game Desk"], schedule:["SEASON CONTROL","Schedule"], roster:["NAME COMMAND","Roster Book"], research:["VERIFIED CONTEXT","LC History"] };
    document.getElementById("viewEyebrow").textContent = titles[view][0];
    document.getElementById("viewTitle").textContent = titles[view][1];
    document.querySelector(".sidebar").classList.remove("open");
    document.getElementById("menuBtn").setAttribute("aria-expanded", "false");
    if (window.history && window.location) window.history.replaceState(null,'',window.location.pathname + window.location.search + (view === 'desk' ? '#desk-'+activeDeskSection : '#'+view));
    if (view==='home' && window.LincolnHome) window.LincolnHome.render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function setSport(sport) {
    state.activeSport = sport;
    if (!state.activeGameIds[sport] && state.sports[sport].games[0]) state.activeGameIds[sport] = state.sports[sport].games[0].id;
    saveState();
    renderAll();
  }
  function openGame(id) {
    state.activeGameIds[state.activeSport] = id;
    saveState();
    renderAll();
    setView("desk");
    toast("Game desk opened");
  }
  function addGame(form) {
    var fd = new FormData(form);
    var game = {
      id: uid(), date: String(fd.get("date") || ""), time: String(fd.get("time") || ""),
      opponent: String(fd.get("opponent") || "").trim(), mascot: String(fd.get("mascot") || "").trim(),
      site: String(fd.get("site") || "Home"), venue: String(fd.get("venue") || "").trim(), district: fd.get("district") === "on",
      result: "", lincolnRecord: "", opponentRecord: "", snapshot: [], notes: blankNotes(), checklist: blankChecklist(),
      stats: state.activeSport === "football" ? footballStats() : basketballStats(),
      sources: sourcesBySport[state.activeSport].map(function (s) { return { name:s.label, note:"Schedule / score source", url:s.url }; })
    };
    currentSportData().games.push(game);
    currentSportData().games.sort(function (a,b) { return a.date.localeCompare(b.date); });
    state.activeGameIds[state.activeSport] = game.id;
    form.reset();
    document.getElementById("gameDialog").close();
    saveState();
    renderAll();
    setView("desk");
    toast("Game added");
  }
  function addPlayer(form) {
    var fd = new FormData(form);
    visibleRoster().push({
      id: uid(), number: String(fd.get("number") || ""), name: String(fd.get("name") || "").trim(),
      grade: String(fd.get("grade") || "").trim(), position: String(fd.get("position") || "").trim(), height: String(fd.get('height') || '').trim(), weight: String(fd.get('weight') || '').trim(), note: "", spotlight: false
    });
    form.reset();
    document.getElementById("playerDialog").close();
    saveState();
    renderRoster();
    renderDeskRoster();
    toast("Player added");
  }
  function exportBackup() {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "lincoln-broadcast-desk-backup-" + new Date().toISOString().slice(0,10) + ".json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    toast("Backup exported");
  }
  function importBackup(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(String(reader.result));
        if (!parsed || !parsed.sports || !parsed.activeGameIds) throw new Error("Invalid backup");
        if (!window.confirm("Replace the current desk with this backup?")) return;
        state = parsed;
        migrateResearch();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        renderAll();
        toast("Backup restored");
      } catch (err) {
        toast("That file is not a valid Broadcast Desk backup");
      }
      document.getElementById("importFile").value = "";
    };
    reader.readAsText(file);
  }
  function renderPrintSheet() {
    var game = currentGame();
    if (!game) { toast("Add a game before printing"); return false; }
    var roster = currentSportData().roster.filter(function (p) { return p.spotlight; });
    var notes = game.notes;
    var highlights = window.LincolnPrep ? window.LincolnPrep.facts(state.activeSport,game) : {};
    function section(title, value) {
      var key = {'Lincoln storylines':'lincolnStory','Opponent storylines':'opponentStory','Keys & matchups':'keys'}[title];
      return '<section class="print-section"><h2>' + html(title) + '</h2>' + (key && window.LincolnPrep ? window.LincolnPrep.markup(highlights[key] || [],true) : '') + '<p>' + html(value || "—") + '</p></section>';
    }
    var statRows = game.stats.map(function (s) {
      return '<tr><td>' + html(s.label) + '</td><td>' + html(s.lincoln) + '</td><td>' + html(s.opponent) + '</td></tr>';
    }).join("");
    var playerRows = roster.map(function (p) {
      return '<tr><td>#' + html(p.number) + '</td><td>' + html(p.name) + '</td><td>' + html(p.position) + '</td><td>' + html(p.note || "") + '</td></tr>';
    }).join("");
    document.getElementById("printSheet").innerHTML =
      '<header class="print-header"><div><h1>Lincoln Christian vs ' + html(game.opponent) + '</h1><p>' + html(formatFullDate(game.date)) + ' · ' + html(game.time) + ' · ' + html(game.venue) + '</p></div><div class="print-badge">BROADCAST GAME SHEET<br>' + html(sportLabels[state.activeSport].toUpperCase()) + '</div></header>' +
      '<div class="print-grid"><div>' + section("Opening", notes.opening) + section("Lincoln storylines", notes.lincolnStory) + section("Opponent storylines", notes.opponentStory) + section("Film / scheme", notes.film) + section("Keys & matchups", notes.keys) + section("Calls & transitions", notes.calls) +
      section("Live game log", notes.liveLog) + '<section class="print-section"><h2>Booth scratchpad</h2><div class="print-lines"></div></section></div>' +
      '<div><section class="print-section"><h2>Quick stats</h2><table class="print-stats"><thead><tr><th>Stat</th><th>LC</th><th>' + html(game.opponent) + '</th></tr></thead><tbody>' + statRows + '</tbody></table></section>' +
      '<section class="print-section"><h2>On-sheet roster</h2><table class="print-roster"><thead><tr><th>#</th><th>Name</th><th>Pos.</th><th>Note</th></tr></thead><tbody>' + (playerRows || '<tr><td colspan="4">Mark players in the roster book.</td></tr>') + '</tbody></table></section>' +
      section("Opponent update", notes.opponentUpdate) + '</div></div>';
    var print = document.getElementById('printSheet');
    // Full-width roster pages avoid shrinking names and biographical notes into a tiny sidebar.
    print.querySelector('.print-roster').closest('section').remove();
    [ {name:'Lincoln Christian',players:currentSportData().roster}, {name:game.opponent,players:game.opponentRoster || []} ].forEach(function (team) {
      var selected = team.players.filter(function (p) { return state.printOptions.fullRosters || p.spotlight; });
      print.innerHTML += '<section class="print-section roster-print-section"><h2>' + html(team.name) + ' · ' + (state.printOptions.fullRosters ? 'Full roster' : 'Highlighted roster') + '</h2><table class="print-roster"><thead><tr><th>#</th><th>Player</th><th>Gr.</th><th>Pos.</th><th>Ht. / Wt.</th><th>Notes / sourced background</th></tr></thead><tbody>' + selected.map(function (p) { return '<tr><td>' + html(p.number) + '</td><td>' + html(p.name) + '</td><td>' + html(p.grade) + '</td><td>' + html(p.position || '—') + '</td><td>' + html((p.height || 'Not listed') + ' / ' + (p.weight || 'Not listed')) + '</td><td>' + html(p.note) + playerFacts(p) + '</td></tr>'; }).join('') + '</tbody></table>' + (!selected.length ? '<p>No verified players selected. Check roster availability in Rosters.</p>' : '') + '</section>';
    });
    if (state.activeSport === 'football') ['offense','defense','special'].forEach(function (group) {
      if (!state.printOptions[group]) return;
      var published=window.LincolnWeekly && window.LincolnWeekly.statData();
      var tables = (published?published.tables:research.stats).filter(function (t) { return statGroup(t.title) === group && (group !== 'offense' || ['Passing','Rushing','Receiving'].includes(t.title)); });
      print.innerHTML += '<div class="print-stat-group"><h2>Lincoln · ' + html(group) + ' · 2026 season</h2><p>' + html(window.LincolnWeekly?window.LincolnWeekly.statDescription(published):'Five games · MaxPreps updated Oct. 3, 2026')+' · ' + html(published?published.source:research.statsSource) + '</p>' + tables.map(function (t) { return '<section class="print-section"><h2>' + html(t.title) + '</h2>' + sourceTable(t,true) + '</section>'; }).join('') + '</div>';
    });
    if (state.printOptions.live) print.innerHTML += window.LincolnLive.printMarkup(game);
    if (state.printOptions.history) print.innerHTML += window.LincolnHistory.printMarkup(state.activeSport,game);
    if (state.printOptions.opponentSchedule && window.LincolnWeekly) print.innerHTML += window.LincolnWeekly.printMarkup(state.activeSport,game);
    return true;
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest("button, label");
    if (!target) return;
    if (target.matches(".sport-btn")) setSport(target.dataset.sport);
    if (target.matches(".nav-btn")) setView(target.dataset.view);
    if (target.matches('[data-desk-tab]')) setDeskSection(target.dataset.deskTab);
    if (target.matches('[data-open-research]')) setView('research');
    if (target.matches('[data-history-note]')) {
      var added = window.LincolnHistory.addToNotes(state.activeSport,currentGame(),target.dataset.historyNote);
      if (added) { saveState(); renderDesk(); toast('Sourced facts added; existing notes preserved'); }
      else toast('These facts are already in your notes, or no verified facts are loaded');
    }
    if (target.matches('[data-roster-team]')) { rosterTeam = target.dataset.rosterTeam; renderRoster(); renderDeskRoster(); }
    if (target.matches('#previewPrintBtn')) { if (renderPrintSheet()) { document.getElementById('printPreviewContent').innerHTML = document.getElementById('printSheet').innerHTML; document.getElementById('printPreview').showModal(); } }
    if (target.matches('#printPreviewGo')) { document.getElementById('printPreview').close(); if (renderPrintSheet()) window.print(); }
    if (target.matches(".tab-btn")) setStatsTab(target.dataset.tab);
    if (target.matches("[data-open-game]")) openGame(target.dataset.openGame);
    if (target.matches("#newGameBtn, #scheduleNewGameBtn, .emptyAddGame")) document.getElementById("gameDialog").showModal();
    if (target.matches("#addPlayerBtn")) document.getElementById("playerDialog").showModal();
    if (target.matches("#addStatBtn")) {
      var game = currentGame();
      if (!game) return;
      game.stats.push({ id: uid(), label: "New stat", lincoln: "", opponent: "" });
      saveState(); renderStats(game);
    }
    if (target.matches("[data-delete-stat]")) {
      var gameForStat = currentGame();
      gameForStat.stats = gameForStat.stats.filter(function (s) { return s.id !== target.dataset.deleteStat; });
      saveState(); renderStats(gameForStat);
    }
    if (target.matches("[data-delete-player]")) {
      var player = findPlayer(target.dataset.deletePlayer);
      if (player && window.confirm("Remove " + player.name + " from this roster?")) {
        visibleRoster().splice(visibleRoster().indexOf(player),1);
        saveState(); renderRoster(); renderDeskRoster();
      }
    }
    if (target.matches("#exportBtn")) exportBackup();
    if (target.matches("#printBtn")) { if (renderPrintSheet()) window.print(); }
    if (target.matches("#menuBtn")) {
      var side = document.querySelector(".sidebar");
      side.classList.toggle("open");
      target.setAttribute("aria-expanded", String(side.classList.contains("open")));
    }
    if (target.matches(".icon-btn") || (target.matches(".dialog-actions .secondary-btn"))) {
      event.preventDefault();
      target.closest("dialog").close();
    }
  });

  // Accessible arrow-key navigation, scoped to each tab row; note-field keys are unaffected.
  document.addEventListener('keydown',function (event) {
    var tab = event.target.closest('[data-desk-tab],.tab-btn');
    if (!tab || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    var isDesk = tab.hasAttribute('data-desk-tab');
    var choices = isDesk ? deskSections : ['stats','season'];
    var current = choices.indexOf(isDesk ? tab.dataset.deskTab : tab.dataset.tab);
    var next = event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + choices.length) % choices.length;
    if (isDesk) setDeskSection(choices[next]); else setStatsTab(choices[next]);
    var button = document.querySelector(isDesk ? '[data-desk-tab="' + choices[next] + '"]' : '[data-tab="' + choices[next] + '"]');
    if (button) button.focus();
  });

  document.addEventListener("input", function (event) {
    var target = event.target;
    var game = currentGame();
    if (target.matches("[data-note]") && game) {
      game.notes[target.dataset.note] = target.value;
      if (target.dataset.note === "opening") game.checklist.opening = !!target.value.trim();
      if (target.dataset.note === "film") game.checklist.film = !!target.value.trim();
      saveState(); renderChecklist(game);
    }
    if (target.matches("[data-stat-id]") && game) {
      var stat = game.stats.filter(function (s) { return s.id === target.dataset.statId; })[0];
      if (stat) { stat[target.dataset.statField] = target.value; game.checklist.stats = game.stats.some(function (s) { return s.lincoln || s.opponent; }); saveState(); renderChecklist(game); }
    }
    if (target.matches("[data-roster-note]")) {
      var player = findPlayer(target.dataset.rosterNote);
      if (player) { player.note = target.value; saveState(); }
    }
    if (target.matches("#programNotes")) { state.programNotes = target.value; saveState(); }
    if (target.matches("#deskRosterSearch")) renderDeskRoster();
    if (target.matches("#rosterSearch")) renderRoster();
  });

  document.addEventListener("change", function (event) {
    var target = event.target;
    var game = currentGame();
    if (target.matches("[data-check]") && game) { game.checklist[target.dataset.check] = target.checked; saveState(); renderChecklist(game); }
    if (target.matches("[data-spotlight]")) {
      var player = findPlayer(target.dataset.spotlight);
      if (player) {
        var rosterContainer=target.closest('#deskRoster')?'deskRoster':'rosterBody';
        player.spotlight = target.checked; saveState(); renderDeskRoster(); renderRoster();
        var moved=document.getElementById(rosterContainer).querySelector('[data-spotlight="'+player.id+'"]');
        if(moved && moved.focus) moved.focus({preventScroll:true});
        toast(player.spotlight ? player.name+' moved to key players at the top' : player.name+' returned to the remaining roster');
      }
    }
    if (target.matches("#importFile")) importBackup(target.files[0]);
    if (target.matches('[data-print-option]')) { state.printOptions[target.dataset.printOption] = target.checked; saveState(); }
  });

  document.getElementById("gameForm").addEventListener("submit", function (event) {
    event.preventDefault();
    if (this.reportValidity()) addGame(this);
  });
  document.getElementById("playerForm").addEventListener("submit", function (event) {
    event.preventDefault();
    if (this.reportValidity()) addPlayer(this);
  });

  function registerWebMCP() {
    var context = document.modelContext;
    if (!context || !context.registerTool) return;
    var active = new AbortController();
    var register = function (tool) {
      try { Promise.resolve(context.registerTool(tool, { signal: active.signal })).catch(function () {}); } catch (err) {}
    };
    register({
      name: "get_active_game_summary",
      title: "Read active game",
      description: "Return the selected broadcast game's matchup, preparation progress, and notes.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute: function () {
        var game = currentGame();
        if (!game) return { activeGame: null };
        return { sport: state.activeSport, opponent: game.opponent, date: game.date, site: game.site, prepPercent: prepPercent(game), notes: clone(game.notes) };
      }
    });
    register({
      name: "select_game",
      title: "Select game",
      description: "Open a scheduled game in the visible broadcast desk.",
      inputSchema: { type: "object", properties: { gameId: { type: "string" } }, required: ["gameId"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: function (input) {
        if (!input || typeof input.gameId !== "string") throw new Error("gameId is required");
        var exists = currentSportData().games.some(function (g) { return g.id === input.gameId; });
        if (!exists) throw new Error("Game not found in the active sport");
        openGame(input.gameId);
        return { selectedGameId: input.gameId };
      }
    });
    register({
      name: "update_broadcast_note",
      title: "Update broadcast note",
      description: "Replace one note section for the currently selected game.",
      inputSchema: {
        type: "object",
        properties: {
          section: { type: "string", enum: ["opening","lincolnStory","opponentStory","film","keys","calls","liveLog","opponentUpdate","reference"] },
          text: { type: "string" }
        },
        required: ["section","text"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: true },
      execute: function (input) {
        var game = currentGame();
        if (!game) throw new Error("No active game");
        if (!input || typeof input.text !== "string" || !Object.prototype.hasOwnProperty.call(game.notes, input.section)) throw new Error("Invalid note update");
        game.notes[input.section] = input.text;
        saveState(); renderDesk();
        return { updated: input.section, gameId: game.id };
      }
    });
  }

  function applyPublicFootball(feed) {
    var fb=state.sports.football;
    if(feed.officialRoster && feed.officialRoster.players && feed.officialRoster.players.length){
      research.officialRosterInfo=feed.officialRoster;
      var measurements=feed.teams['Lincoln Christian'].roster.players||[];
      var players=feed.officialRoster.players.map(function(p){var copy=Object.assign({},p),m=measurements.find(function(r){return r.name.toLowerCase()===p.name.toLowerCase()&&r.number===p.number;});if(m){if(!copy.height)copy.height=m.height;if(!copy.weight)copy.weight=m.weight;}return copy;});
      window.LincolnWeekly.mergeRoster(fb.roster,players);
    }
    fb.games.forEach(function(g){var team=window.LincolnWeekly.team(g.opponent,g);if(!team)return;
      if(team.roster.status==='ok')window.LincolnWeekly.mergeRoster(g.opponentRoster||(g.opponentRoster=[]),team.roster.players);
      var old=research.opponents[g.opponent]||{};research.opponents[g.opponent]=Object.assign({},old,{status:team.roster.status,checkedAt:team.roster.checkedAt,source:team.roster.source,players:g.opponentRoster||old.players||[]});
    });
    // Public refreshes never assign game notes, manual comparison stats, or Sheet selections.
    saveState();
  }
  var initialHash = window.location ? window.location.hash : '';
  renderAll();
  setView(currentView);
  if (window.location && initialHash) window.history.replaceState(null,'',window.location.pathname + window.location.search + initialHash);
  applyDeskHash();
  registerWebMCP();
  if(window.LincolnWeekly)window.LincolnWeekly.init({apply:applyPublicFootball,render:renderAll,sport:function(){return state.activeSport;},game:currentGame});
  if (window.LincolnHome) window.LincolnHome.init({
    getState:function(){return state;},
    openSection:function(section,sport){
      if(sport && sportLabels[sport]) setSport(sport);
      setDeskSection(section);setView('desk');
    },
    openEvent:function(event){
      var sport=event.sport;
      if(!sportLabels[sport])return;
      state.activeSport=sport;
      var normalized=function(name){return String(name).toLowerCase().replace(/[^a-z0-9 ]/g,'').trim();};
      var game=state.sports[sport].games.find(function(g){
        var a=normalized(g.opponent),b=normalized(event.opponent);
        return (g.scheduleSourceId===event.sourceId && event.sourceId) || g.id===event.id || (g.date===event.date && (a===b || b.indexOf(a+' ')===0));
      });
      if(!game){
        game=makeGame(event.id,event.date,event.opponent,'',event.site,event.venue,event.district,event.result);
        game.time=event.time||'';game.stats=sport==='football'?footballStats():basketballStats();game.scheduleSourceId=event.sourceId;game.scheduleKind=event.kind;
        game.sources=[{name:'Official Lincoln '+sportLabels[sport]+' schedule',note:'School schedule; game-day details may change',url:event.source}];
        state.sports[sport].games.push(game);
      }
      openGame(game.id);setDeskSection('prep');
    }
  });
})();
