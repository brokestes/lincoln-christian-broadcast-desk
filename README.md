# Lincoln Christian Broadcast Desk

[Open the desk](https://brokestes.github.io/lincoln-christian-broadcast-desk/)

Single-announcer preparation workspace, hosted as a static GitHub Pages site.

## What is included

- Lincoln football player statistics: 14 MaxPreps tables, five games, provider updated October 3, 2026. This is a dated research snapshot, not automatic MaxPreps synchronization.
- Official Lincoln roster with available MaxPreps heights and weights. Names and jerseys are matched together; unmatched measurements are not guessed.
- Published 2026 opponent rosters for Heavener, Spiro, Checotah, Hugo and Roland, checked October 8. MaxPreps currently lists 32, 21, 48, 45 and 28 players respectively. Publication is not a guarantee of game-day completeness.
- Heavener player facts with individual sources: previous basketball participation, football highlights and public-school FFA results. No unverifiable personal social accounts or GPA claims.
- Editable transcriptions of the announcer's prep photos. Unclear text and source conflicts are labeled for confirmation before air. Original photos are not uploaded.
- Larger screen text and a printable packet with selectable offense, defense, special teams and full-roster sections.
- I Was At The Game source links and researched history for Lincoln plus all nine Oklahoma football opponents on the loaded schedule. Includes archived W–L–T and games through 2025, state titles, playoff/state-tournament years, selected school scoring records for boys basketball, and scored past Lincoln matchups where listed. Shiloh Christian is explicitly unavailable in this Oklahoma directory. This is an October 8 research snapshot, not automatic source synchronization.
- Direct TurboStats polling every 20 seconds while the browser tab is visible. Score, team totals, player offense/defense, scoring summary and recent plays depend on what the scorekeeper records.

## Live feed safeguards

Default reusable link: https://www.turbostatslive.com/football/webcast/08002611450495

The public provider API permits cross-origin reads, so this feature does not require Railway, credentials or a proxy. The link is configurable per game. A different game/date is visibly labeled and excluded from the selected game's printed packet. Failed refreshes retain the last successful data with a connection warning. Provider quarter-score discrepancies are flagged, not corrected by guesswork.

On October 8 the shared feed still showed October 2 versus Victory Christian. Its score (62–6) differs from MaxPreps' schedule (61–6); verify with Lincoln's scorekeeper before announcing a final. Live defensive entries were not recorded in that feed; the desk does not treat that as proof that no tackles occurred.

## Saving and privacy

The website and researched facts are public. The announcer's edits are saved in this browser's local storage, not sent to GitHub or shared among devices. Existing saved notes are preserved when this version loads. Use Export backup / Import to move notes between computers or browsers. Clearing browser data can remove local notes.

## Using the desk

Home is the landing page, with the next upcoming event, a combined football/boys/girls basketball calendar, sport filters, direct game preparation buttons, broadcast-tool shortcuts, sourced title history, and season records calculated only from posted official results. Selected Sheet players appear first in both roster views; search and notes remain available, and source roster ordering is not overwritten.

The public schedule feed is collected from the school's visible schedule rows, including scrimmages and TBD opponents/times. Hidden structured-data times are not substituted for visibly missing times. Checks are scheduled every three hours using `.github/workflows/refresh-schedule.yml`; Home retrieves the latest repository feed every five minutes while visible, on return to the tab, or with Refresh. This is periodic synchronization, not instant scorekeeping. Scheduled GitHub jobs can be delayed or disabled after repository inactivity; timestamps, stale-data labels and source links remain visible. A failed source check retains its previous verified events with a warning. No district ranking is inferred. School events are planning information, not confirmed broadcaster assignments. Opening an event creates its local prep board only when needed and preserves existing prepared games.

The collector is `scripts/update-schedule.mjs`, the public data is `schedule-feed.json`, and the Home renderer is `home-desk.js`. The approved scheduled job can write only the staged schedule JSON in its normal workflow. No credentials or announcer notes are included in that data. The page reads the raw public repository feed directly so automated data commits do not require a new Pages deployment. Artwork: official LC monogram from athletics; Bulldog mascot from the school's MaxPreps page, stored locally for reliable display.

Choose a game in Schedule. Game Desk is organized into seven sections: Prep, Rosters, Stats, Live game, History, Sources and Print packet. Only the selected section appears; the matchup and prep checklist remain above it. The section row stays accessible while scrolling, supports Left/Right/Home/End keys, and remembers the last selected section in this browser.

Prep contains editable opening/storyline/film/call notes and the opponent snapshot. Long prep-sheet references are expandable. In Rosters or Roster book, choose Lincoln or the selected opponent. Mark Sheet checkboxes to include players, then add pronunciation and broadcast notes. Stats separates the editable Quick stats board from sourced Season stats tables. Live game contains TurboStats and the editable game log; use Pause auto, Refresh now or Use link as needed. History follows the selected matchup and sport; its buttons append cited facts without replacing existing notes. Sources contains the selected game's original links. Print packet contains selectable packet sections and Preview packet. Printing draws from the entire selected game's data, not just the currently visible section.

Facts and rosters should be rechecked before each game. Unverified opponents are labeled "not verified"; an inaccessible source is not described as an unpublished roster. Film interpretation and on-air judgment remain with the announcer.

## Files

`index.html`, `styles.css`, `app.js`, `broadcast-data.js`, `school-history.js`, `history-desk.js`, and `live-stats.js` are served directly from the main branch root. No build step, account, downloaded HTML attachment, or backend is required for the announcer.
