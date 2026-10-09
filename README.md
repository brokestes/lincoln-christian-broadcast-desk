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

Choose a game in Schedule. In Rosters or Roster book, choose Lincoln or the selected opponent. Mark Sheet checkboxes to include players, then add pronunciation and broadcast notes. Season stats contains the sourced statistical tables. History & broadcast nuggets follows the selected matchup and sport; its buttons append cited facts without replacing existing notes. Team history & matchup archive controls its optional print section. The live feed is below the board on Game Desk; use Pause auto, Refresh now or Use link as needed. Select packet sections and use Preview packet before printing.

Facts and rosters should be rechecked before each game. Unverified opponents are labeled "not verified"; an inaccessible source is not described as an unpublished roster. Film interpretation and on-air judgment remain with the announcer.

## Files

`index.html`, `styles.css`, `app.js`, `broadcast-data.js`, `school-history.js`, `history-desk.js`, and `live-stats.js` are served directly from the main branch root. No build step, account, downloaded HTML attachment, or backend is required for the announcer.
