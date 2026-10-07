(function () {
  "use strict";

  var STORAGE_KEY = "lincoln-broadcast-desk-v1";
  var SOURCE_DATE = "Oct. 6, 2026";
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
    return { opening: "", lincolnStory: "", opponentStory: "", film: "", keys: "", calls: "", liveLog: "", opponentUpdate: "" };
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
  heavener.notes.lincolnStory = "Lincoln is 4–1 overall and 2–0 in Class 2A-I District 3. The Bulldogs entered 2026 as three-time defending Class 3A champions, then moved to 2A-I. Their 42-game winning streak ended against Shiloh Christian on Sept. 11.";
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
  var currentView = "desk";
  var activeTab = "notes";
  var saveTimer = null;

  var sourcesBySport = {
    football: [
      { label: "Official athletics schedule", url: "https://lcssports.com/sports/football/schedule" },
      { label: "MaxPreps football", url: "https://www.maxpreps.com/ok/tulsa/lincoln-christian-bulldogs/football/" },
      { label: "SKORDLE football", url: "https://skordle.com/Schools/209/Lincoln_Christian_Bulldogs" }
    ],
    "boys-basketball": [
      { label: "Official boys schedule", url: "https://lcssports.com/sports/boys-basketball/schedule" },
      { label: "MaxPreps boys basketball", url: "https://www.maxpreps.com/ok/tulsa/lincoln-christian-bulldogs/basketball/" },
      { label: "SKORDLE", url: "https://skordle.com/" }
    ],
    "girls-basketball": [
      { label: "Official girls schedule", url: "https://lcssports.com/sports/womens-basketball/schedule" },
      { label: "MaxPreps girls basketball", url: "https://www.maxpreps.com/ok/tulsa/lincoln-christian-bulldogs/girls-basketball/" },
      { label: "SKORDLE", url: "https://skordle.com/" }
    ]
  };
  var researchLibrary = [
    { title: "Lincoln Christian Athletics", note: "Primary source for schedules, rosters, facilities, school traditions and program news.", url: "https://lcssports.com/" },
    { title: "MaxPreps", note: "Cross-check scores, opponent records, rosters and past seasons. Confirm late changes elsewhere.", url: "https://www.maxpreps.com/ok/tulsa/lincoln-christian-bulldogs/" },
    { title: "SKORDLE", note: "Oklahoma schedules, scores and school pages.", url: "https://skordle.com/" },
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
  }
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
    var d = formatDate(game.date);
    var sportName = sportLabels[state.activeSport];
    var context = game.district ? (state.activeSport === "football" ? "Class 2A-I District 3" : "Conference game") : "Non-district";
    document.getElementById("matchupHero").innerHTML =
      '<div class="matchup-content">' +
        '<div class="date-block"><span class="month">' + html(d.month) + '</span><span class="day">' + html(d.day) + '</span><span class="dow">' + html(d.dow) + '</span></div>' +
        '<div class="matchup-main"><div class="game-kicker"><span>' + html(sportName) + '</span><span class="district-pill">' + html(context) + '</span></div>' +
          '<div class="versus"><h2>Lincoln Christian</h2><span class="vs">vs</span><h2>' + html(game.opponent) + '</h2></div>' +
          '<div class="game-meta"><span><strong>' + html(game.time || "TBD") + '</strong> kickoff / tip</span><span><strong>' + html(game.site) + '</strong></span><span>' + html(game.venue || "Venue TBD") + '</span></div></div>' +
        '<div class="record-cards"><div class="record-card"><span>Lincoln Christian</span><strong>' + html(game.lincolnRecord || "Record —") + '</strong><small>Bulldogs</small></div>' +
          '<div class="record-card"><span>' + html(game.opponent) + '</span><strong>' + html(game.opponentRecord || "Record —") + '</strong><small>' + html(game.mascot || "Opponent") + '</small></div></div>' +
      '</div>';
    renderChecklist(game);
    document.getElementById("opponentName").textContent = game.opponent + (game.mascot ? " " + game.mascot : "");
    var snapshot = game.snapshot.length ? game.snapshot : ["Add verified opponent record, recent results, style and local reporting notes."];
    document.getElementById("opponentSnapshot").innerHTML =
      '<div class="snapshot-record"><div><strong>' + html((game.opponentRecord || "—").split(" · ")[0]) + '</strong><span>Overall</span></div><div><strong>' + html((game.opponentRecord || "—").split(" · ")[1] || "—") + '</strong><span>District</span></div><div><strong>' + html(game.site) + '</strong><span>Site</span></div></div>' +
      '<ul class="snapshot-list">' + snapshot.map(function (item) { return '<li>' + html(item) + '</li>'; }).join("") + '</ul>';
    document.getElementById("gameSources").innerHTML = game.sources.length ? game.sources.map(sourceLink).join("") : '<p class="source-note">Add source links in your notes or open the research shelf.</p>';
    document.querySelectorAll("[data-note]").forEach(function (field) {
      field.disabled = false;
      field.value = game.notes[field.dataset.note] || "";
    });
    renderStats(game);
    renderDeskRoster();
  }
  function renderEmptyDesk() {
    document.getElementById("matchupHero").innerHTML =
      '<div class="matchup-content"><div class="matchup-main"><div class="game-kicker"><span>' + html(sportLabels[state.activeSport]) + '</span></div><div class="versus"><h2>No verified games loaded</h2></div><div class="game-meta"><span>Open the official schedule, then add the first confirmed game.</span></div></div></div>';
    document.getElementById("checklist").innerHTML = "";
    document.getElementById("progressText").textContent = "Start with a game";
    document.getElementById("progressBar").style.width = "0%";
    document.getElementById("opponentName").textContent = "Opponent";
    document.getElementById("opponentSnapshot").innerHTML = '<p class="source-note">No opponent selected.</p>';
    document.getElementById("gameSources").innerHTML = "";
    document.querySelectorAll("[data-note]").forEach(function (field) { field.value = ""; field.disabled = true; });
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
    var roster = currentSportData().roster.filter(function (p) {
      return !query || (p.name + " " + p.number + " " + p.position).toLowerCase().indexOf(query) >= 0;
    });
    document.getElementById("deskRoster").innerHTML = roster.length ? roster.map(function (p) {
      return '<div class="person-row"><input type="checkbox" data-spotlight="' + p.id + '"' + (p.spotlight ? " checked" : "") + ' aria-label="Include ' + html(p.name) + ' on printout">' +
        '<span class="num">#' + html(p.number) + '</span><div><strong>' + html(p.name) + '</strong><small>' + html([p.grade,p.position].filter(Boolean).join(" · ")) + '</small></div>' +
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
    var query = document.getElementById("rosterSearch").value.toLowerCase().trim();
    var roster = currentSportData().roster.filter(function (p) {
      return !query || (p.name + " " + p.number + " " + p.position + " " + p.grade).toLowerCase().indexOf(query) >= 0;
    });
    document.getElementById("rosterBody").innerHTML = roster.length ? roster.map(function (p) {
      return '<tr><td><input type="checkbox" data-spotlight="' + p.id + '"' + (p.spotlight ? " checked" : "") + ' aria-label="Include ' + html(p.name) + ' on printout"></td>' +
        '<td><strong>#' + html(p.number) + '</strong></td><td><strong>' + html(p.name) + '</strong></td><td>' + html(p.grade) + '</td><td>' + html(p.position) + '</td>' +
        '<td><input type="text" data-roster-note="' + p.id + '" value="' + html(p.note || "") + '" placeholder="Pronunciation, hometown, family, milestone"></td>' +
        '<td><button class="remove-btn" data-delete-player="' + p.id + '" aria-label="Remove ' + html(p.name) + '">×</button></td></tr>';
    }).join("") : '<tr><td colspan="7">No players yet. Add the first player or switch sports.</td></tr>';
  }
  function renderResearch() {
    document.getElementById("programNotes").value = state.programNotes || "";
    document.getElementById("researchSources").innerHTML = researchLibrary.map(function (source) {
      return '<article class="research-source"><h3>' + html(source.title) + '</h3><p>' + html(source.note) + '</p><a href="' + html(source.url) + '" target="_blank" rel="noreferrer">Open source ↗</a></article>';
    }).join("");
  }

  function setView(view) {
    currentView = view;
    document.querySelectorAll(".nav-btn").forEach(function (btn) { btn.classList.toggle("active", btn.dataset.view === view); });
    document.querySelectorAll("[data-view-panel]").forEach(function (panel) { panel.classList.toggle("active", panel.dataset.viewPanel === view); });
    var titles = { desk:["GAME PREPARATION","Game Desk"], schedule:["SEASON CONTROL","Schedule"], roster:["NAME COMMAND","Roster Book"], research:["VERIFIED CONTEXT","Research Shelf"] };
    document.getElementById("viewEyebrow").textContent = titles[view][0];
    document.getElementById("viewTitle").textContent = titles[view][1];
    document.querySelector(".sidebar").classList.remove("open");
    document.getElementById("menuBtn").setAttribute("aria-expanded", "false");
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
    currentSportData().roster.push({
      id: uid(), number: String(fd.get("number") || ""), name: String(fd.get("name") || "").trim(),
      grade: String(fd.get("grade") || "").trim(), position: String(fd.get("position") || "").trim(), note: "", spotlight: false
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
    function section(title, value) {
      return '<section class="print-section"><h2>' + html(title) + '</h2><p>' + html(value || "—") + '</p></section>';
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
      '<section class="print-section"><h2>Live game log</h2><div class="print-lines"></div></section></div>' +
      '<div><section class="print-section"><h2>Quick stats</h2><table class="print-stats"><thead><tr><th>Stat</th><th>LC</th><th>' + html(game.opponent) + '</th></tr></thead><tbody>' + statRows + '</tbody></table></section>' +
      '<section class="print-section"><h2>On-sheet roster</h2><table class="print-roster"><thead><tr><th>#</th><th>Name</th><th>Pos.</th><th>Note</th></tr></thead><tbody>' + (playerRows || '<tr><td colspan="4">Mark players in the roster book.</td></tr>') + '</tbody></table></section>' +
      section("Opponent update", notes.opponentUpdate) + '</div></div>';
    return true;
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest("button, label");
    if (!target) return;
    if (target.matches(".sport-btn")) setSport(target.dataset.sport);
    if (target.matches(".nav-btn")) setView(target.dataset.view);
    if (target.matches(".tab-btn")) {
      activeTab = target.dataset.tab;
      document.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.toggle("active", b.dataset.tab === activeTab); });
      document.querySelectorAll("[data-tab-panel]").forEach(function (p) { p.classList.toggle("active", p.dataset.tabPanel === activeTab); });
    }
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
      var player = currentSportData().roster.filter(function (p) { return p.id === target.dataset.deletePlayer; })[0];
      if (player && window.confirm("Remove " + player.name + " from this roster?")) {
        currentSportData().roster = currentSportData().roster.filter(function (p) { return p.id !== player.id; });
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
      var player = currentSportData().roster.filter(function (p) { return p.id === target.dataset.rosterNote; })[0];
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
      var player = currentSportData().roster.filter(function (p) { return p.id === target.dataset.spotlight; })[0];
      if (player) { player.spotlight = target.checked; saveState(); }
    }
    if (target.matches("#importFile")) importBackup(target.files[0]);
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
          section: { type: "string", enum: ["opening","lincolnStory","opponentStory","film","keys","calls","liveLog","opponentUpdate"] },
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

  renderAll();
  setView(currentView);
  registerWebMCP();
})();
