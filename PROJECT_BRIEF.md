# Fortune Tradelinks — Website Build Brief

This file is the single source of truth for building the Fortune Tradelinks company website (fortunetradelinks.in). Read the whole file before writing any code. Anything not yet decided is marked **[TO CONFIRM]**.

---

## 0. Instructions for Claude Code

1. Treat this document as the source of truth for site structure, page copy and content rules. Use the page copy in Section 9 **verbatim**. Do not rewrite it, "improve" it, or add marketing claims.
2. Never invent facts. No customer names, logos, testimonials, certifications, licences, statistics, coverage areas, capacities or prices. If a section seems to need one, leave a visible placeholder and mention it in your summary.
3. All contact details and placeholders come from one central site config (Section 7) so the owner can replace them in one place.
4. If the owner hasn't confirmed the tech stack (Section 3), ask once before scaffolding, then proceed.
5. Hosting, deployment, domain/DNS and email setup are **out of scope**. Don't add deployment config, CI pipelines or third-party services unless asked.
6. Conventions used in this file:
   - Text under a page in Section 9 is final website copy.
   - Lines starting with `> Dev note:` are instructions for you. Never render them on the site.
   - `**H1:**`, `**H2:**`, `**H3:**` mark the heading level for the text that follows.
   - Buttons are written as `[Button: Label → /target]`.
   - Anything marked **[PROPOSED COPY]** is new text not in the original plan; use it, but list it in your summary so the owner can approve it.
7. When a page is done, check it against the Definition of Done (Section 12).

---

## 1. Project overview

| Item | Detail |
|---|---|
| Business | Fortune Tradelinks |
| What it does | B2B sourcing, trading and supply of bulk ethanol, coordinating commercial terms, tanker transportation, loading, delivery and documentation |
| Primary product | Anhydrous Denatured Ethanol |
| Domain | fortunetradelinks.in — canonical host `https://www.fortunetradelinks.in` **[TO CONFIRM www vs non-www]** |
| Audience | Procurement managers and commercial buyers at large corporate and industrial buyers: energy and fuel companies, oil marketing companies, distilleries, manufacturers and other bulk industrial consumers |
| Market | India (GST, e-way bills, quantities in KL) |
| Primary conversion | Request a Quote form submission |
| Secondary conversions | Email to sales@fortunetradelinks.in, phone call |

**The 30-second test (core objective):** A procurement manager receives an email from Fortune Tradelinks → visits fortunetradelinks.in → understands the business within 30 seconds → sees that Fortune Tradelinks handles bulk ethanol → submits an enquiry. Every layout and design decision should serve this path.

---

## 2. Scope

**In scope (this phase)**
- 12 pages (Section 6) with a shared header and footer.
- Responsive, accessible build.
- Request a Quote form UI with validation and success/error states (Section 10).
- Basic on-page SEO: titles, meta descriptions, Open Graph tags, `sitemap.xml`, `robots.txt` (Section 11).
- One central site config for contact details and placeholders (Section 7).

**Out of scope (for now)**
- Hosting, deployment, domain/DNS, SSL.
- Setting up the email mailboxes (info@, sales@ etc.). The site only links to them.
- Form submission backend / email delivery. Build a single integration point only (Section 10).
- CMS, database, user accounts, analytics setup.
- Future pages and assets listed in Section 14.

---

## 3. Tech stack [TO CONFIRM]

The owner hasn't chosen a stack yet. If it hasn't been confirmed, recommend the default below and ask before scaffolding.

- **Recommended default: Astro, static output.** Twelve mostly static pages sharing one layout, header and footer; ships no JavaScript by default; legal pages can be written in Markdown.
- **Alternative (no build step):** plain HTML5 + CSS + one small vanilla JS file for the mobile menu and form validation.

Constraints either way:
- No heavy UI framework. Plain CSS with custom properties is preferred (Tailwind is acceptable only if the owner asks for it).
- Minimal JavaScript. All page content must be readable with JavaScript disabled; JS only enhances the menu and form.
- No external runtime dependencies that require a server.

Suggested structure (Astro):

```
src/
  config/site.ts                 # all contact details and placeholders (Section 7)
  layouts/BaseLayout.astro       # <head>, SEO tags, header, footer
  components/
    Header.astro
    Footer.astro
    CtaBand.astro                # reusable end-of-page call to action
    FlowDiagram.astro            # signature step-flow visual (Section 5)
    ProcessSteps.astro           # numbered sequential steps
    QuoteForm.astro
  pages/
    index.astro
    about-us.astro
    products.astro
    ethanol-supply.astro
    industries.astro
    logistics.astro
    quality-documentation.astro
    compliance.astro
    request-a-quote.astro
    contact.astro
    privacy-policy.md
    terms.md
    404.astro
public/
  images/                        # placeholder imagery until the owner supplies real images
  favicon.svg
```

---

## 4. Content rules (non-negotiable)

These protect the business's credibility with corporate buyers.

1. **No exaggerated or unverifiable claims** — e.g. "India's No. 1 ethanol supplier", "largest", "leading", "trusted by top companies".
2. **No geographic coverage claims** such as "across India" or "pan-India" unless the owner confirms them.
3. **No published prices.** Ethanol pricing changes with source, location, taxes, freight and market conditions. Always direct buyers to request a quote.
4. **Only list products the business is genuinely able and authorised to supply.** Currently that is Anhydrous Denatured Ethanol only.
5. **No certificates, licences, permits or approvals** unless the owner supplies genuine, current documents.
6. **No customer names, logos, case studies or testimonials** unless the owner provides them with permission. Never name target buyers or specific companies anywhere on the site.
7. **Specific quantities** (e.g. 20 / 40 / 80 / 160 KL) appear only if the owner confirms they can realistically be arranged (see the optional block on the Ethanol Supply page).
8. **No bank details on the website.** Displaying the GSTIN is optional and controlled by the site config.
9. **No imagery that implies assets or partners the business doesn't have** — branded tankers, other companies' logos, or plants presented as "ours". Use neutral industrial imagery or clearly marked placeholders.
10. **Tone:** factual, calm, professional B2B. Plain verbs, no hype.

---

## 5. Design direction

**Fixed by the owner's plan (follow exactly):** a clean corporate design, not flashy or overly decorative. White background, dark navy/charcoal text, professional industrial/ethanol imagery, clear specifications and strong enquiry buttons.

**Suggested tokens (starting point — refine if needed, but keep the fixed direction):**

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-surface` | `#F2F5F8` | Alternating section bands, form background |
| `--color-ink` | `#0F2A44` | Headings, header, secondary buttons (navy) |
| `--color-text` | `#2E3742` | Body text (charcoal) |
| `--color-muted` | `#5B6673` | Secondary text, captions |
| `--color-rule` | `#D5DCE3` | Borders and dividers |
| `--color-accent` | `#E0A030` | Used sparingly: the primary "Request a Quote" button (navy text on amber) and markers in the flow diagram |

**Typography (suggested):** Archivo for headings (600–700 weight; its narrower widths suit an industrial, signage-like feel) and Source Sans 3 for body text (400/600), each with a system-font fallback. Keep headings in the casing written in the copy; don't force all caps with CSS. Keep body line length under about 75 characters.

**Layout:**
- Left-aligned text, generous whitespace, content max width around 1140px.
- Sticky header with a persistent "Request a Quote" button.
- Present product and documentation information as clear specification-style lists or tables, not decorative cards.
- Mobile: collapsible menu, tap-to-call and tap-to-email.

**Signature element:** the step-flow diagram (e.g. Supplier → Loading Point → Tanker Transportation → Customer Location). Build one clean `FlowDiagram` component in SVG/CSS — horizontal on desktop, vertical on mobile — and reuse it on Home, Ethanol Supply and Logistics. Let this be the one memorable visual; keep everything around it quiet.

**Avoid these generic-template tells:**
- All-caps, letter-spaced labels above every heading.
- Chopping every section into identical rounded cards with the same soft shadow.
- Gradient washes used as decoration.
- Fade/slide-in animation on every section (respect `prefers-reduced-motion` for any motion used).
- Arrows appended to every button label.
- Numbered markers on content that isn't a real sequence. (The Supply Process, How It Works and What Happens Next sections **are** sequences, so numbering is right there.)

---

## 6. Sitemap & navigation

| # | Page | URL | Header nav | Footer |
|---|---|---|---|---|
| 1 | Home | `/` | Home | Quick links |
| 2 | About Us | `/about-us` | About | Quick links |
| 3 | Products | `/products` | Products | Quick links |
| 4 | Bulk Ethanol Supply | `/ethanol-supply` | Ethanol Supply | Quick links |
| 5 | Industries We Serve | `/industries` | — | More links |
| 6 | Logistics & Transportation | `/logistics` | Logistics | Quick links |
| 7 | Quality & Documentation | `/quality-documentation` | — | More links |
| 8 | Compliance | `/compliance` | — | More links |
| 9 | Request a Quote | `/request-a-quote` | Request a Quote (styled as the accent button) | Quick links |
| 10 | Contact Us | `/contact` | Contact | Quick links |
| 11 | Privacy Policy | `/privacy-policy` | — | Legal row |
| 12 | Terms & Conditions | `/terms` | — | Legal row |

**Header nav order:** Home | About | Products | Ethanol Supply | Logistics | Request a Quote | Contact

> Dev note: The original plan didn't place the Industries page in either the header or the footer, which would leave it orphaned. It's added to the footer's "More" links here. **[TO CONFIRM]**

---

## 7. Site config & placeholders

Every contact detail and placeholder lives in one file. No page hardcodes these values.

```ts
// src/config/site.ts
export const site = {
  name: "Fortune Tradelinks",
  legalName: "[LEGAL BUSINESS NAME]",
  tagline: "Ethanol Trading & Supply",
  url: "https://www.fortunetradelinks.in",   // [TO CONFIRM www vs non-www]
  emailSales: "sales@fortunetradelinks.in",
  emailInfo: "info@fortunetradelinks.in",
  phone: "[YOUR BUSINESS MOBILE NUMBER]",
  address: "[YOUR REGISTERED BUSINESS ADDRESS]",
  gstin: "",                                 // optional; hide the GSTIN line when empty
  showMap: false,                            // Google Maps embed on Contact, only if there is a physical office
  legalLastUpdated: "[DATE]",                // "Last Updated" on Privacy Policy and Terms
  formEndpoint: "",                          // Request a Quote submission target (Section 10)
};
```

Rules:
- While a value is still a bracketed placeholder, render it as visible plain text so it's obvious in review, and don't wrap it in a `tel:` or map link.
- The original plan used several names for the same placeholder (`[BUSINESS ADDRESS]`, `[YOUR REGISTERED BUSINESS ADDRESS]`, `[Business Phone]`, `[YOUR BUSINESS MOBILE NUMBER]`). They all map to `site.address` and `site.phone`.

---

## 8. Global components

### Header
- Text wordmark "Fortune Tradelinks" until a logo is supplied **[TO CONFIRM logo]**.
- Navigation in the order given in Section 6.
- "Request a Quote" styled as the accent button.
- Sticky on scroll; collapsible menu on mobile (keyboard accessible, `aria-expanded`).

### Footer (same on every page)

Copy:

**Fortune Tradelinks**
Ethanol Trading & Supply
Bulk Ethanol | B2B Supply | Logistics Coordination

**Quick Links**
Home · About Us · Products · Ethanol Supply · Logistics · Request a Quote · Contact

**More**
Industries · Quality & Documentation · Compliance

**Contact**
sales@fortunetradelinks.in
info@fortunetradelinks.in
{site.phone}

© {current year} Fortune Tradelinks. All Rights Reserved.
Privacy Policy · Terms & Conditions

> Dev note: If `site.gstin` is set, add a line "GSTIN: {site.gstin}" in the Contact column. Emails are `mailto:` links. Generate the year at build time (currently 2026).

### Reusable components
- **CtaBand** — end-of-page call to action: H2, one line of text, an optional "what to include" line, and a button. Each page supplies its own copy from Section 9.
- **FlowDiagram** — the signature step-flow visual (Section 5). Takes an ordered list of step labels.
- **ProcessSteps** — numbered steps, each with a title and one line of text.
- **QuoteForm** — Section 10.

---

## 9. Page-by-page copy

### 9.1 Home — `/`

> Dev note: The hero must answer, above the fold on desktop and mobile: what Fortune Tradelinks supplies, how, and how to get in touch. Follow this layout:

```
┌───────────────────────────────────────────┐
│ FORTUNE TRADELINKS        Home About ...  │
├───────────────────────────────────────────┤
│  RELIABLE ETHANOL SUPPLY.                 │
│  PROFESSIONAL TRADING. EFFICIENT DELIVERY │
│  Anhydrous Denatured Ethanol | Bulk       │
│  Supply | Logistics Coordination          │
│  [ REQUEST A QUOTE ]  [ CONTACT US ]      │
├───────────────────────────────────────────┤
│  YOUR REQUIREMENT. OUR SUPPLY NETWORK.    │
│  Requirement → Sourcing → ... → Delivery  │
├───────────────────────────────────────────┤
│  OUR PRODUCT                              │
│  ANHYDROUS DENATURED ETHANOL              │
├───────────────────────────────────────────┤
│  WHY WORK WITH FORTUNE TRADELINKS?        │
├───────────────────────────────────────────┤
│  OUR SUPPLY PROCESS  01 → 02 → 03 → 04    │
├───────────────────────────────────────────┤
│  LOOKING FOR BULK ETHANOL?                │
│  [ REQUEST A QUOTE ]                      │
├───────────────────────────────────────────┤
│  CONTACT STRIP                            │
├───────────────────────────────────────────┤
│  FOOTER: Email | Phone | Address          │
│          GST | Privacy | Terms            │
└───────────────────────────────────────────┘
```

(Capitals in the wireframe are only notation. Use the casing in the copy below.)

#### Hero

**H1:** Reliable Ethanol Supply. Professional Trading. Efficient Delivery.

Fortune Tradelinks is a B2B trading and supply company focused on bulk ethanol requirements. We coordinate sourcing, commercial transactions and transportation to help industrial and commercial customers meet their bulk supply requirements efficiently.

Anhydrous Denatured Ethanol | Bulk Supply | Logistics Coordination

[Button: Request a Quote → /request-a-quote] [Button (secondary): Contact Us → /contact]

#### Supply network

**H2:** Your Requirement. Our Supply Network.

Fortune Tradelinks works with suppliers, manufacturers, transporters and customers to coordinate bulk ethanol transactions based on product specifications, quantity, destination and delivery requirements.

Our approach is simple:

Requirement → Sourcing → Commercial Coordination → Loading → Transportation → Delivery

> Dev note: Render the approach line with the FlowDiagram component.

#### Product

**H2:** Our Product

**H3:** Anhydrous Denatured Ethanol

We facilitate bulk supply of anhydrous denatured ethanol according to applicable product specifications and customer requirements.

Bulk quantities | Tanker transportation | Commercial supply

For current availability, pricing and delivery options, contact our sales team.

[Button: Enquire Now → /request-a-quote]

#### Why us

**H2:** Why Work With Fortune Tradelinks?

> Dev note: Five items, each an H3 title plus its sentence. A simple two- or three-column grid of text is enough; no icons required.

- **Reliable Sourcing** — We coordinate with supply sources to identify suitable availability for customer requirements.
- **Bulk Supply** — We handle bulk quantity requirements and coordinate the associated loading and transportation process.
- **Logistics Coordination** — We coordinate tanker transportation and delivery schedules according to the agreed commercial arrangement.
- **Professional Documentation** — We coordinate transaction and delivery documentation applicable to the supply arrangement.
- **Transparent Commercial Communication** — Our quotations clearly communicate product, quantity, delivery location, freight and applicable taxes as relevant to the transaction.

#### Supply process

**H2:** Our Supply Process

> Dev note: ProcessSteps component, numbered 01–04.

1. **Share Your Requirement** — Tell us your product, quantity, specification and delivery location.
2. **Availability & Commercial Offer** — We check availability and provide applicable commercial terms.
3. **Vehicle & Loading Coordination** — Transportation and loading arrangements are coordinated according to the agreed terms.
4. **Delivery** — The material is transported to the designated customer location.

#### Call to action

**H2:** Looking for Bulk Ethanol?

Whether you require a single tanker load or a recurring bulk supply arrangement, share your requirement with our team.

Product | Quantity | Delivery Location | Required Date

[Button: Request a Quote → /request-a-quote]

#### Contact strip (directly above the footer)

**Fortune Tradelinks**
Ethanol Trading & Supply

Email: info@fortunetradelinks.in
Sales: sales@fortunetradelinks.in

[Button (secondary): Contact Us → /contact]

---

### 9.2 About Us — `/about-us`

**H1:** About Fortune Tradelinks

**H2:** Building Reliable B2B Supply Connections

Fortune Tradelinks is a B2B trading and supply company focused on bulk ethanol requirements.

We work to connect customer requirements with suitable supply sources while coordinating the commercial and logistical aspects of each transaction.

Our business approach is centered around reliable sourcing, clear commercial communication, efficient logistics coordination and professional customer service.

> Dev note (optional visual): a small FlowDiagram reading Sourcing → Commercial Coordination → Logistics → Delivery can sit beside this intro.

**H2:** What We Do

Our activities include:

- Bulk ethanol sourcing and trading
- Commercial supply coordination
- Supplier and customer coordination
- Tanker transportation coordination
- Loading and delivery coordination
- Transaction documentation coordination

We work according to the product specifications, quantities, delivery locations and commercial terms agreed for each transaction.

**H2:** Our Approach

Every bulk requirement is different.

Quantity, product specification, source availability, destination, freight and delivery schedule can all affect a transaction.

Our role is to coordinate these requirements and communicate the applicable commercial terms clearly to our customers.

**H2:** Our Commitment

- **Reliability** — We focus on dependable coordination from sourcing through delivery.
- **Transparency** — We communicate product, quantity, pricing, freight and applicable taxes as clearly as possible.
- **Responsiveness** — We understand that bulk procurement often depends on timing, and we aim to respond promptly to customer requirements.
- **Long-Term Relationships** — We aim to develop professional and mutually beneficial relationships with suppliers, transport partners and customers.

**H2:** Our Vision

To develop Fortune Tradelinks into a trusted B2B trading and supply partner for bulk industrial products, beginning with a strong focus on ethanol.

**H2:** Our Mission

To provide customers with dependable sourcing, efficient commercial coordination and organized logistics support for their bulk supply requirements.

**Closing line:** Fortune Tradelinks — Connecting Supply With Opportunity.

---

### 9.3 Products — `/products`

> Dev note: One of the most important pages. Keep it specification-like and easy to scan.

**H1:** Our Products

**H2:** Bulk Ethanol Supply

Fortune Tradelinks focuses on the trading and supply of ethanol for eligible B2B and industrial requirements.

Our primary product offering is:

**H2:** Anhydrous Denatured Ethanol

Anhydrous denatured ethanol is supplied in bulk according to applicable product specifications and the requirements of the customer.

**H3:** Supply Options

- Bulk tanker quantities
- Scheduled deliveries
- Single-load requirements
- Recurring supply requirements
- Destination-based commercial supply

**H3:** Product Information

Product specifications, quality parameters, documentation and applicable commercial terms are confirmed for each transaction according to the agreed supply arrangement.

**H3:** Transportation

Bulk transportation can be coordinated through suitable tanker vehicles depending on the route, quantity, product requirements and applicable regulations.

> Dev note (optional, hidden until the owner supplies data): a specification table for the product with rows for Grade/specification, Available quantities, Packaging/transport mode, Origin/source (where appropriate), Delivery locations, Applicable taxes and Availability. Build it driven by data so it renders nothing while the data is empty. Never add a price row.

**H2:** Need a Specific Quantity?

Tell us:

| | |
|---|---|
| Product | Anhydrous Denatured Ethanol |
| Quantity | Required KL |
| Delivery Location | Customer plant/depot |
| Required Delivery Date | Preferred date |
| Specification | Required product specification |

Our team can then check availability and provide applicable commercial terms.

[Button: Request a Quote → /request-a-quote]

**H2:** Product Availability

Availability, pricing and delivery schedules are subject to source availability, market conditions, destination and applicable commercial terms.

For current availability:
Contact our Sales Team
sales@fortunetradelinks.in

---

### 9.4 Bulk Ethanol Supply — `/ethanol-supply`

> Dev note: This page targets buyers searching for ethanol suppliers.

**H1:** Bulk Ethanol Supply

**H2:** Your Bulk Ethanol Requirement, Coordinated From Source to Destination

Fortune Tradelinks facilitates bulk ethanol supply by coordinating sourcing, commercial requirements, transportation and delivery.

We work with customers who require ethanol in bulk quantities and coordinate the supply process according to the agreed transaction terms.

**H2:** What We Handle

- **Bulk Requirements** — We coordinate requirements ranging from individual tanker loads to recurring bulk requirements, subject to availability.
- **Source Coordination** — We communicate with suitable supply sources to check availability against customer requirements.
- **Commercial Coordination** — We coordinate product pricing, quantity, freight, taxes and other applicable commercial terms.
- **Transportation** — Suitable tanker transportation can be coordinated according to the route and supply arrangement.
- **Delivery Coordination** — We coordinate loading and delivery schedules with the relevant parties.

> Dev note (optional block, **off by default**, show only if the owner confirms): **H2:** Typical Requirements We Handle — 20 KL · 40 KL · 80 KL · 160 KL · Larger contracted quantities. Only display quantities the owner confirms can realistically be arranged.

**H2:** How It Works

> Dev note: ProcessSteps component, six steps. A compact FlowDiagram summary above the steps is fine.

1. **Submit Your Requirement** — Provide: Product · Quantity · Specification · Delivery location · Required delivery date · Transportation requirement
2. **Availability Check** — Our team checks the requirement against available supply sources.
3. **Commercial Offer** — We provide applicable commercial terms based on the confirmed supply arrangement.
4. **Order Confirmation** — Once the commercial terms are mutually agreed, the transaction is processed according to the agreed conditions.
5. **Loading** — Vehicle and loading arrangements are coordinated with the supply source.
6. **Transportation & Delivery** — The tanker is dispatched to the designated customer location and delivery is coordinated.

**H2:** Recurring Requirements

If your business requires regular ethanol supply, contact us with your expected:

Monthly Quantity | Delivery Locations | Frequency | Specification

We can discuss the applicable supply arrangement based on availability and commercial terms.

[Button: Discuss Your Requirement → /request-a-quote]

**H2:** Request a Quote

For a quotation, please provide:

- Quantity
- Product
- Destination
- Required Date
- Specification
- Transportation Required: Yes / No

sales@fortunetradelinks.in

[Button: Request a Quote → /request-a-quote]

---

### 9.5 Industries We Serve — `/industries`

**H1:** Industries We Serve

**H2:** Supporting Bulk Industrial Supply Requirements

Fortune Tradelinks works with B2B customers requiring bulk ethanol supply, subject to product suitability, availability and applicable regulations.

- **Industrial & Manufacturing Customers** — We coordinate bulk ethanol requirements for eligible industrial and manufacturing applications according to customer specifications.
- **Energy & Fuel-Related Businesses** — We can coordinate bulk ethanol requirements for eligible businesses involved in fuel and energy-related operations, subject to applicable requirements.
- **Commercial Buyers** — We work with commercial procurement teams requiring bulk quantities and organized delivery coordination.

> Dev note: Each item is an H3 plus its sentence. Don't add further industries or specific applications unless the owner confirms they are actually served.

**H2:** Recurring Industrial Requirements

For customers with regular requirements, we can discuss supply schedules based on:

- Monthly quantity
- Delivery frequency
- Delivery locations
- Product specifications
- Transportation requirements
- Commercial terms

**H2:** Have a Bulk Requirement?

Share your requirement with our sales team.

Product | Quantity | Specification | Destination | Delivery Date

[Button: Request a Quote → /request-a-quote]

---

### 9.6 Logistics & Transportation — `/logistics`

**H1:** Logistics & Transportation

**H2:** Coordinated Bulk Liquid Transportation

Efficient transportation is an important part of every bulk ethanol transaction.

Fortune Tradelinks coordinates tanker transportation and delivery arrangements according to the agreed supply requirements.

**H2:** Our Logistics Coordination

- **Tanker Arrangement** — Suitable tanker vehicles can be coordinated according to product, quantity, route and applicable requirements.
- **Loading Coordination** — We coordinate with the supply source and transporter to arrange loading schedules.
- **Route Coordination** — Delivery routes and schedules are coordinated according to the agreed destination and transportation arrangement.
- **Delivery Scheduling** — We coordinate dispatch and delivery timing with the relevant parties.
- **Documentation Coordination** — Applicable transportation and transaction documents are coordinated as required for the shipment.

**H2:** Supply Chain

> Dev note: This is the main use of the FlowDiagram signature visual.

Supplier → Loading Point → Tanker Transportation → Customer Location

Our objective is to keep communication clear between the supplier, transporter and customer throughout the delivery process.

**H2:** Bulk Delivery Requirements

When requesting transportation, please provide:

- Loading location
- Delivery location
- Quantity
- Product
- Required delivery date
- Vehicle requirement
- Any specific customer instructions

[Button: Request Logistics Support → /request-a-quote]

> Dev note: This button can pre-select "Transportation Required: Yes" on the quote form via a query parameter (e.g. `/request-a-quote?transport=yes`).

---

### 9.7 Quality & Documentation — `/quality-documentation`

> Dev note: This page builds trust with corporate buyers. Don't show certificates unless the owner supplies genuine, current ones.

**H1:** Quality & Documentation

**H2:** Clear Documentation for Every Transaction

Fortune Tradelinks understands that professional documentation is an important part of B2B bulk supply.

Documentation is coordinated according to the product, transaction structure, supplier requirements and applicable regulations.

**H2:** Product Documentation

Depending on the transaction, applicable product documentation may include:

- Product specification
- Certificate of Analysis (COA)
- Quality-related documents
- Batch information
- Other supplier documentation

**H2:** Commercial Documentation

Applicable transaction documents may include:

- Quotation
- Purchase/Sale Order
- Tax Invoice
- E-way Bill
- Delivery documentation
- Transport documentation

**H2:** Customer Requirements

If your organization requires specific documentation before loading or delivery, please communicate those requirements to our team during the quotation/order process.

We will coordinate the applicable documents with the relevant parties wherever available and applicable.

**H2:** Documentation Matters

Our objective is to maintain clear communication and proper documentation throughout the supply process.

For documentation requirements:
sales@fortunetradelinks.in

---

### 9.8 Compliance — `/compliance`

> Dev note: If `site.gstin` is set, show it here as "GSTIN: {site.gstin}". List permits or licences only if the owner confirms they are held and applicable. Never show bank details.

**H1:** Compliance

**H2:** Professional Business Practices

Fortune Tradelinks aims to conduct its business in accordance with applicable commercial, tax, transportation and regulatory requirements.

**H2:** Tax & Commercial Documentation

Transactions are documented according to the applicable tax and commercial requirements, including applicable invoicing and e-way bill requirements.

**H2:** Transportation Compliance

Transportation arrangements are coordinated with consideration to applicable requirements for the product, vehicle, route and destination.

**H2:** Product & Supply Requirements

Product specifications, documentation and supply arrangements are confirmed according to the applicable transaction and customer requirements.

**H2:** Responsible Business

We aim to maintain:

- Clear commercial communication
- Proper transaction documentation
- Responsible supplier coordination
- Professional customer relationships
- Compliance with applicable requirements

**H2:** Important

Specific regulatory requirements can vary according to the product, quantity, source, destination, transportation route and applicable laws.

Customers and suppliers should ensure that their respective obligations are satisfied before proceeding with a transaction.

For transaction-specific documentation requirements, contact our team.

**Closing line:** Fortune Tradelinks

---

### 9.9 Request a Quote — `/request-a-quote`

> Dev note: The most important conversion page. Put the form high on the page; on desktop the "What Happens Next?" steps can sit beside it. Form spec is in Section 10.

**H1:** Request a Quote

**H2:** Looking for Bulk Ethanol?

Tell us about your requirement and our team will review the details and respond with availability and applicable commercial terms.

**H2:** Your Requirement

{QuoteForm — fields in Section 10}

[Button: Submit Requirement]

**H2:** What Happens Next?

1. **Requirement Review** — Our team reviews the product, quantity and destination details.
2. **Availability Check** — We check available supply sources.
3. **Commercial Discussion** — Applicable product, freight, tax and payment terms are discussed.
4. **Quotation** — A commercial offer is shared based on the confirmed details.
5. **Order Processing** — Once terms are mutually agreed, the transaction proceeds according to the agreed conditions.

**H2:** Prefer Email?

Send your requirement directly to:
sales@fortunetradelinks.in

Please mention:
Product + Quantity + Destination + Required Date

---

### 9.10 Contact Us — `/contact`

**H1:** Contact Fortune Tradelinks

**H2:** Let's Discuss Your Requirement

Whether you are looking for a single bulk tanker load or a recurring ethanol supply arrangement, our team is available to discuss your requirement.

[Button: Call Us → tel:{site.phone}] [Button: Email Us → mailto:sales@fortunetradelinks.in] [Button: Request a Quote → /request-a-quote]

> Dev note: Hide or disable "Call Us" while `site.phone` is still a placeholder.

| | |
|---|---|
| **Sales Enquiries** | Email: sales@fortunetradelinks.in |
| **General Enquiries** | Email: info@fortunetradelinks.in |
| **Phone** | {site.phone} |
| **Office** | Fortune Tradelinks, {site.address} |

> Dev note: If `site.showMap` is true, add a Google Maps embed of the office. Load it only after the user clicks (a static placeholder with a "Show map" button) so it doesn't slow the page.

**H2:** Send Us Your Requirement

For faster assistance, please include:

- Product
- Quantity
- Delivery location
- Required delivery date
- Product specification
- Transportation requirement

Our team will review your requirement and respond with the relevant commercial information.

**Closing block:**
Fortune Tradelinks
Ethanol Trading & Supply
Reliable Supply. Professional Coordination.

---

### 9.11 Privacy Policy — `/privacy-policy`

> Dev note: Template text. Render "Last Updated" from `site.legalLastUpdated` and the address from `site.address`. The owner must have this reviewed before launch (Section 13).

**H1:** Privacy Policy

Last Updated: {site.legalLastUpdated}

Fortune Tradelinks respects the privacy of visitors to its website.

This Privacy Policy explains how information submitted through our website may be collected and used.

**H2:** Information We May Collect

When you contact us or submit a quotation request, we may collect information such as:

- Name
- Company name
- Email address
- Phone number
- Product requirements
- Quantity requirements
- Delivery location
- Other information voluntarily provided by you

**H2:** How We Use Information

Information submitted through the website may be used to:

- Respond to enquiries
- Prepare quotations
- Understand customer requirements
- Communicate regarding products and services
- Coordinate business transactions
- Improve our website and customer service

**H2:** Information Security

We take reasonable measures to protect information submitted through our website. However, no internet transmission can be guaranteed to be completely secure.

**H2:** Third-Party Services

Our website may use third-party services such as hosting, analytics, email or contact-form services. Such services may process information according to their own privacy policies.

**H2:** Contact

For questions regarding this Privacy Policy, contact:

info@fortunetradelinks.in

Fortune Tradelinks
{site.address}

---

### 9.12 Terms & Conditions — `/terms`

> Dev note: Template text, same handling as the Privacy Policy.

**H1:** Terms & Conditions

Last Updated: {site.legalLastUpdated}

By accessing and using this website, you agree to the following general terms.

**H2:** Website Information

The information provided on this website is intended for general business and informational purposes.

Product availability, specifications, prices, freight, taxes and delivery schedules may change and are subject to confirmation.

**H2:** Quotations

Any quotation or commercial information provided by Fortune Tradelinks is subject to the specific terms mentioned in the applicable quotation or commercial document.

A website enquiry does not constitute a confirmed order.

**H2:** Product Availability

Product availability depends on source availability, quantity, destination, specifications and other commercial factors.

**H2:** Pricing

Prices may vary according to market conditions, source, quantity, freight, taxes and delivery location.

Final commercial terms will be communicated separately.

**H2:** Delivery

Delivery schedules are subject to product availability, transportation arrangements, route conditions and other factors affecting the shipment.

**H2:** Customer Information

Customers are responsible for providing accurate information regarding their company, product requirements, quantity, destination and applicable documentation requirements.

**H2:** Regulatory Requirements

Each party is responsible for complying with the laws, regulations and requirements applicable to its role in a transaction.

**H2:** Intellectual Property

The content, branding, graphics, text and other materials on this website are the property of Fortune Tradelinks or are used with appropriate permission, unless otherwise stated.

**H2:** Changes

Fortune Tradelinks may update website content and these terms from time to time.

**H2:** Contact

For questions regarding these Terms & Conditions:

info@fortunetradelinks.in

Fortune Tradelinks
{site.address}

---

### 9.13 404 page (not in the original plan) — **[PROPOSED COPY]**

**H1:** Page not found

The page you're looking for doesn't exist or has moved.

[Button: Go to Home → /] [Button: Request a Quote → /request-a-quote]

---

## 10. Request a Quote form

### Fields

"Required" values are suggestions **[TO CONFIRM]**. Labels are final copy.

| Label | `name` | Input | Required | Notes |
|---|---|---|---|---|
| Company Name | `company` | text | Yes | `autocomplete="organization"` |
| Contact Person | `contact_name` | text | Yes | `autocomplete="name"` |
| Mobile Number | `mobile` | tel | Yes | Accept an optional +91 or 0 prefix, then 10 digits; strip spaces and dashes |
| Business Email | `email` | email | Yes | `autocomplete="email"` |
| Product Required | `product` | select | Yes | Only option for now: "Anhydrous Denatured Ethanol" (preselected). Add products only when the owner confirms them |
| Required Quantity (KL) | `quantity_kl` | number | Yes | Greater than 0; decimals allowed |
| Product Specification / Grade | `specification` | text | No | |
| Delivery Location | `delivery_location` | text | Yes | City/state or plant/depot address |
| Required Delivery Date | `delivery_date` | date | No | Can't be in the past |
| Transportation Required | `transport_required` | radio: Yes / No | Yes | Preselect from `?transport=yes` |
| Recurring Requirement | `recurring` | radio: Yes / No | Yes | Default: No |
| Expected Delivery Frequency | `frequency` | text | Only if Recurring = Yes | Show only when Recurring = Yes; e.g. "Weekly", "2 loads per month" as placeholder hint |
| Additional Requirements | `notes` | textarea | No | |

Also include a hidden honeypot field for spam, and use native HTML validation enhanced with JS.

### Behaviour
- Every input has a visible `<label>`. Error messages sit next to the field and are linked with `aria-describedby`. On submit with errors, move focus to the first invalid field.
- Error messages name the fix, e.g. "Enter your company name." / "Enter a 10-digit mobile number." / "Enter a quantity greater than 0." **[PROPOSED COPY]**
- Near the submit button: "We use these details only to respond to your requirement. See our Privacy Policy." (link to `/privacy-policy`) **[PROPOSED COPY]**
- The button label stays "Submit Requirement". While sending it shows "Submitting…" and is disabled.
- **Success state [PROPOSED COPY]:** "Requirement submitted. Our team will review the details and respond with availability and applicable commercial terms."
- **Error state [PROPOSED COPY]:** "Your requirement couldn't be sent. Check your connection and try again, or email it to sales@fortunetradelinks.in."

### Submission (integration point only)
- Submission depends on hosting, which is out of scope. POST the form as JSON or form-data to `site.formEndpoint`.
- If `site.formEndpoint` is empty, the dev build logs the payload to the console and shows the success state, and a visible dev-only banner says the form isn't connected. Never ship a form that silently discards submissions; connecting it is on the launch checklist (Section 13).
- Don't add any third-party form service without asking the owner.

---

## 11. SEO

| URL | `<title>` | Meta description |
|---|---|---|
| `/` | Fortune Tradelinks \| Bulk Ethanol Trading & Supply | B2B trading and supply of bulk anhydrous denatured ethanol. Fortune Tradelinks coordinates sourcing, tanker transportation and delivery. Request a quote. |
| `/about-us` | About Us \| Fortune Tradelinks | Fortune Tradelinks is a B2B trading and supply company focused on bulk ethanol, coordinating sourcing, commercial terms and logistics for each transaction. |
| `/products` | Anhydrous Denatured Ethanol \| Fortune Tradelinks | Bulk anhydrous denatured ethanol supplied to applicable specifications, for single loads or recurring supply. Contact us for current availability. |
| `/ethanol-supply` | Bulk Ethanol Supply \| Fortune Tradelinks | Bulk ethanol requirements coordinated from source to destination: availability checks, commercial offers, tanker loading and delivery. |
| `/industries` | Industries We Serve \| Fortune Tradelinks | Bulk ethanol supply for eligible industrial, manufacturing, energy and commercial buyers, subject to suitability, availability and regulations. |
| `/logistics` | Logistics & Transportation \| Fortune Tradelinks | Tanker arrangement, loading, route and delivery coordination for bulk ethanol shipments. |
| `/quality-documentation` | Quality & Documentation \| Fortune Tradelinks | Product and commercial documentation for bulk ethanol transactions, including COA, tax invoice and e-way bill, as applicable. |
| `/compliance` | Compliance \| Fortune Tradelinks | How Fortune Tradelinks approaches tax, commercial and transportation requirements for bulk ethanol transactions. |
| `/request-a-quote` | Request a Quote for Bulk Ethanol \| Fortune Tradelinks | Share your ethanol quantity, specification, delivery location and date. Our team will respond with availability and commercial terms. |
| `/contact` | Contact Us \| Fortune Tradelinks | Contact Fortune Tradelinks about bulk ethanol requirements. Sales: sales@fortunetradelinks.in |
| `/privacy-policy` | Privacy Policy \| Fortune Tradelinks | How Fortune Tradelinks collects and uses information submitted through this website. |
| `/terms` | Terms & Conditions \| Fortune Tradelinks | General terms for using the Fortune Tradelinks website and its quotation information. |

Also:
- `lang="en-IN"` on `<html>`.
- Canonical URL on every page, built from `site.url`.
- Open Graph and Twitter card tags (title, description, url, a default share image placeholder).
- `sitemap.xml` and `robots.txt` generated from the page list.
- Organization JSON-LD with name, url and email only. Add phone and address only once they are real values, never placeholders.
- These titles and descriptions are **[PROPOSED COPY]**.

---

## 12. Definition of done

A page is done when:

- [ ] Copy matches Section 9 exactly; no invented claims; placeholders come from `site.ts`.
- [ ] Layout works from 360px to 1440px wide with no horizontal scrolling.
- [ ] Semantic HTML: one H1, headings in order, `header` / `nav` / `main` / `footer` landmarks.
- [ ] WCAG 2.1 AA: colour contrast, visible keyboard focus, labelled inputs, keyboard-operable menu, `prefers-reduced-motion` respected.
- [ ] Title, meta description, canonical and Open Graph tags present (Section 11).
- [ ] Email links use `mailto:`; phone links use `tel:` only when the number is real.
- [ ] Images are responsive, lazy-loaded below the fold, with meaningful `alt` text; placeholders clearly marked.
- [ ] No broken internal links; every page is reachable from the header or footer.
- [ ] Target Lighthouse scores of 90+ for Performance, Accessibility, Best Practices and SEO.

---

## 13. Owner checklist before launch

- [ ] Replace placeholders in `site.ts`: legal business name, phone number, registered address, "Last Updated" date.
- [ ] Decide whether to show the GSTIN publicly.
- [ ] Confirm www vs non-www as the canonical address.
- [ ] Supply a logo, or approve the text wordmark.
- [ ] Confirm optional content: typical quantities block (Ethanol Supply), industries listed, Google Map on Contact.
- [ ] Supply real imagery or approve placeholder/stock images (no images implying assets or partners you don't have).
- [ ] Approve all **[PROPOSED COPY]** items.
- [ ] Connect the quote form to a real submission endpoint and test it end to end.
- [ ] Have the Privacy Policy and Terms & Conditions reviewed for your specific business structure.
- [ ] Add licences, permits or certificates only if genuine, current and applicable.

---

## 14. Backlog (not in this phase)

- **FAQ page.**
- **Testimonials page** — only with real testimonials used with permission.
- **Careers page.**
- **Downloadable company profile PDF** — company introduction, GST details, products, ethanol sourcing, transportation capability, contact information (bank details only if appropriate, and never on the public site).
- **Additional products** — e.g. ethanol, industrial alcohol, other industrial chemicals, biofuel-related products — only if genuinely traded and authorised.
- **Product specification table** on the Products page once the owner provides the data (the optional block in 9.3).
