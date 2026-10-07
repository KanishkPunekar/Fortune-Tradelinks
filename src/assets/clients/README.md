# Client logos

The logos here are made by `npm run photos` from the originals in `brand/clients/`. Each file is named after its client's `slug` in `clientsSection` (src/config/site.ts), and the Home page's "Our Clients" section picks it up by that name.

## To add or replace a logo

1. Put the original in `brand/clients/`, named after the client's slug, as PNG, JPG or WebP (for example `brand/clients/nayara-energy.png`). Don't put it straight into this folder.
2. Run `npm run photos`. It trims the empty margin around the logo, so every logo fills its slot similarly, and saves `<slug>.png` here.

Until a client has a logo, its card shows a "Logo" placeholder.

| Client | Slug (file name) |
|---|---|
| Reliance Industries Ltd. (Jio-bp) | `reliance-jio-bp` |
| Nayara Energy Ltd. | `nayara-energy` |
| Shell Marketing India Pvt. Ltd. | `shell` |
| Indian Oil Corporation Ltd. | `indian-oil` |
| Bharat Petroleum Corporation Ltd. | `bharat-petroleum` |
| Hindustan Petroleum Corporation Ltd. | `hindustan-petroleum` |

## Tips

- **Background:** use a logo on a transparent or white background. It's shown on a white plate, in both the light and dark theme.
- **Permission:** use each logo only as that company's brand guidelines allow, and only once it has agreed to be listed.
