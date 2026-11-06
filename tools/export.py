"""Re-export the live site from the "SK Studio Site V2" canvas files.

Usage: python3 tools/export.py <folder with the canvas .dc.html files> <dc-runtime.js>
Each canvas page ships with its real runtime (support.js), so tweaks,
animations, the project switcher and the book viewer all work live.
The "Live site home page" tweak on Home D picks which home becomes index.html.
"""
import re, sys, json, html, os, shutil

SRC, RUNTIME = sys.argv[1], sys.argv[2]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SITE = 'https://studio-pi-eight-18.vercel.app/'
HOMES = {'Home A — Splash': 'Main', 'Home B — Index': 'Home-Index', 'Home D — Split': 'Home-Split'}
PAGES = {'Main': 'home-a', 'Home-Index': 'home-b', 'Home-Split': 'home-d', 'Process': 'process',
         'Contact': 'contact', 'Resume': 'resume', 'Portfolios': 'portfolios'}
for f in os.listdir(SRC):
    if f.startswith('Work-') and f.endswith('.dc.html'):
        PAGES[f[:-8]] = 'work-' + f[5:-8].lower()
TITLES = {'process': 'Process', 'contact': 'Contact', 'resume': 'Resume', 'portfolios': 'Portfolios'}

def props(t):
    m = re.search(r"data-props=(\"([^\"]*)\"|'([^']*)')", t)
    return json.loads(html.unescape(m.group(2) if m.group(2) is not None else m.group(3)))

home_choice = props(open(os.path.join(SRC, 'Home-Split.dc.html')).read()).get('Live site home page', {}).get('default', 'Home D — Split')
HOME = HOMES.get(home_choice, 'Home-Split')

def head(slug, title):
    url = SITE if slug == 'index' else SITE + slug + '.html'
    desc = 'Skyler Kapel — graphic & brand design, industrial / product design, and product visualization.'
    return ('<meta name="viewport" content="width=device-width, initial-scale=1">\n'
            f'<meta name="description" content="{desc}">\n'
            '<link rel="icon" type="image/png" href="favicon.png">\n<link rel="apple-touch-icon" href="apple-touch-icon.png">\n'
            f'<meta property="og:type" content="website">\n<meta property="og:title" content="{title}">\n'
            f'<meta property="og:description" content="{desc}">\n<meta property="og:url" content="{url}">\n'
            f'<meta property="og:image" content="{SITE}og.png">\n<meta name="twitter:card" content="summary_large_image">\n'
            '<link rel="stylesheet" href="site.css">\n'
            + '<script>try{var d=document.documentElement,w=sessionStorage.getItem("skWash");if(w){sessionStorage.removeItem("skWash");d.classList.add("sk-arrive");d.style.setProperty("--sk-wash",w)}else if(!sessionStorage.getItem("skSeen")){d.classList.add("sk-load")}sessionStorage.setItem("skSeen","1")}catch(e){}</script>\n'
            + '<script src="site.js" defer></script>\n')

def convert(name, slug):
    t = open(os.path.join(SRC, name + '.dc.html')).read()
    # data fetched by pages (sitewide previews, Let's talk sync) must hit the real page files
    t = re.sub(r"fetch\('([A-Za-z0-9-]+)\.dc\.html'\)", lambda m: "fetch('" + PAGES.get(m.group(1), m.group(1)) + ".html')", t)
    def link(m):
        n, hash_ = m.group(1), m.group(2) or ''
        return 'href="' + ('index.html' if n in HOMES.values() else PAGES.get(n, n) + '.html') + hash_ + '"'
    # the home switcher button goes to the next home's own page, not the front page
    t = re.sub(r'class="hsw" href="([A-Za-z0-9-]+)\.dc\.html"', lambda m: 'class="hsw" href="' + PAGES[m.group(1)] + '.html"', t)
    t = re.sub(r'href="([A-Za-z0-9-]+)\.dc\.html(#[^"]*)?"', link, t)
    t = t.replace('<script src="./support.js"></script>', '<script src="support.js"></script>')
    title = 'Skyler Kapel — Design' if slug in ('index', 'home-a', 'home-b', 'home-d') else TITLES.get(slug, re.search(r'<title>([^<]*)</title>', t).group(1)) + ' — Skyler Kapel'
    t = re.sub(r'<title>[^<]*</title>', '<title>' + html.escape(title) + '</title>', t, count=1)
    t = t.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n' + head(slug, title), 1)
    return t

for name, slug in PAGES.items():
    open(os.path.join(OUT, slug + '.html'), 'w').write(convert(name, slug))
open(os.path.join(OUT, 'index.html'), 'w').write(convert(HOME, 'index'))
shutil.copy(RUNTIME, os.path.join(OUT, 'support.js'))
print('home page:', home_choice, '| pages:', len(PAGES) + 1)
