# Personal website

Personal portfolio site built with Next.js. Project content and my introduction are pulled from Notion, so I can use Notion as a CMS; content updates via a Notion webhook trigger cache invalidation. Supports English and Vietnamese (i18n).

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- React 19, TypeScript
- Tailwind CSS 4
- [next-intl](https://next-intl.dev) for i18n
- [Notion API](https://developers.notion.com) + [react-notion-x](https://github.com/NotionX/react-notion-x) for content
- pnpm, ESLint, Prettier, Husky + lint-staged, commitlint

## Getting Started

Install dependencies:

```bash
pnpm install
```

Copy `env.example` to `.env.local` and fill in the values:

```bash
cp env.example .env.local
```

| Variable                                                  | Description                                  |
| --------------------------------------------------------- | -------------------------------------------- |
| `NOTION_TOKEN`                                            | Notion integration token                     |
| `NOTION_DATABASE_ID`                                      | Notion database ID for blog/project content  |
| `NOTION_DATASOURCE_ID`                                    | Notion data source ID                        |
| `NOTION_WEBHOOK_SECRET`                                   | Secret for verifying Notion webhook requests |
| `ABOUT_PAGE_ID`                                           | Notion page ID for the About page content    |
| `FACEBOOK_URL`, `GITHUB_URL`, `EMAIL_URL`, `LINKEDIN_URL` | Social links shown in the footer             |
| `SITE_URL`                                                | Public base URL of the deployed site         |

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `pnpm dev`        | Start dev server (Turbopack)   |
| `pnpm build`      | Production build (Turbopack)   |
| `pnpm start`      | Start production server        |
| `pnpm lint`       | Run ESLint                     |
| `pnpm format`     | Check formatting with Prettier |
| `pnpm format:fix` | Auto-fix formatting            |

## Project Structure

```
src/
  app/
    [locale]/        # localized routes: home, about, blog, articles, projects
    api/              # route handlers (e.g. notion-webhook)
  features/           # feature modules (notion, projects, theme)
  components/         # shared and ui components
  i18n/               # next-intl config
  lib/, hooks/, interfaces/, styles/, assets/
messages/             # en.json, vi.json translation files
```
