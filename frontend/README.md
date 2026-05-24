# Audio AI TTS React UI

This is a small React app built for static hosting, such as GitHub Pages.

## Setup

1. Open a terminal in `frontend`
2. Run `npm install`
3. Run `npm run dev` for local development
4. Run `npm run build` to generate static files in `dist`

## GitHub Pages Deployment

You can deploy the built static site with GitHub Pages.

1. Build the app: `npm run build`
2. Commit the `dist` output or configure GitHub Pages to serve from the `gh-pages` branch.

If you want to publish automatically, install `gh-pages` and then run:

```bash
npm run deploy
```

Note: The app uses the browser SpeechSynthesis API for client-side TTS playback. Direct MP3 export is not available in a pure static GitHub Pages deployment without a backend service.

## Download audio

A download button is now available in the UI. It generates a client-side WAV file and saves it as `speech.wav`.
