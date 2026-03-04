# LearnKeys

> Type the news. Learn while you type.

A Monkeytype-inspired typing practice app where you type real AI news headlines and current affairs — not random words. Built with Next.js, no login, no database.

[![GitHub stars](https://img.shields.io/github/stars/namanbarkiya/LearnKeys?style=flat&color=yellow)](https://github.com/namanbarkiya/LearnKeys)

---

## What it does

- Pick a category: **AI News** or **Current Affairs**
- Type through live article excerpts fetched from NewsAPI / GNews
- See WPM and accuracy update in real time
- Share your result via URL — no account needed
- `Tab` skips to the next article · `Esc` resets · Space advances to next word

---

## Quick start

```bash
npm install
cp env-example.env .env.local
# Add at least one API key (see below)
npm run dev
```

Open `http://localhost:3000` — you land directly on the typing screen.

---

## API keys

LearnKeys needs at least one news API key to load real articles. Without keys it shows a fallback article.

| Variable | Where to get it | Free tier |
|---|---|---|
| `NEWSAPI_KEY` | [newsapi.org/register](https://newsapi.org/register) | 100 req/day (localhost only) |
| `GNEWS_KEY` | [gnews.io/register](https://gnews.io/register) | 100 req/day |

Add to `.env.local`:
```env
NEWSAPI_KEY=your_key_here
GNEWS_KEY=your_key_here
```

> **Note**: NewsAPI free tier only works from `localhost`. For production use GNews or a paid NewsAPI plan.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Fonts | Geist Mono |
| News sources | NewsAPI.org + GNews.io |
| Sharing | URL search params (`?wpm=94&acc=97&cat=ai-news`) |
| Analytics | Vercel Analytics |

**No database. No auth. No server-side persistence.**

---

## Folder structure

```
app/
  page.tsx                    ← Home (typing screen, reads ?cat= param)
  result/page.tsx             ← Result screen (shareable URL)
  api/news/route.ts           ← Server route — fetches & sanitises news

components/
  Header.tsx                  ← Logo + category dropdown + GitHub stars
  Footer.tsx                  ← Tagline footer
  PlayClient.tsx              ← Article cycling + prefetch logic
  TypingArea.tsx              ← 3-line windowed typing viewport
  CharDisplay.tsx             ← Per-character correct/incorrect/pending
  StatsBar.tsx                ← Live WPM + accuracy overlay
  ResultCard.tsx              ← End screen — WPM, accuracy, share button

hooks/
  useTypingEngine.ts          ← Game loop — char states, timer, WPM, accuracy

lib/
  news.ts                     ← fetchArticles(), normaliseToTypingText()
  categories.ts               ← Category config — slug, label, API params
  typing.ts                   ← calcWPM(), calcAccuracy(), CharState type
```

---

## How the typing engine works

- Global `keydown` listener on `document` — no `<input>` element
- Timer starts on first keypress
- Each character is `pending → correct | incorrect`
- Backspace reverts the last character to `pending`
- Pressing **space** mid-word skips remaining chars (marks incorrect) and jumps to the next word
- WPM recalculated every 300ms via `setInterval`
- On completion: navigates to `/result?wpm=&acc=&cat=&title=`

---

## NPM scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run test` | Run Vitest unit tests |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |

---

## Contributing

PRs welcome. Open an issue first for large changes.

```bash
git clone https://github.com/namanbarkiya/LearnKeys
cd LearnKeys
npm install
cp env-example.env .env.local
npm run dev
```

---

Built by [Naman Barkiya](https://github.com/namanbarkiya)
