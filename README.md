# SYNOPTARA — sito commerciale

Sito statico pubblico di SYNOPTARA, pronto per Cloudflare Pages e consultabile senza strumenti di build.

## Anteprima locale

Aprire `index.html` direttamente nel browser. In alternativa, dalla cartella del progetto si può avviare un semplice server HTTP locale, per esempio con `python -m http.server 8000`.

## Modifica dei contenuti

- Homepage commerciale: `index.html`
- Approfondimenti: `platform.html`, `software.html`, `ai.html`, `integration.html`
- Aspetto e comportamento responsive: `styles.css`
- Menu mobile e animazioni leggere: `script.js`
- Selettore lingua: `i18n.js`
- Traduzioni inglese, francese e tedesco: cartella `translations/`
- Immagini e icone: cartella `assets/`

Usare sempre percorsi relativi per mantenere il sito funzionante anche da file locale.

## Deploy su Cloudflare Pages

Collegare questo repository a Cloudflare Pages e impostare:

- Framework preset: `None`
- Build command: lasciare vuoto
- Build output directory: `/`
- Root directory: lasciare vuoto

Il dominio di produzione previsto è `https://synoptara.dev`.

## Struttura

```text
index.html
platform.html
software.html
ai.html
integration.html
styles.css
script.js
i18n.js
translations/
assets/
README.md
```
