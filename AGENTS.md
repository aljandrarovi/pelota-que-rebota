# AGENTS.md

## What this is
Single-page p5.js animation ("pelota que rebota"): a Halloween bat that
bounces around the screen over a purple-to-black gradient background. It
periodically says "boo" with a synthesized Halloween ambience, pauses while the
cursor is over it, and moving the mouse releases a swarm of bat particles for
10 seconds. No build system, no package manager, no tests, no lint config.
Three files: `index.html`, `sketch.js`, and `style.css`.

## Running
- `index.html` loads p5.js and the `p5.sound` addon from the jsDelivr CDN
  (`p5@1.11.13`) and `sketch.js` as a plain global script. No bundler or dev
  server config. Load order matters: `p5.sound.min.js` must come after
  `p5.js`.
- Fastest check: open `index.html` in a browser.
- `.vscode/launch.json` launches Chrome at `http://localhost:8080`, but no
  server is defined in the repo — start one yourself first, e.g.
  `python -m http.server 8080`.

## Conventions / gotchas
- `sketch.js` uses p5 **global mode**: `setup()` and `draw()` are global and
  auto-invoked by p5. Do not wrap them in a module or add imports/exports.
- `colorMode(HSB, 360, 100, 100, 1)` is set in `setup()`. The character is
  always the bat drawn by `dibujarMurcielago()` (there is no ghost/pumpkin
  anymore). The background gradient is painted each frame by `dibujarFondo()`
  via `drawingContext.createLinearGradient` (purple `#3c096c` to black); note
  this uses raw canvas colors, not the HSB `fill()`.
- The title is an HTML overlay (`.titulo` in `style.css`, Creepster font), not
  drawn on the canvas. It uses `pointer-events: none` so it does not block the
  ball's cursor-hover detection — keep that or hovering stops working under
  the text.
- Sound is fully synthesized (no audio files): a background drone (`fondoA` +
  detuned `fondoB`), `lamento` (a theremin-like tone whose frequency is swept
  in `draw()`), brown-noise `viento`, and a `decirBoo()` "boo" fired on a
  random interval (`proximoBoo`). It only starts after a user gesture;
  `mousePressed()` calls `userStartAudio()` for this reason. Silence before
  the first click is expected, not a bug.
- Moving the mouse spawns a bat particle swarm (`murcielagos` array,
  `spawnMurcielago()` / `actualizarMurcielagos()` / `dibujarMurcielagoParticula()`).
  Emission is gated to a single 10-second window (`DURACION_VENTANA`) that
  starts on the first `mouseMoved()`; afterwards the existing bats fade out and
  no new ones spawn until reload. Spawn rate is throttled and capped at
  `MAX_MURCIELAGOS`.
- Hovering the bat pauses it. The browser also requests `/favicon.ico` unless
  a `<link rel="icon">` is present (an inline data URI avoids that 404).
- Code and UI text are in Spanish; keep comments/UI consistent.
- There is no verification step beyond visually loading the page; do not look
  for `npm test`/lint to validate changes.
