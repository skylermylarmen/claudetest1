# How to edit this site

Live: https://studio-pi-eight-18.vercel.app
Every change committed to `main` on GitHub goes live on Vercel automatically, usually within a minute.

## Where things come from

- **The design canvas** ("SK Studio Site V2" in Claude) is the master copy. All the tweak controls live there.
- **This repo** holds a plain-HTML copy of the canvas, one file per page. It has no build step and needs no tools to edit.

When you make big changes on the canvas, ask Claude: *"re-export the site from the canvas and push it."*
For small fixes, edit the files here directly (below).

## Page map

| Page | File |
|---|---|
| Home (option D, split layout) | `index.html` |
| Process | `process.html` |
| Contact | `contact.html` |
| Resume | `resume.html` |
| Portfolios | `portfolios.html` |
| Project pages | `work-reverra.html`, `work-mtrx.html`, `work-zlushy.html`, `work-amazingbotanicals.html`, `work-xomox.html`, `work-faceallies.html`, `work-highrollers.html`, `work-ironsky.html`, `work-farrahmoan.html`, `work-kronton.html` |

## Quick edits on github.com (no tools needed)

1. Open the repo on github.com and click the file (for example `index.html`).
2. Click the pencil icon (Edit).
3. Press Cmd+F in the editor to find the words you want to change, and type over them.
4. Click **Commit changes**. It's live in about a minute.

## Swapping an image

All images are in `img/v2/`. Each image has a long ID for a name, like `img/v2/7864755269e123054fd61c253f94c6bd.webp`.

- **Easiest:** on github.com, right-click the image on the live site and choose "Copy image address" to get its filename. Then upload your new image to `img/v2/` with **the exact same filename**, replacing the old one.
- Keep images as `.webp`, about 2000px wide or less, so the site stays fast. Photoshop, Squoosh.app, or Illustrator export can make webp files.

## Design controls (on the canvas)

- **Let's talk button:** tweak it on **Home D**. Every other page copies Home D's settings automatically.
- **Gallery image position:** on **Home A**, under "Preview images (sitewide)":
  - "<Project> crop" moves an image **up/down**.
  - "<Project> crop X" moves it **left/right**.
- **Process menu color:** orange `#F26A21`. Pink, teal, and indigo are taken by the other menu items. To change it, search the pages for `c-orange{color:#F26A21}`.

## Site-wide extras

- `site.css` has the page fade-in, reduced-motion support, and phone fixes.
- `site.js` has:
  - the scroll reveal on the Process page
  - the "Click to switch project" menu
  - the 3D tilt on gallery cards (change `MAX_TILT` for more or less tilt)
- Share preview image: `og.png`. Browser tab icon: `favicon.png`.

## Things that are simpler on the live site than on the canvas

- The Let's talk button spins, but doesn't morph between shapes.
- The checker/grid pattern strip doesn't scroll.

Both work on the canvas. Ask Claude if you want them live too.

## The old v1 page

It's in the git history (the commit before "Spread Eagle: V2 site live"), if you ever need it back.
