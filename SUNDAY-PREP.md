# Sunday football research workflow

This is the public handoff guide for the single-announcer Lincoln Christian Broadcast Desk. Target a 9:00 AM America/Chicago start on Sundays and completion before noon when sources, access and usage limits permit. Never claim completion before publishing and checking the live site.

## Current automation status

Free GitHub data checks are implemented separately from fuller AI-assisted research. `refresh-schedule.yml` collects the three official varsity sport calendars every three hours. `refresh-football.yml` checks football data on Sundays at 8:17 AM and 11:17 AM Tulsa time and can be run manually. The full research cloud connection has not yet been verified; this guide is not evidence that a cloud research schedule is enabled. Do not add a paid API, Railway service, credits, or broader repository access without explicit user approval.

## Next matchup, not necessarily Friday

1. Refresh the public repository and run `node scripts/update-football.mjs football-feed.json schedule-feed.json` with Node 22 or later.
2. Use the official Lincoln football schedule to select the next scheduled varsity game after today's Central date, excluding canceled games, byes and scrimmages. Thursday games count. On October 11, 2026 the currently published next game is Spiro on Thursday October 15. Recheck rather than hard-code that matchup.
3. Check the previous Friday's (or latest scheduled) result and available season/player stats for both schools. Do not carry five-game totals forward as if they include six games. Compare reported GP with posted finals, disclose gaps, and cite provider update time separately from source check time.

## Information the broadcaster needs

Find short, source-backed highlights for the existing Lincoln storylines, Opponent storylines, and Keys & matchups boxes. These should cover coaching, last-game recap, overall/district records, recent form, meaningful streaks, program history/traditions, prior meetings, offensive production, passing/rushing/receiving leaders, tackles/TFL/sacks/takeaways, special teams and significant current player context. Keep historical coverage years explicit. No film analysis is being automated.

Use official Lincoln and opponent school/athletics reporting first; MaxPreps for published schedules/rosters/stats; SKORDLE for score cross-checks; I Was At The Game for archived records, titles and prior meetings; Tulsa World, VYPE, Heavener.news and other reputable Oklahoma reporting for public athlete features and game coverage. Open actual articles rather than citing search snippets. Respect access restrictions; never bypass paywalls or private social accounts. News links are not continuously monitored merely because they are listed on the site.

Player context may include verified public multisport participation, awards, accomplishments and relevant interviews. Confirm identity, school and season. Do not guess GPA, personal social handles, injuries or private biographical details. A missing roster must be reported as not published only after a successful source check showing no players; inaccessible sources mean unverified, not nonexistent.

Resolve contradictions if possible; otherwise present both reports with a before-air warning. For example the October 2 Victory score is 62–6 in official headline/live reporting but 61–6 in MaxPreps and the recap body. Current jersey numbers can differ from older printed sheets. Do not invent coaching career records, first-ever meetings or streaks from insufficient coverage.

## Public highlight file

Write only sourced, public facts to `weekly-highlights.json`. Preserve existing entries for other game dates. Each entry uses:

```json
{
  "sport": "football",
  "gameDate": "YYYY-MM-DD",
  "opponent": "Exact published school name",
  "checkedAt": "ISO UTC time of actual research",
  "sections": {
    "lincolnStory": [],
    "opponentStory": [],
    "keys": []
  }
}
```

Each fact is `{ "text": "Short factual highlight", "url": "https://original-source-page", "date": "Publication date and/or explicitly labeled research date", "label": "Source name" }`. Never use a new research timestamp to imply that an older article is new. The wrapper is `{ "version": 1, "timeZone": "America/Chicago", "generatedAt": "ISO UTC", "entries": [...] }`. Highlight facts are keyed to both sport and selected game date/opponent, and automatically appear and print without copying into private notes.

When a topic has no verified information, disclose the gap in the report rather than filling it with speculation. If research is incomplete, do not stamp the whole packet complete. Keep citations close to facts and keep quotations within source limits.

## Publish and verify

The authorized destination is `brokestes/lincoln-christian-broadcast-desk`, main branch, serving https://brokestes.github.io/lincoln-christian-broadcast-desk/. The repository root is the public static site; no build step is needed.

Validate the JSON with `LincolnWeekly.validateCurated`, check source/date/identity for every new highlight, and run available tests before publication. Commit only the intended public data/highlight changes. Never upload the original prep photos, backups, localStorage exports, credentials or the announcer's notes. The browser client preserves note text and Sheet selections when updating sourced roster fields. Do not reset or erase user changes.

If authorized GitHub write access is unavailable in cloud, stop before attempting credential workarounds and report that publication needs attention. Cloud compute alone does not establish permission to commit or enable recurring runs. After publishing, read the raw public JSON and live website to confirm the target matchup, last-game score, coverage dates, opponent schedule, roster status, printed highlights and missing-data warnings. Report what changed, what remains unavailable, and whether the site was actually updated before noon.
