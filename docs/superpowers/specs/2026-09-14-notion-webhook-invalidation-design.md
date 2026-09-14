# Notion Webhook Invalidation Design

## Context

Site currently uses time-based ISR: every page exports `revalidate = 60`, and Notion fetchers (`getNotionPage`, `getAllProjects`) are wrapped in `unstable_cache` with the same 60s window (`NOTION_CACHE_REVALIDATE_TIME`, [src/lib/constant.ts:4](../../../src/lib/constant.ts)). Content is refetched from Notion at most once a minute regardless of whether anything changed.

Goal: make all Notion-backed pages pure SSG (cached indefinitely, no time-based refetch) and instead invalidate on demand, driven by Notion's own webhook, the moment content actually changes in Notion.

## Decisions

1. **Trigger**: Notion API webhook (native, beta). Notion sends a one-time `{ verification_token }` POST when a webhook subscription is created; that token must be confirmed in the Notion integration UI within 1 hour, then reused as the HMAC signing secret for every subsequent event (header `X-Notion-Signature: sha256=<hmac>`).
2. **Granularity**: revalidate everything on any event — call `revalidatePath('/', 'layout')`. No per-page tagging. Simpler code; acceptable because Notion edits are infrequent and re-render cost is low.
3. **Time-based ISR removed entirely**: drop `NOTION_CACHE_REVALIDATE_TIME`, all `export const revalidate = 60` page exports, and the `revalidate` option on both `unstable_cache` calls. Omitting `revalidate` on `unstable_cache` caches the result indefinitely until an explicit `revalidatePath`/`revalidateTag` call — which is exactly the desired behavior.
4. **Secret storage**: `NOTION_WEBHOOK_SECRET` env var, read inline via `process.env.NOTION_WEBHOOK_SECRET`, matching the existing convention (`NOTION_TOKEN`, `ABOUT_PAGE_ID`, `NOTION_DATASOURCE_ID` — no central env schema in this repo).
5. **No persistence layer added**: the verification token is a one-time manual copy-paste (from server logs into the Notion UI, then into `.env.local`/hosting env config) — not stored anywhere in code or DB.

## Components

### New: `src/app/api/notion-webhook/route.ts`

POST-only route handler.

- If body is `{ verification_token: string }` (subscription handshake, no signature header present): log the token, return 200. One-time step; not signature-verified since Notion hasn't started signing yet at that point.
- Else (real event): read raw body text, verify `X-Notion-Signature` header against `NOTION_WEBHOOK_SECRET` using HMAC-SHA256 (`crypto.createHmac('sha256', secret).update(rawBody).digest('hex')`, compared with `crypto.timingSafeEqual`). Reject with 401 on mismatch or missing secret/header. On match, call `revalidatePath('/', 'layout')` and return 200.

### Modified: `src/services/notion/page.ts`, `src/services/notion/project.ts`

Remove `NOTION_CACHE_REVALIDATE_TIME` import and the `revalidate` option object passed to `unstable_cache` (third argument becomes `{}` or is dropped if `unstable_cache` allows omitting it — check signature, pass `{}` if a third arg is still required by the type).

### Modified: `src/lib/constant.ts`

Remove `NOTION_CACHE_REVALIDATE_TIME` export (dead after the above).

### Modified: page files with `export const revalidate = 60`

Remove that export and its preceding comment from:

- [src/app/[locale]/layout.tsx](../../../src/app/[locale]/layout.tsx)
- [src/app/[locale]/about/page.tsx](../../../src/app/[locale]/about/page.tsx)
- [src/app/[locale]/blog/page.tsx](../../../src/app/[locale]/blog/page.tsx)
- [src/app/[locale]/projects/page.tsx](../../../src/app/[locale]/projects/page.tsx)
- [src/app/[locale]/articles/[blockId]/page.tsx](../../../src/app/[locale]/articles/[blockId]/page.tsx)

`generateStaticParams` in `layout.tsx` (locales) and `articles/[blockId]/page.tsx` (blockIds via `getAllProjects()`) stay untouched — they still drive build-time SSG.

## Error Handling

- Missing/invalid signature → 401, no revalidation, no crash.
- Missing `NOTION_WEBHOOK_SECRET` env var → treat as misconfiguration, return 500, log a clear error (fail closed, never skip verification silently).
- Malformed JSON body → 400.

## Out of Scope

- Per-page/tag-based invalidation (rejected — "revalidate everything" chosen for simplicity).
- Any UI for managing the webhook subscription.
- `.env.example` file (repo has none today; not adding one here).
- Changes to the unrelated `next/root-params` locale work already on disk in `layout.tsx`/`i18n/request.ts` — not touched by this plan.

## Verification

- `pnpm exec tsc --noEmit` and `pnpm lint` clean.
- `pnpm build` — About/Blog/Projects/Articles/locale routes still show as static (`●`) in the route table; no `revalidate` column entries.
- Local webhook test: `curl -X POST localhost:3000/api/notion-webhook -H "Content-Type: application/json" -d '{"verification_token":"test"}'` → 200, token logged.
- Signed-event test: compute HMAC with a test secret, send matching request → 200; send with wrong signature → 401.
