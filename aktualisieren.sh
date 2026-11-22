#!/bin/zsh
# Kopiert die aktuellen Dateien aus Final-Animationen hierher (ASCII-Namen)
# und baut KGUE-Animationen.zip neu. Danach: git add -A && git commit && git push
set -e
cd "${0:A:h}"
S="$HOME/Documents/RWTH_Module/Obsidian/Info-3-Tutor/Final-Animationen"
cp_() { mkdir -p "$(dirname "$2")"; cp "$S/$1" "$2"; }
cp_ "KGÜ-01/KGÜ-1_Shell-Film.html"                kgue-1/shell.html
cp_ "KGÜ-01/KGÜ-1_gcc-Film.html"                  kgue-1/gcc.html
cp_ "KGÜ-02/KGÜ-2_RAM.html"                       kgue-2/ram.html
cp_ "KGÜ-02/ram-chips.jpg"                        kgue-2/ram-chips.jpg
cp_ "KGÜ-02/ram-label.jpg"                        kgue-2/ram-label.jpg
cp_ "KGÜ-02/KGÜ-2_NASM.html"                      kgue-2/nasm.html
cp_ "KGÜ-02/KGÜ-2_Aufgaben.html"                  kgue-2/aufgaben.html
cp_ "KGÜ-03/KGÜ-3_Git-Grundlagen.html"            kgue-3/git.html
cp_ "KGÜ-03/KGÜ-3_Aufgabe-1.html"                 kgue-3/aufgabe-1.html
cp_ "KGÜ-03/KGÜ-3_Aufgabe-2.html"                 kgue-3/aufgabe-2.html
cp_ "KGÜ-03/KGÜ-3_Aufgabe-3.html"                 kgue-3/aufgabe-3.html
cp_ "KGÜ-04/KGÜ-4_Speicher-fuer-Programme.html"   kgue-4/speicher.html
cp_ "KGÜ-04/KGÜ-4_Allokationsstrategien.html"     kgue-4/aufgabe-3.html
cp_ "KGÜ-05/KGÜ-5_Scheduling-Film.html"           kgue-5/scheduling.html
cp_ "KGÜ-05/KGÜ-5_Aufgabe-1.html"                 kgue-5/aufgabe-1.html
cp_ "KGÜ-05/KGÜ-5_Aufgabe-2.html"                 kgue-5/aufgabe-2.html
cp_ "KGÜ-05/KGÜ-5_Aufgabe-3.html"                 kgue-5/aufgabe-3.html
# Besuchszähler in jede Seite einbauen (läuft nur online, nicht im Zip)
Z='<script src="../start/z.js" defer></script>'
for f in kgue-*/*.html; do
  grep -q 'start/z.js' "$f" && continue
  if grep -q '</body>' "$f"; then perl -0pi -e "s{</body>(?!.*</body>)}{$Z\n</body>}s" "$f"; else print -r -- "$Z" >> "$f"; fi
done
rm -f KGUE-Animationen.zip
T=$(mktemp -d); mkdir "$T/KGUE-Animationen"
cp -R index.html start kgue-* "$T/KGUE-Animationen/"
(cd "$T" && zip -qr -X KGUE-Animationen.zip KGUE-Animationen -x '*.DS_Store')
mv "$T/KGUE-Animationen.zip" .
echo "fertig: $(ls kgue-*/*.html | wc -l | tr -d ' ') Seiten, Zip $(du -h KGUE-Animationen.zip | cut -f1)"
