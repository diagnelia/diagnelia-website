# diagnelia.com

Source of the [Diagnelia](https://diagnelia.com) website, in English, German and Ukrainian.

Diagnelia is an AI guide for people still searching for a diagnosis. The website explains the product, the AI behind it, the plans for clinicians, pricing and partnerships. It is at an early stage (Stage 1, in development).

## Technology

- Static HTML, CSS and JavaScript. No framework, no build step.
- Self-hosted fonts (Manrope, WOFF2). No third-party fonts.
- No tracking cookies and no analytics.
- Contact forms open the visitor's own email app (or Gmail). Nothing is sent to a server.

## Structure

```
.
├── index.html, how-it-works.html, ai.html, clinicians.html, pricing.html,
│   partners.html, about.html, faq.html, contact.html,
│   privacy.html, terms.html, legal-notice.html     English (default)
├── de/                                             German, same pages
├── uk/                                             Ukrainian, same pages
├── assets/
│   ├── site.css, tokens.css, base.css, fonts.css   styles
│   ├── site.js                                     navigation, animations, email links
│   ├── fonts/                                      Manrope (WOFF2)
│   ├── favicon.svg, favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png
│   ├── og-en.png, og-de.png, og-uk.png             link previews per language
│   └── orest-petryshyn.webp
├── site.webmanifest
├── sitemap.xml
└── robots.txt
```

## View locally

```bash
git clone https://github.com/diagnelia/diagnelia-website.git
cd diagnelia-website
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Licence

© 2026 Diagnelia. All rights reserved. See [LICENSE](LICENSE). The code and content are published for reference only.

The Manrope typeface in `assets/fonts/` is © The Manrope Project Authors and is licensed under the SIL Open Font License 1.1. It is not covered by the licence of this repository.

## Contact

Found a broken link, a typo or a translation problem? Open an issue, or email [info@diagnelia.com](mailto:info@diagnelia.com). Security problems: see our [security policy](https://github.com/diagnelia/.github/blob/main/SECURITY.md).
