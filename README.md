# Agility Fetch API JSON Viewer

An [Agility CMS App](https://agilitycms.com/docs/apps) built on the [App SDK v2](https://www.npmjs.com/package/@agility/app-sdk). It adds **content item** and **page** sidebars that show the raw JSON returned by the Agility Content Fetch API for the item/page you're editing, with a **Live / Preview** toggle, refresh, and copy-to-clipboard.

This is the standalone app version of the "Fetch API" sidebar tab built into the Agility manager app.

## How it works

When opened in a sidebar, the app uses the App SDK (`useAgilityAppSDK`) to read the current `instance`, `locale`, and the item/page being edited. It then calls the Content Fetch API directly from the browser:

```
{baseUrl}/{fetch|preview}/{locale}/{item|page}/{id}?contentLinkDepth=1&expandAllContentLinks=false
```

passing the API key in the `APIKey` header.

**No app configuration is required.** Two pieces of information are supplied by the manager over the iframe / App SDK bridge:

- **API key** — requested at fetch time with the SDK's `getAPIKey({ apiType })` message. The manager resolves the key + secret and returns a ready-to-use key string. The Live tab uses the `fetch` key, Preview uses the `preview` key.
- **`instance.baseUrl`** — the regional Content Fetch API base url (including the guid), sent by the manager in the SDK context. If a manager build doesn't send it yet, the app falls back to deriving the region from the guid suffix (`lib/getApiBaseUrl.ts`).

> The API key relies on the manager handling the `getAPIKey` operation on the content item / page sidebar surfaces (added in `agility-cms-manager-app-react`). The base url is derived client-side from the instance guid, so no SDK or manager changes are needed for it.

## Capabilities

| Surface | Page | Fetch endpoint | Id used |
| --- | --- | --- | --- |
| `contentItemSidebar` | `pages/content-item-sidebar.tsx` | `/item/{contentID}` | `contentItem.contentID` |
| `pageSidebar` | `pages/page-sidebar.tsx` | `/page/{pageID}` | `pageItem.ItemContainerID` |

The page sidebar requests the page via the SDK `pageMethods.getPageItem()` message (the SDK context doesn't surface the page item directly).

## Running locally

```bash
npm install
npm run dev
```

The app definition is served at [`/.well-known/agility-app.json`](public/.well-known/agility-app.json).

To register the app in Agility, deploy it (e.g. to Vercel) and point your custom app at the deployed URL. See the [Agility Apps documentation](https://agilitycms.com/docs/apps) for the full installation flow.

## Project structure

- `pages/content-item-sidebar.tsx` — content item sidebar entry point
- `pages/page-sidebar.tsx` — page sidebar entry point
- `components/FetchJSON.tsx` — shared Fetch API JSON viewer (Live/Preview tabs, refresh, copy, syntax highlighting); requests the API key via the SDK
- `components/Loader.tsx` — loading spinner
- `lib/getInstanceBaseUrl.ts` — resolves the base url (`instance.baseUrl`, else guid-derived)
- `lib/getApiBaseUrl.ts` — derives the regional Fetch API base url from the guid (fallback)
- `public/.well-known/agility-app.json` — the Agility app definition / manifest
