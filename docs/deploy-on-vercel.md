# Fortune Tradelinks website: hosting on Vercel and connecting Request a Quote

This guide takes the website from this folder to a live site at `www.fortunetradelinks.in`, with the Request a Quote form delivering enquiries to `sales@fortunetradelinks.in`.

You'll need about 1–2 hours, most of it waiting for DNS changes. Plan names, prices and limits below were correct when this was written; check the linked pricing pages before you decide.

**Contents**

0. [Quick preview for your client (form not connected yet)](#0-quick-preview-for-your-client)
1. [How Request a Quote works on Vercel](#1-how-request-a-quote-works-on-vercel)
2. [Choose how the form is delivered: serverless or form service](#2-choose-how-the-form-is-delivered)
3. [Before you start](#3-before-you-start)
4. [Put the code on GitHub](#4-put-the-code-on-github)
5. [Deploy the site on Vercel](#5-deploy-the-site-on-vercel)
6. [Connect the form](#6-connect-the-form): Option A (serverless + Resend) or Option B (Formspree)
7. [Connect your domain](#7-connect-your-domain)
8. [Launch checklist](#8-launch-checklist)
9. [Updating the site later](#9-updating-the-site-later)
10. [Troubleshooting](#10-troubleshooting)

> **Important: Vercel's free plan is for non-commercial use.** Vercel's free *Hobby* plan is limited to personal, non-commercial projects. A company website is commercial use, so Vercel's terms require the *Pro* plan (paid, per team member, see [vercel.com/pricing](https://vercel.com/pricing)).
>
> If you need hosting that is free *and* allows commercial use, **Cloudflare Pages** and **Netlify** both offer that on their free plans. This website is static files, so it runs on either. The form would then use **Option B** (a form service), which works on any host. Option A's server function is written for Vercel and would need small changes to move.
>
> The steps below assume Vercel.

---

## 0. Quick preview for your client

You can put the site online now and connect the form later (section 6). The domain can come later too (section 7).

**Fastest way: deploy straight from your computer (about 10 minutes, no GitHub needed)**

In a terminal, in the project folder:

```powershell
npm run build            # confirm it builds
npx vercel login         # log in (opens the browser)
npx vercel --prod        # upload, build on Vercel, publish
```

The first time, `vercel` asks a few questions:

- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to an existing project?** No
- **Project name?** e.g. `fortune-tradelinks`
- **Code directory?** `./`
- **Want to modify these settings?** No. `vercel.json` already has them.

It ends by printing the production address, such as `https://fortune-tradelinks.vercel.app`. **Share that production address with your client.** Other preview addresses Vercel creates are protected by default and ask visitors to log in to Vercel.

Run `npx vercel --prod` again to publish changes. Later, you can connect the same project to GitHub (Settings → Git) to get automatic deploys.

**Alternative:** follow sections 3–5 (GitHub, then import into Vercel) and skip 6 and 7 for now.

**What your client will see**

- **Every page, the theme switch and the photos:** all working.
- **Highlighted `[PLACEHOLDER]` values** (mobile number, address, legal name, date): shown on purpose, so they're easy to spot and replace.
- **The Request a Quote form:** it checks fields as normal, but **submitting shows the error message** ("Your requirement couldn't be sent… or email it to sales@…"), because it can't send email yet. Each attempt is still recorded in Vercel → Logs. Either tell your client the form isn't connected yet, or do the 5-minute test setup below.

**Optional: make the form work for the demo (5 minutes, no DNS changes)**

1. Sign up at [resend.com](https://resend.com) and create an API key (section 6, step A2).
2. In Vercel → Settings → Environment Variables, add:

   | Name | Value |
   |---|---|
   | `RESEND_API_KEY` | your key |
   | `QUOTE_FROM` | `onboarding@resend.dev` |
   | `QUOTE_TO` | the email address you signed up to Resend with |

3. Redeploy: Deployments → ⋯ → Redeploy, or run `npx vercel --prod` again.

Demo enquiries now show "Requirement submitted…" and arrive in **your** inbox. Resend only delivers test emails to your own account's address. For the real launch, complete section 6 (Option A) so they go to `sales@`.

**Search engines:** while the site lives at `.vercel.app`, every page already tells search engines its real address is `www.fortunetradelinks.in`. So you don't need to hide the preview.

---

## 1. How Request a Quote works on Vercel

The website is a set of static pages that Vercel serves from its network. Static pages can't send email, so something running on a server has to receive each enquiry and deliver it.

**What happens when a buyer submits the form:**

1. **The browser checks the form.** Required fields, a valid 10-digit mobile number, quantity above 0, and no past delivery date. Errors show next to each field.
2. **The form sends the enquiry.** It posts the details to the address set as `formEndpoint` in `src/config/site.ts`.
3. **A server receives it.** This is either:
   - **Option A:** your own small function on Vercel (`/api/quote`), already built into this project, or
   - **Option B:** a form service such as Formspree.
4. **The enquiry is emailed** to `sales@fortunetradelinks.in`. Reply-To is set to the buyer's email address, so your team can simply press Reply.
5. **The buyer sees the result.** On success: "Requirement submitted. Our team will review the details and respond with availability and applicable commercial terms." On failure: an error message with the sales email address, so they can still reach you.

```
Buyer's browser                    Server                         Your team
───────────────                    ──────                         ─────────
Fills in the form
  │ checks fields
  ▼
Sends the enquiry ───────────────► Receives it
                                   checks it again (Option A)
                                   drops spam
                                   sends the email ─────────────► sales@ inbox
  ◄─────────────── success / error                                │
Shows the message                                                 ▼
                                                     Reply goes straight to the buyer
```

**Visitors without JavaScript** still get a working form. Their browser posts it as a plain web form, and they see a simple confirmation page.

**Spam:** the form has a hidden field that people never see or fill in. Automated bots do, and those submissions are dropped.

---

## 2. Choose how the form is delivered

Pick one. You can switch later by changing one line in `src/config/site.ts`.

| | **Option A: Serverless function + Resend** (recommended) | **Option B: Form service (Formspree)** |
|---|---|---|
| What it is | The function `api/quote.ts` in this project runs on Vercel and sends the email through Resend, an email-sending service | Formspree gives you an address; it receives each enquiry and emails it to you |
| Code changes | None: already built and tested | Change one line (`formEndpoint`) |
| Setup | Resend account, plus DNS records on your domain so emails aren't marked as spam | Formspree account. No DNS records needed |
| Checks on the server | Yes: the same rules as the form, so bad or fake submissions are refused | Formspree's own basic checks only |
| Email format | Your format: a clear table, a subject like "Quote request: 40 KL – Company name", from your own domain | Formspree's standard format, from Formspree's address |
| If sending fails | Buyer sees the error message; the full enquiry is kept in Vercel's logs | Handled by Formspree |
| Free allowance | Resend free plan: about 3,000 emails a month, 100 a day ([resend.com/pricing](https://resend.com/pricing)) | Formspree free plan: a small number of submissions a month, about 50 ([formspree.io/plans](https://formspree.io/plans)) |
| Where enquiry data goes | Vercel and Resend | Formspree (stored in their dashboard) |
| Works on other hosts | Vercel only (needs small changes elsewhere) | Any host |

**Recommendation:** Option A, unless you want the quickest possible setup or plan to host somewhere other than Vercel. In those cases, use Option B.

---

## 3. Before you start

You need:

- **A GitHub account** ([github.com](https://github.com)). Vercel deploys the site from a GitHub repository.
- **A Vercel account** ([vercel.com](https://vercel.com)). Sign up with your GitHub account. See the note at the top about which plan.
- **Access to your domain's DNS settings** for `fortunetradelinks.in`, at your registrar (GoDaddy, Hostinger, BigRock, Namecheap, etc.).
- **A working mailbox at `sales@fortunetradelinks.in`** that you can read, for example through Google Workspace or Zoho Mail.
- **On your computer:** Git and Node.js 20 or newer. Check with `git --version` and `node --version`.

Then confirm the site builds on your machine. In a terminal, in the project folder:

```powershell
npm install
npm run build
```

It should finish with a list of pages written to `dist/`. If it fails, fix that first.

---

## 4. Put the code on GitHub

1. On GitHub, choose **New repository**. Name it, for example, `fortune-tradelinks-website`, and set it to **Private**. Don't add a README or .gitignore; the project already has them.
2. In a terminal in the project folder, run (replace `YOUR-USERNAME`):

   ```powershell
   git init
   git add .
   git commit -m "Fortune Tradelinks website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/fortune-tradelinks-website.git
   git push -u origin main
   ```

3. Refresh the repository page on GitHub. You should see folders such as `src`, `api` and `public`.

The project's `.gitignore` keeps `node_modules`, the `dist` build output and any `.env.local` file (which can hold secret keys) out of GitHub.

---

## 5. Deploy the site on Vercel

1. In Vercel, choose **Add New… → Project**.
2. Find your repository in the list and choose **Import**. If it isn't listed, choose to adjust GitHub permissions and give Vercel access to it.
3. Vercel detects **Vite** as the framework. Leave the build settings as they are. The project's `vercel.json` already sets:
   - build command: `npm run build`
   - output folder: `dist`
   - clean page addresses (`/about-us` rather than `/about-us.html`)
   - long-term caching for images, styles and scripts
4. Choose **Deploy** and wait 1–2 minutes.
5. Open the address Vercel gives you, which ends in `.vercel.app`. Check:
   - every page in the menu opens
   - a made-up address such as `/test-page` shows the "Page not found" page
   - the sun/moon button switches themes

The form won't deliver email yet. Submitting it now shows the error message, which is expected until step 6.

From now on, **every push to the `main` branch redeploys the site automatically.**

---

## 6. Connect the form

Follow **either** Option A **or** Option B.

### Option A: Serverless function + Resend

The code is already in place: the form posts to `/api/quote` (set in `src/config/site.ts`), and `api/quote.ts` sends the email. You only need to give it an email account to send from.

**A1. Create a Resend account and verify your domain**

1. Sign up at [resend.com](https://resend.com).
2. Go to **Domains → Add Domain** and enter `fortunetradelinks.in`. To keep data closer to India, pick the region nearest it if Resend offers a choice.
3. Resend shows a few DNS records, usually:
   - a TXT record for DKIM (name like `resend._domainkey`)
   - an MX record and a TXT (SPF) record for a `send` subdomain
4. At your domain registrar, open the DNS settings for `fortunetradelinks.in` and add each record **exactly as Resend shows it** (type, name and value).
5. Back in Resend, choose **Verify**. It can take from a few minutes up to a few hours to show **Verified**.
6. *Recommended:* also add a DMARC record, which helps your emails reach inboxes:
   - Type: `TXT`
   - Name: `_dmarc`
   - Value: `v=DMARC1; p=none;`

These records only allow Resend to send email *as* your domain. They don't change where your normal email is delivered.

**A2. Create an API key**

1. In Resend, go to **API Keys → Create API Key**.
2. Name it `fortunetradelinks-website` and give it **Sending access** only, limited to `fortunetradelinks.in` if offered.
3. Copy the key, which starts with `re_`. Resend shows it only once.

**A3. Add the settings to Vercel**

1. In Vercel, open your project and go to **Settings → Environment Variables**.
2. Add these, for the **Production** environment (and **Preview**, if you want test deployments to send email too):

   | Name | Value |
   |---|---|
   | `RESEND_API_KEY` | the key from A2 (`re_…`) |
   | `QUOTE_FROM` | `Fortune Tradelinks Website <website@fortunetradelinks.in>` |
   | `QUOTE_TO` | *optional:* who receives enquiries, separated by commas. Leave it out to use `sales@fortunetradelinks.in` |

3. Go to **Deployments**, open the menu (**⋯**) on the latest deployment and choose **Redeploy**. New settings only take effect in a new deployment.

The key stays secret: it lives only in Vercel's settings, never in the code or on GitHub.

**A4. Test it**

1. Open your live site, go to **Request a Quote**, and submit a real test enquiry with your own email address as the buyer.
2. You should see "Requirement submitted…".
3. Check the `sales@` inbox, including the spam folder. The email's subject looks like `Quote request: 20 KL – Your Company`.
4. Press **Reply** and check the reply is addressed to the buyer's email.
5. You can also see each email in **Resend → Emails**, and each request in **Vercel → your project → Logs**.

*Testing before your domain is verified:* temporarily set `QUOTE_FROM` to `onboarding@resend.dev` and `QUOTE_TO` to the email address you signed up to Resend with, then redeploy. Resend only delivers these test emails to your own account's address. Change both back once the domain is verified.

**Optional: run the function in Mumbai.** Vercel runs functions in the US by default. To run it closer to your buyers, add `"regions": ["bom1"]` to `vercel.json`. Check that your plan allows choosing a region.

### Option B: Form service (Formspree)

**B1. Create the form on Formspree**

1. Sign up at [formspree.io](https://formspree.io) using `sales@fortunetradelinks.in`, or add that address as a linked email.
2. Choose **New Form**. Name it `Request a Quote` and choose `sales@fortunetradelinks.in` as the email it sends to.
3. Copy the form's endpoint. It looks like `https://formspree.io/f/abcdwxyz`.

**B2. Point the website at it**

1. Open `src/config/site.ts` and change the `formEndpoint` line to your endpoint:

   ```ts
   formEndpoint: 'https://formspree.io/f/abcdwxyz',
   ```

2. *Optional:* delete the `api` folder, since Option B doesn't use it. Keeping it does no harm.
3. Commit and push. Vercel redeploys automatically:

   ```powershell
   git add .
   git commit -m "Send quote form to Formspree"
   git push
   ```

No code changes are needed beyond that line: the form already sends its data in the format Formspree accepts.

**B3. Test it**

1. Submit a test enquiry on the live site.
2. On the very first submission, Formspree may email `sales@` asking you to confirm the address. Confirm it, then submit again.
3. Check the email arrives, and that replying goes to the buyer. Formspree uses the form's `email` field as the reply address.
4. Submissions also appear in your Formspree dashboard.

**Note:** with Option B, `npm run dev` on your computer also sends real submissions to Formspree, which counts towards your monthly allowance.

---

## 7. Connect your domain

The website is set up for `https://www.fortunetradelinks.in` (with `www`) as its main address. That address is used in search-engine tags and `sitemap.xml`.

1. In Vercel, open your project and go to **Settings → Domains**.
2. Add `www.fortunetradelinks.in`, then add `fortunetradelinks.in` and choose to **redirect** it to `www.fortunetradelinks.in`.
3. Vercel shows the DNS records to add, typically:
   - for `fortunetradelinks.in`: an **A** record (Vercel shows the IP address)
   - for `www`: a **CNAME** record (Vercel shows the target, e.g. `cname.vercel-dns.com` or a project-specific address)

   Add them at your registrar **exactly as Vercel shows them**. Remove any old A or CNAME records for the same names that point to a previous host. **Don't touch the MX records:** those deliver your normal email.
4. Wait until Vercel shows both domains as valid. HTTPS certificates are set up automatically.

*If you'd rather use the address without `www`:* make `fortunetradelinks.in` the main domain in Vercel instead. Then change `url` in `src/config/site.ts` to `https://fortunetradelinks.in`, commit and push, so search engines get the right address.

---

## 8. Launch checklist

- [ ] **Placeholders replaced** in `src/config/site.ts`: legal business name, mobile number, registered address, and the "Last Updated" date for the legal pages. Search the live site for `[` to spot any left.
- [ ] **Form tested** end to end on the live domain: the email arrives, and Reply goes to the buyer.
- [ ] **Pages:** every page opens on `https://www.fortunetradelinks.in`, and the address without `www` redirects to it.
- [ ] `https://www.fortunetradelinks.in/sitemap.xml` and `/robots.txt` open.
- [ ] **Search engines (optional):** add the site to [Google Search Console](https://search.google.com/search-console) and submit `sitemap.xml`.
- [ ] **Brief's launch checklist:** the remaining owner items in `PROJECT_BRIEF.md` Section 13 and the README's "Owner review before launch" are done or approved.

---

## 9. Updating the site later

1. Edit the files, for example text in `src/pages/`, contact details in `src/config/site.ts`, or photos (see the README).
2. Check locally with `npm run dev`. With Option A, enquiries are printed in the terminal instead of emailed.
3. Commit and push to `main`. Vercel builds and publishes the new version in a minute or two.

To try changes before they go live, push them to another branch. Vercel creates a separate preview address for it, and the live site doesn't change until you merge into `main`.

---

## 10. Troubleshooting

| What you see | Likely cause | Fix |
|---|---|---|
| Form shows "Your requirement couldn't be sent…" (Option A) | Settings missing, or added without redeploying | Check `RESEND_API_KEY` and `QUOTE_FROM` in Vercel → Settings → Environment Variables, then redeploy |
| Vercel Logs show `Resend refused the email (HTTP 403)` | Domain not verified in Resend, or `QUOTE_FROM` uses a different domain | Finish domain verification (A1), or use the test sender temporarily |
| Vercel Logs show `RESEND_API_KEY is not set` | Key missing in this environment (Production or Preview) | Add it for that environment and redeploy |
| The email lands in spam | DNS records incomplete | Check every Resend record shows as verified; add the DMARC record (A1 step 6) |
| Nothing arrives, no error shown (Option B) | Formspree address not yet confirmed | Look for Formspree's confirmation email in `sales@` (and spam) |
| Pages show "404" on Vercel | Wrong output folder | `vercel.json` sets `dist`. Make sure it was pushed to GitHub |
| Build fails on Vercel | A code or type error | Open the deployment's build log, run `npm run build` locally to see the same error, then fix and push |
| Domain shows "Invalid configuration" | DNS records missing, or old records still present | Compare with what Vercel shows under Settings → Domains; DNS changes can take a few hours |

If an enquiry ever fails to send with Option A, it isn't lost. Vercel → Logs shows the full details under a line starting `Quote NOT emailed:`, so your team can follow it up.
