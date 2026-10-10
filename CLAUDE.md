# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A pixel-art "32-bit game" wedding invitation (Phong & Trang). The guest enters their name, watches an 8-chapter journey (Hà Nội → Nam Định → Hòa Bình → Đà Nẵng → Hội An → Đà Lạt → Quy Nhơn → Phú Quốc), then gets a personalised invitation card they can save as a GIF. Pure static HTML/CSS/JS: no build, no package manager, no tests, no linter. All code comments, UI text and dialogue are Vietnamese; keep new comments/text in Vietnamese to match.

## Running

```bash
python -m http.server 8000
```

Then open http://localhost:8000 (`.claude/launch.json` defines this as `wedding-web`, plus `wedding-web-8010` on port 8010). Opening `index.html` directly also works, but the dev pages under `tools/` need the server.

- **Debug chapter picker:** `index.html?debug` shows a debug bar; `?debug=3` jumps straight to chapter 3. Keys: `1`–`9` jump to that chapter, `[` / `]` go to the previous/next chapter, `R` restarts the chapter, `F` cycles speed x1/x3/x6 (`timeScale`). This is the main way to check a scene after editing.
- **`tools/sprites.html`**: every character frame, zoomed (`?scale=8&only=tay` filters by group prefix; the list comes from `spriteCatalog()` in `sprites.js`).
- **`tools/anim.html`**: a zoomed live animation (`?scene=walk` / `?scene=eat`, `&strip=1` for a frame strip, `x0`/`w` to crop).
- The tool pages load only a subset of the scripts (not the city files, `gif.js` or `main.js`) and stub the DOM ids the game expects. If a script they load starts depending on another file, add that file to their `<script>` list too.

## Architecture

**Global-script model.** There are no modules. Each `js/*.js` is a classic `<script>` sharing one global scope, and **load order in `index.html` matters**: `config → core → sprites → audio → render → actors → scenes → namdinh/hoabinh/danang/hoian/dalat/quynhon/phuquoc → chapters → story → ui → card → gif → main → debug`. Mutable game state lives in top-level `let`s spread across files (`time`, `cam`, `mode`, `L` in `core.js`; `actors`, `props`, `phone`, `weather` in `actors.js`; `sceneT`, `flashA`, `mapAnim` in `scenes.js`; `script`, `chapter`, `blocking` in `story.js`). Any file can read or write them.

**Rendering.** A single 480×270 canvas (`W`, `H`; ground line `GY = 222`) with smoothing off, CSS-scaled to 16:9 by `layout()` in `main.js`. All drawing goes through tiny helpers in `render.js`: `fr(color, x, y, w, h)` (fillRect), `tiles(step, parallax, fn)` for parallax repeats, `ditherInto` (Bayer-dithered gradients), `glow`, and `rnd(i)` (deterministic hash, so scenes look the same every frame). World x is converted to screen x by subtracting `cam`, and `render()` rounds `cam` so the background and actors snap together. Costly static layers are pre-rendered once into offscreen canvases and cached (`skies`, `ndChC`, `hbLandC`, …). The 2D context uses `willReadFrequently` because the Nam Định scene reads pixels back every frame for its wet-sand reflection.

**Main loop** (`story.js`): fixed 60 Hz `step()` → `updateActors`, `updateStory`, `tripUpdate`, `updateFx`; then `render()` → `renderScene()`, which draws `drawBg(theme)`, `drawGround`, actors, particles, phone and overlays.

**Theme dispatch.** Each chapter has a `theme` string. Per-city visuals are added by branching on the theme in a few hook functions in `scenes.js`: `tripSky` (dithered sky), `drawTrip` (background layers), `drawTripGround`, `tripUpdate` (per-frame logic) and `tripOverlay`. The larger cities have their own files (`namdinh.js` → `nd*`, `hoabinh.js` → `hb*`, `danang.js` → `dn*`, `hoian.js` → `ha*`, `dalat.js` → `dl*`, `quynhon.js` → `qn*`, `phuquoc.js` → `pq*`), and the hooks call into them (`ndScene`, `hbScene`/`hbFront`/`hbUpdate`, `dnScene`/`dnGround`/`dnUpdate`). `render.js` still contains older themes (`office`, `chat`, `street`, `village`, `sunset`), and `sunset` is the menu background. Each city file starts with a comment describing its screen-space layout and constants. Read it before editing that scene.

Adding a chapter or city means touching: `CITIES` (name plus lon/lat for the map) in `scenes.js`, an entry in `CHAPTERS`, the theme hooks above, a `<script>` tag if it gets its own file, and a matching entry in `CONFIG.memories` (the index must line up with `{ memory: n }`).

**Script engine** (`story.js` + `chapters.js`). Each chapter's `build()` returns an array of steps that `exec()` interprets one by one. A step either finishes at once or returns a "blocking" token (`walk` until the actor arrives, `wait` for a duration, `cb` until a dialog/banner callback runs `resume()`). Steps: `place`, `walk [name, x, async]`, `title`, a bare `['G'|'B'|'P'|actorName, text]` dialogue line, `emote`, `pose`, `face`, `jump`, `camTo`, `follow`, `fn`, `wait`, `until` (blocks until its function returns true), `chat`/`typing` (phone), `banner`, `rsvp`, `memory`, `cut` (`[theme, name]`: fade out, clear actors/props, switch `L.theme` to a second scene within the same chapter; chapter 8 uses it to go from VinWonders to the `pqdinner` vintage indoor restaurant scene (one arched window looks out on the east-facing sea at night, light rain, string lights on the beach), also in `phuquoc.js` as `pqr*`), `end`. `nm()` resolves speaker keys to names from `CONFIG`/`guest`. `stopStory`/`jumpChapter` cancel any pending banner, fade or callbacks so a stale callback can't advance a new script.

**Actors and sprites.** `actors.js` decides each frame which pose to draw (`actorFrame`: legs/arm/face chosen from the pose, walking, talking, emote or mid-air state), then calls `body(look, kind, legs, arm, face)` in `sprites.js`. Characters are ASCII grids (`HEAD`, `TORSO`, `BRIDE`, `LEGS`, `ARMS`, `BACK`, plus `SIDE_*` side-view variants used while walking). Each letter is a palette key, and `LOOK[look]` maps letters to colours per outfit, so a new outfit is just a new `LOOK` entry (add it to `FEMALE` if it uses the bride body). Each chapter dresses the couple in its own outfit (`groomND`/`brideND`, `groomDN`/`brideDN`, … set in that chapter's `place` steps; `place` with `'guestPQ'` resolves to `guestMPQ`/`guestFPQ` by guest gender). Outfit flags in a `LOOK` (`stripe`, `jacket`, `scarf` for men; `skirt`, `pants`, `hat`, `nonla` for women; `shorts: 1` short / `shorts: 2` quần lửng for both) are applied by `dress()` in `sprites.js`. `trousers: 1` puts the bride body in pants instead of a skirt by reusing the male `LEGS` frames (`trouserRows`, same total height). Arms are drawn procedurally as limb chains onto the grid. The finished frame is outlined and cached in `SPR` by its key. Speakers gesture automatically and listeners turn to face them (`TURNABLE`, `GESTURES`). The style target is `tools/style-reference.png`: front-facing, square heads, thick outlines, flat shading.

**UI and output.** `ui.js` handles the DOM overlays (dialog, banner, menu, RSVP modal) on top of the canvas. `card.js` draws the invitation, and `gif.js` contains a self-written GIF encoder for saving the card.

## Customisation entry points

- Wedding details, guest-facing names, Hòa Bình friends (order matters: flipper, cameraman, "bomb" jumper, girl), and memory captions/photos live in `js/config.js`. Photos go in `assets/photos/`, ideally 4:3 at about 400×300.
- Dialogue and staging are in `js/chapters.js`.
- The page title and OG meta tags are in `index.html`.

`backup/` holds the original single-file version and pre-restyle sprite/actor files. It is reference only and not loaded by the site.
