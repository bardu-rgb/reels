# reels

TikTok/Reels factory built on Remotion: kinetic typography, a dev-log counter, camera shake, flashes and film grain. Every video is driven by props (script, numbers, clips).

## Commands
- `npx remotion studio`: live preview and prop editing
- `npx remotion render src/index.ts Day1 out/day1.mp4`: export the MP4 (1080x1920, 30fps)

## Writing a script
In `beats`, wrap the words to highlight in yellow in asterisks: `"one player found it in *4 MINUTES*"`.
Modes: `pop` (bouncy words), `slam` (impact + shake), `rise` (slides up from a mask), `type` (typewriter).

## Gameplay clips
Put your recordings in `public/clips/` and set `hookClip` / `beats[i].clip` to `"clips/file.mp4"`.
Without real footage you get the fallback backdrop. Real footage looks far better: record it.

## Voice
Set `voiceover` to `"vo/day1.mp3"` (the file goes in `public/vo/`).

## Buzz House: Sezonul Tău (fan game)
`game/index.html` is a self-contained mobile game (no build, no dependencies, fonts inlined). Open it in any browser.
- 8 days: morning social actions → house event → daily challenge → prize steal → nominations → public vote with live chat.
- Every season is a different edition (Clasică, Winter, Vila din Pădure, Vară) with its own rules, prizes, events and animated background.
- 3 of 6 Selly twists per season (secret contestant, double elimination, prize swap, comeback, immunity for sale, house leader).
- 9 challenges, 7 per season: BUZZ!, quiz, math, memory, likes, rope, "Cine a zis-o?", TikTok Dance, Paparazzi.
- Chipăruș stealth night (twice in the forest edition). Finale: rope endurance, then a jury of eliminated contestants.
- Between seasons it remembers your record, history and 15 badges; the end screen makes a 1080x1920 story card.
- Every season comes from a seed: "Sezonul zilei" is the same season for everyone that day, and `game/#s<seed>p<points>` links challenge a friend to the exact same season.
- A secret rival targets you each season (revealed on day 2); you can get them eliminated or make peace. The house map shows alliances and feuds.
- On GitHub Pages it has link previews (`game/og.png`), a web app manifest and an offline service worker (`game/sw.js`).
- Add `#debug` to the URL to auto-resolve challenges (used for automated playthroughs).
