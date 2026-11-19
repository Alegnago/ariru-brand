# Font locali

Font variabili ufficiali, scaricati senza modifiche dal repository Google Fonts il 19 novembre 2026. Non installati nel sistema.

- `Petrona.ttf`: [Petrona[wght].ttf](https://raw.githubusercontent.com/google/fonts/main/ofl/petrona/Petrona%5Bwght%5D.ttf). Licenza: `Petrona-OFL.txt` (SIL Open Font License 1.1).
- `Geologica.ttf`: [Geologica[CRSV,SHRP,slnt,wght].ttf](https://raw.githubusercontent.com/google/fonts/main/ofl/geologica/Geologica%5BCRSV%2CSHRP%2Cslnt%2Cwght%5D.ttf). Licenza: `Geologica-OFL.txt` (SIL Open Font License 1.1).

CSS `@font-face` locale; nell'autonomo `inline.html` gli stessi file sono incorporati come data URL. Nessun caricamento remoto a runtime. Nome a peso 300 in entrambe le opzioni; qualifica 350, testo retro 350, nomi centri 450. Assi non richiesti lasciati ai valori predefiniti del font.

La UI segnala esplicitamente un errore se uno dei due font non viene caricato. La verifica Chrome DevTools `CSS.getPlatformFontsForNode` conferma l'uso effettivo di entrambi i webfont personalizzati, oltre al controllo di `document.fonts`.
