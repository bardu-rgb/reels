# Cum îi dai lui Claude acces la calculatorul și browserul tău

Sesiunea din cloud NU poate ajunge la calculatorul tău. Îți trebuie o sesiune care rulează pe PC-ul tău.

## Varianta A: Claude Desktop (cea mai simplă)
1. Descarcă și instalează **Claude Desktop** de pe claude.ai/download.
2. Loghează-te cu contul tău.
3. Deschide tab-ul **Code** și alege folderul de lucru.

## Varianta B: Remote Control din terminal
1. Instalează Node.js (nodejs.org, versiunea LTS).
2. Deschide PowerShell sau Terminal și rulează:
   ```
   npm install -g @anthropic-ai/claude-code
   ```
3. Intră în folderul de lucru, de exemplu:
   ```
   cd Desktop\reels
   ```
4. Rulează `claude` o dată ca să te loghezi, apoi:
   ```
   claude remote-control
   ```
5. Sesiunea apare în aplicația Claude Code (telefon sau web), de unde o controlezi.

## Pentru browser (TikTok, Fish Audio)
1. Instalează extensia **Claude in Chrome** din Chrome Web Store.
2. Loghează-te în extensie cu același cont Claude.
3. Când sesiunea locală cere acces la browser, aprobă.

Notă: oricum, eu nu introduc parole și nu postez fără confirmarea ta.
