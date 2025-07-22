# Film Development Calculator

A modern web app for calculating film development times with a built-in timer. Works offline as a PWA and supports mobile devices.

https://maximeliseyev.github.io/filmdevcalculator/

## Features
- Real database of film + developer + dilution + ISO times
- Dynamic options for dilution and ISO
- Built-in timer with notifications and vibration
- Responsive dark UI (Tailwind CSS)
- Works offline (PWA)

## Usage
1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/filmdevcalculator.git
   cd filmdevcalculator
   ```
2. Open `index.html` in your browser, or run a local server:
   ```bash
   python -m http.server 8000
   # or
   npx serve .
   ```
3. Go to `http://localhost:8000`

## Project structure
- `index.html` — main UI
- `app.js` — main logic
- `data/` — all film/dev/time data in JSON
- `sw.js` — service worker for offline
- `manifest.json` — PWA manifest

## License
MIT. See `LICENSE` file.