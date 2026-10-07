# Fortune Tradelinks website

Company website for fortunetradelinks.in. React 19 + TypeScript + Vite, with every page prerendered to static HTML at build time, so each page's content is readable with JavaScript turned off. JavaScript only adds the mobile menu and the quote form behaviour.

`PROJECT_BRIEF.md` is the source of truth for structure, copy and content rules.

## Commands

```sh
npm install        # once
npm run dev        # local dev server with hot reload (http://localhost:5173)
npm run build      # type-check, build, prerender → dist/
npm run preview    # serve dist/ locally to check the production build
```

## Where things live

| What | File |
|---|---|
| Contact details, placeholders, optional content switches | `src/config/site.ts` |
| Page list, SEO titles and descriptions, navigation | `src/config/pages.ts` |
| Design tokens (colours, fonts, spacing) | `src/styles/global.css` |
| Shared components | `src/components/` |
| Pages | `src/pages/` |
| Prerender, sitemap.xml, robots.txt | `scripts/prerender.mjs` |
| Quote form server function (emails each quote) | `api/quote.ts` |
| Quote fields and validation rules (shared by form and server) | `src/lib/quote.ts` |
| Vercel settings | `vercel.json` |
| Environment variables template | `.env.example` |
| Logo artwork (source) | `brand/logo-source.jpg` (previous logo kept in `brand/archive/`) |
| Logo, favicons and share image (generated) | `public/images/`, `public/favicon*`, `public/apple-touch-icon.png` |
| Brand asset generator | `scripts/make-brand-assets.mjs` (`npm run brand`) |

### Placeholders

Any value in `src/config/site.ts` written in `[SQUARE BRACKETS]` is a placeholder. It shows on the site as highlighted plain text so it's easy to spot in review, and it's never turned into a phone or map link. Replace it with the real value and every page updates.

Optional content that is off until the owner confirms it:

- `optionalContent.typicalQuantities`: the "Typical Requirements We Handle" block on Ethanol Supply.
- `optionalContent.productSpecification`: the specification table on Products. Rows appear as values are filled in.
- `site.gstin`: shows a GSTIN line in the footer and on Compliance when set.
- `site.showMap`: a click-to-load map on Contact, once a real address is set.

## Logo and photos

The logo is cut out of `brand/logo-source.jpg` (the supplied artwork on a white background) onto a transparent background. `npm run brand` makes every logo file from it:

- `logo.png`: the leaf mark + "fortune tradelinks", used in the header and footer.
- `logo-dark.png`: the same with the black wordmark in white, for the dark theme.
- `logo-mark.png`: the leaf mark alone. Phones narrower than 420px show this in the header, because the full logo doesn't fit beside "Request a Quote" and Menu.
- The favicons, the iPhone icon, and the share image `og-default.png` (the full logo, tagline included).

The script finds the mark, wordmark and tagline in the artwork automatically. If the logo changes:

1. Replace `brand/logo-source.jpg`, keeping a white background.
2. Run `npm run brand`.
3. Copy the sizes it prints into `logo` in `src/config/site.ts`.

A vector (SVG) version of the logo would be sharper still, if one exists.

Photos are set in `images` in `src/config/site.ts`: the Home hero, Products and Logistics. All three are in place.

The original files are kept in `brand/photos/`, outside `public/`, so the full-size versions are never published. `npm run photos` crops each one to its slot and saves compressed WebP files in `public/images/`, plus a 640px version for phones. To replace a photo:

1. Put the new file in `brand/photos/` with the same name: `storage-tanks.png`, `liquid-sample.png` or `road-tanker.png`.
2. Run `npm run photos`.
3. Update the `alt` text in `src/config/site.ts` if the photo shows something different.

To add a new photo slot, add it to `PHOTOS` in `scripts/optimize-photos.mjs`.

An empty `src` shows a clearly marked placeholder instead. On phones, placeholders are hidden so they don't push the text down; real photos show below the text. Use neutral industrial imagery only, with no third-party branding.

### Photo checklist

| Slot | What to show | Shape and minimum size | Search terms |
|---|---|---|---|
| Home hero (`images.homeHero`) | A row of large white or steel storage tanks at a bulk liquid / fuel terminal, in daylight. Clean, calm and wide. | Square or 4:5 upright, at least 1400 × 1400 px. Cropped to fill: roughly square on desktop, tall at 1024px, 16:10 on phones. Keep the tanks in the centre. | storage tank farm, bulk liquid terminal, fuel storage tanks, industrial tanks daylight |
| Products (`images.products`) | Close-up of a clear, colourless liquid sample in a glass laboratory bottle or flask, on a clean light background. | Landscape 4:3, at least 1200 × 900 px. Shown on screens 1024px and wider. | clear liquid sample bottle, laboratory flask clear liquid, fuel sample testing, chemical sample bottle |
| Logistics (`images.logistics`) | A road tanker truck with a plain, unbranded tank, on a highway or at a loading point, side or three-quarter view, in daylight. | Landscape 3:2, at least 1200 × 800 px. Shown on screens 1024px and wider. | tanker truck highway, fuel tanker truck side view, road tanker loading gantry, tank truck depot |

For every photo:

- **Avoid:** company names or logos (on tanks, trucks, uniforms or signs), readable number plates, recognisable plants or depots that could look like they're yours, flames or spills, and text in the image.
- **Licence:** only use photos you're allowed to use commercially. Free options are Unsplash, Pexels and Pixabay; paid options are Shutterstock, Adobe Stock and iStock. Don't copy photos from Google Images.
- **File:** any size at or above the minimum, PNG or JPG. Save it in `brand/photos/` and run `npm run photos`, which does the cropping and compression.

## Light and dark theme

The sun/moon button in the header switches between the light and dark themes. It sits after Contact on desktop and beside Menu on tablets; on small phones it is inside the menu.

- **Default:** light, for every visitor, whatever their system setting. If a visitor switches to dark, the choice is remembered in their browser (`localStorage` key `ft-theme`).
- **No flash:** a small script in `index.html` applies the theme before the page appears.
- **Without JavaScript:** the site stays light and the button is hidden.
- **Colours:** both sets are in `src/styles/global.css`, the light tokens under `:root` and the dark ones under `:root[data-theme='dark']`. The logo has a dark-theme version, `public/images/logo-dark.png`, with the black wordmark in white; `npm run brand` makes it.

## Build output

`npm run build` writes plain static files to `dist/`: one HTML file per page (`index.html`, `about-us.html`, …), `404.html`, `sitemap.xml`, `robots.txt` and hashed assets. Any static host can serve them if it maps `/about-us` to `about-us.html` and serves `404.html` for unknown paths. Most static hosts do both by default.

## Request a Quote form

The form posts to `/api/quote`: a Vercel Function in `api/quote.ts`, deployed with the site. It checks every field again with the same rules as the browser (`src/lib/quote.ts`), drops spam that fills the hidden trap field, and emails the quote to the sales team through [Resend](https://resend.com). Reply-To is set to the buyer, so the sales team can simply reply. Visitors without JavaScript get a plain confirmation page.

If an email can't be sent (missing key, Resend refuses it, network error), the visitor sees the error message with the sales email, and the full quote is written to the function's log (Vercel → Project → Logs), so it isn't lost.

### Going live on Vercel

The full step-by-step guide is in [`docs/deploy-on-vercel.md`](docs/deploy-on-vercel.md). It covers how the form works, a form-service alternative, hosting, and connecting the domain. In short:

1. **Mailbox.** Make sure `sales@fortunetradelinks.in` exists and receives email.
2. **Resend.** Create a free account at resend.com:
   - Under Domains, add `fortunetradelinks.in` and add the DNS records it shows at your domain registrar. These are the SPF and DKIM records that stop the emails landing in spam.
   - Wait until the domain shows as Verified.
   - Under API Keys, create a key.
3. **Vercel.** Push this folder to a GitHub repository, then in Vercel choose Add New → Project and import it. `vercel.json` already sets the build command, output folder and clean URLs.
4. **Environment variables.** In Vercel → Project → Settings → Environment Variables, add:
   - `RESEND_API_KEY`: the key from step 2.
   - `QUOTE_FROM`: the sender, on the verified domain, e.g. `Fortune Tradelinks Website <website@fortunetradelinks.in>`.
   - `QUOTE_TO` (optional): recipients, comma-separated. The default is `sales@fortunetradelinks.in`.

   Then redeploy.
5. **Test.** Submit a real enquiry on the live site and check that it arrives (look in spam too). Reply to it to confirm the reply goes to the buyer.

To try it before the domain is verified, set `QUOTE_FROM=onboarding@resend.dev` and `QUOTE_TO` to the email address of your Resend account; Resend only delivers test emails to that address.

### Locally

`npm run dev` runs `/api/quote` too. Without a key, each quote is printed in the terminal instead of emailed. To send real emails locally, copy `.env.example` to `.env.local` (git ignores it) and fill in the values. `npm run preview` serves the built pages only, so the form shows its error message there.

### Spam

The hidden trap field catches simple bots. If spam starts getting through, add Cloudflare Turnstile (free) to the form and check its token in `api/quote.ts`.

## Owner review before launch

The full checklist is in `PROJECT_BRIEF.md` Section 13. Beyond the placeholders above, these need a decision.

**Proposed copy (text not in the original plan):**

- The **[PROPOSED COPY]** items from the brief: page titles and meta descriptions, the 404 page, the form's error, success and privacy lines.
- **Form:**
  - Remaining field error messages ("Enter the contact person's name.", "Enter a valid email address.", "Enter the delivery location.", "Choose today or a later date.", "Select whether transportation is required.", "Select whether this is a recurring requirement.", "Enter the expected delivery frequency.", "Select a product.").
  - " (optional)" after the three optional labels.
  - Frequency hint "e.g. Weekly, 2 loads per month".
  - The no-JavaScript confirmation page's title ("Requirement submitted" / "Requirement not sent") and link "Back to Request a Quote".
  - The quote email to the sales team: subject "Quote request: {quantity} KL – {company}", the "New quote request from the website…" line, and "Reply to this email to answer…".
- **Header and accessibility:** "Menu" on the mobile menu button, "Skip to content", and the "Main" navigation label.
- **Contact map:** "Show map" and the map title. These appear only if `showMap` is turned on.
- **Products:** caption "Anhydrous Denatured Ethanol specification". It appears only once specification data is filled in.
- **Theme button:** the name "Dark theme" (the label in the mobile menu, and announced by screen readers) and the tooltips "Switch to dark theme" / "Switch to light theme".
- **Photo alt text** (read out by screen readers): "Large white storage tanks at a bulk liquid terminal", "Clear, colourless liquid sample in a glass laboratory flask" and "Road tanker truck on a highway".
- **Breadcrumbs and share image:** the "Breadcrumb" navigation label, the short page names used in it (e.g. "About Us"), and the share-image alt text "Fortune Tradelinks logo".

**Decisions:**

- "Required Delivery Date (optional)" reads awkwardly. Keep it, or rename the field?
- The design follows the two reference sites and uses the logo's colours. This replaces the amber accent suggested in the brief (Section 5):
  - Headings are navy. This came from the previous logo; the new logo is green and black. Keep the navy, or switch headings and the call-to-action panel to the logo's black?
  - Enquiry buttons (Request a Quote, Enquire Now, Submit Requirement) are filled green pills.
  - Other buttons (Contact Us, Email Us, Go to Home) are white pills with a green outline.
  - Inner pages open with a breadcrumb and a rounded green title panel.
- The logo's tagline ("ETHANOL • BIOFUEL • LOGISTICS") appears only on the link-preview image; in the header and footer it would be too small to read. "Biofuel" suggests products beyond ethanol, while the brief (Section 4) lists Anhydrous Denatured Ethanol as the only product. Confirm the tagline is accurate, or leave it off the preview image too.
- Quotes are emailed through Resend, a third-party email service. The Privacy Policy's "Third-Party Services" section already covers email services.
- `public/images/og-default.png` (the link-preview image) is the full logo on white.
- Organization structured data now includes the logo alongside name, URL and email. The brief listed name, URL and email only, to avoid placeholders; the logo is real.
- Industries is linked only from the footer's "More" column.

**Hosting notes:** the site is set up for Vercel (`vercel.json`). It serves `/about-us` from `about-us.html`, uses `404.html` for unknown pages, compresses files, and caches `/assets/*` for a year (the file names are hashed). On another host, set up the same things.
- If you add a Content-Security-Policy, the small inline script in the page head needs a hash.
