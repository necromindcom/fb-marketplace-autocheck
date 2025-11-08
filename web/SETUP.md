# Landing Page Setup Guide

Quick guide to get your Auto Groups Checker landing page live.

## 📋 Pre-Launch Checklist

### 1. Add Media Assets

Create an `assets` folder and add these files:

```
web/
├── assets/
│   ├── images/
│   │   ├── favicon.png (32x32 or 64x64)
│   │   ├── og-image.jpg (1200x630 for social sharing)
│   │   ├── twitter-image.jpg (1200x675)
│   │   ├── screenshot-widget.png (1200x900)
│   │   ├── screenshot-presets.png (1200x900)
│   │   └── screenshot-dialog.png (1200x900)
│   └── videos/
│       └── demo.mp4 (1920x1080, 30-60 seconds)
```

#### Screenshot Tips:
1. **Widget Interface** - Show the floating widget with filters filled in
2. **Preset Management** - Show dropdown with saved presets
3. **Group Selection** - Show the prioritization dialog with groups

#### Video Tips:
- Keep it under 60 seconds
- Show the full workflow: open modal → enter keywords → run checker → groups selected
- Add captions for accessibility
- Compress to < 10MB for fast loading

### 2. Update Links in index.html

Find and replace these placeholders:

```html
Line 20: <meta property="og:url" content="https://yourwebsite.com/">
         → Replace with your actual URL

Line 22: <meta property="og:image" content="https://yourwebsite.com/og-image.jpg">
         → Update path to your image

Line 26-28: Twitter image URLs
           → Update with your URLs

Line 31: <link rel="icon" type="image/png" href="favicon.png">
         → Ensure favicon.png exists or update path
```

#### Screenshot Placeholders
Replace placeholder text with `<img>` tags:

```html
<!-- Current -->
<div class="screenshot-item">
    🖼️ Widget Interface Screenshot
</div>

<!-- Replace with -->
<div class="screenshot-item">
    <img src="assets/images/screenshot-widget.png" alt="Widget Interface" style="width: 100%; height: 100%; object-fit: cover;">
</div>
```

#### Video Placeholder
Replace video placeholder:

```html
<!-- Current -->
<div class="video-container">
    📹 Product Demo Video Placeholder (1920x1080)
</div>

<!-- Replace with -->
<div class="video-container">
    <video controls style="width: 100%; height: 100%; border-radius: 16px;">
        <source src="assets/videos/demo.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
</div>
```

### 3. Add Chrome Web Store Link

Once your extension is published, update CTA buttons:

```html
<!-- Find both instances (hero and bottom CTA) -->
<a href="#" class="cta-button">Add to Chrome - It's Free</a>

<!-- Replace with -->
<a href="https://chrome.google.com/webstore/detail/YOUR-EXTENSION-ID" class="cta-button">Add to Chrome - It's Free</a>
```

### 4. Add Analytics (Optional)

Add before closing `</body>` tag in index.html:

#### Google Analytics 4
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

#### Plausible Analytics (Privacy-friendly alternative)
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## 🚀 Deployment Options

### Option 1: GitHub Pages (Free, Easiest)

1. Push `web` folder to your repository
2. Go to your repo → Settings → Pages
3. Source: Deploy from branch
4. Branch: `main`, Folder: `/web`
5. Save and wait ~1 minute
6. Your site will be live at: `https://yourusername.github.io/repo-name/`

**Custom Domain:**
1. Add a file `CNAME` in web folder with your domain (e.g., `autogroupschecker.com`)
2. Update DNS records with your domain provider

### Option 2: Netlify (Free, Fast)

1. Sign up at [netlify.com](https://netlify.com)
2. Drag and drop the `web` folder
3. Instant deployment!
4. Free SSL certificate included
5. Custom domain support

**Continuous Deployment:**
```bash
# Connect to GitHub
1. Click "New site from Git"
2. Choose your repository
3. Base directory: web
4. Build command: (leave empty)
5. Publish directory: .
```

### Option 3: Vercel (Free, Excellent Performance)

1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Settings:
   - Framework Preset: Other
   - Root Directory: web
   - Build Command: (leave empty)
   - Output Directory: .
4. Deploy!

### Option 4: Cloudflare Pages (Free, Fast CDN)

1. Sign up at [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub repository
3. Build settings:
   - Build command: (leave empty)
   - Build output directory: web
4. Deploy

## 🎨 Customization

### Change Colors

Edit CSS variables in index.html (around line 35):

```css
:root {
    --primary: #10b981;        /* Main green color */
    --primary-dark: #059669;   /* Darker green for hovers */
    --dark: #111827;           /* Dark backgrounds */
    --gray-50: #f9fafb;        /* Lightest gray */
    /* ... */
}
```

### Change Fonts

Add Google Fonts before closing `</head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Update font-family in CSS:
```css
body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
}
```

## 📊 SEO Checklist

- [x] Meta title under 60 characters
- [x] Meta description under 160 characters
- [x] Open Graph tags for social sharing
- [x] Semantic HTML (h1, h2, nav, section, etc.)
- [x] Mobile responsive design
- [ ] Add favicon
- [ ] Add og-image for social sharing
- [ ] Submit sitemap to Google Search Console
- [ ] Add structured data (optional, for rich snippets)

### Submit to Search Engines

1. **Google Search Console**
   - Add property: your-domain.com
   - Verify ownership
   - Submit sitemap (auto-generated by hosting)

2. **Bing Webmaster Tools**
   - Import from Google Search Console
   - Or manually add site

## 🔒 Security Headers (Advanced)

Add to Netlify (`netlify.toml` in web folder):

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## 📱 Testing Checklist

Before going live:

- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on mobile devices (iOS Safari, Chrome Mobile)
- [ ] Validate HTML: [validator.w3.org](https://validator.w3.org)
- [ ] Check PageSpeed: [pagespeed.web.dev](https://pagespeed.web.dev)
- [ ] Test social sharing preview: [opengraph.xyz](https://www.opengraph.xyz)
- [ ] Check broken links
- [ ] Verify all CTAs work
- [ ] Test FAQ accordions
- [ ] Test smooth scrolling

## 🎯 Post-Launch

1. **Monitor Performance**
   - Google Analytics / Plausible
   - PageSpeed Insights
   - Search Console

2. **Improve SEO**
   - Create blog content about Facebook Marketplace tips
   - Get backlinks from relevant sites
   - Engage on social media

3. **Collect Feedback**
   - Add feedback form
   - Monitor GitHub issues
   - Create Discord/Telegram community

## 📞 Support

- GitHub Issues: [Your Repo Issues](https://github.com/necromindcom/fb-marketplace-autocheck/issues)
- Documentation: See README.md

---

**Quick Start Command:**

```bash
# If using a local server for testing
cd web
python -m http.server 8000
# Visit http://localhost:8000
```

Good luck with your launch! 🚀
