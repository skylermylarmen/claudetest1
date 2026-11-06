# How to edit this site

Live: https://studio-pi-eight-18.vercel.app
Every change committed to `main` on GitHub goes live on Vercel automatically, usually within a minute.

## Where things come from

- **The design canvas** ("SK Studio Site V2" in Claude) is the master copy. All the tweak controls live there.
- **This repo** holds the canvas pages themselves, one file per page, running on the same engine as the canvas (`support.js`). So everything that moves on the canvas moves on the live site too: morphing arrows, Let's talk shapes, the pattern strip, the book viewer, the Process timeline.
- Tweak values are baked in from the canvas when you export.

When you change things on the canvas, ask Claude: *"re-export the site from the canvas and push it."* (Claude runs `tools/export.py`.)
Small text fixes can still be made directly in these files (below), but the next export from the canvas will overwrite them, so make lasting changes on the canvas.

## Page map

| Page | File |
|---|---|
| Home page (whichever you pick) | `index.html` |
| Home A, B and D (all three kept) | `home-a.html`, `home-b.html`, `home-d.html` |
| Process | `process.html` |
| Contact | `contact.html` |
| Resume | `resume.html` |
| Portfolios | `portfolios.html` |
| Fiamma pitch presentation (private, not indexed) | `fiamma/index.html` (images in `fiamma/ref/`) |
| Project pages | `work-reverra.html`, `work-mtrx.html`, `work-zlushy.html`, `work-amazingbotanicals.html`, `work-xomox.html`, `work-faceallies.html`, `work-highrollers.html`, `work-ironsky.html`, `work-farrahmoan.html`, `work-kronton.html` |

## Quick edits on github.com (no tools needed)

1. Open the repo on github.com and click the file (for example `index.html`).
2. Click the pencil icon (Edit).
3. Press Cmd+F in the editor to find the words you want to change, and type over them.
4. Click **Commit changes**. It's live in about a minute.

## Swapping an image

All images are in `img/v2/`. A new image you add on the canvas needs to be copied here too; Claude does that during an export. Each image has a long ID for a name, like `img/v2/7864755269e123054fd61c253f94c6bd.webp`.

- **Easiest:** on github.com, right-click the image on the live site and choose "Copy image address" to get its filename. Then upload your new image to `img/v2/` with **the exact same filename**, replacing the old one.
- Keep images as `.webp`, about 2000px wide or less, so the site stays fast. Photoshop, Squoosh.app, or Illustrator export can make webp files.

## Design controls (on the canvas)

- **Which home page is live:** on **Home D**, Tweaks › Live site › "Live site home page" (A, B or D). Then ask Claude to re-export and push.
- **Home switcher button:** the faint flashing button next to the logo on each home cycles A → B → D, so you can show clients all three.
- **Let's talk button:** tweak it on **Home D**. Every other page copies Home D's settings automatically.
- **Gallery image position:** on **Home A**, under "Preview images (sitewide)":
  - "<Project> crop" moves an image **up/down**.
  - "<Project> crop X" moves it **left/right**.
- **Process menu color:** orange `#F26A21`. Pink, teal, and indigo are taken by the other menu items. To change it, search the pages for `c-orange{color:#F26A21}`.

## Site-wide extras

- `site.css` has the page fade-in, reduced-motion support, and phone fixes.
- Loader: the sk logo and a four-color bar play whenever someone lands on the site from outside (a link, typed URL, new tab) or reloads, for at least 1 second and at most 3. It does not play when moving between SK pages or going back. Code is at the end of `site.js` (`MIN` and `MAX`) and `site.css`.
- Rip protection: right-click, dragging images, long-press saving, text copying and Cmd/Ctrl+S, U and P are blocked on every page and on Fiamma. Email and phone links and form fields can still be copied. Code is at the end of `site.js` and `site.css` (and inline in `fiamma/index.html`). It only stops casual saving; screenshots and browser dev tools still work.
- Page switch: a simple fade out and fade in between SK pages. Code is near the end of `site.js` (change `280` for speed) and `site.css`.
- `site.js` has the flickering Fiamma ember (bottom left, opens `/fiamma/`) and the 3D tilt on gallery cards (change `MAX_TILT` for more or less tilt).
- `vercel.json` points the canvas image links (`/_blob/...`) at the files in `img/v2/`.
- Share preview image: `og.png`. Browser tab icon: `favicon.png`.

## The old v1 page

It's in the git history (the commit before "Spread Eagle: V2 site live"), if you ever need it back.
