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
- 8 days: morning social actions → house event → daily challenge (BUZZ!, quiz, math, memory, likes, rope) → prize steal → nominations → public vote.
- Night 4: "Noaptea Chipărușului" stealth event. Finale: rope endurance, then a jury of eliminated contestants.
- Add `#debug` to the URL to auto-resolve challenges (used for automated playthroughs).
