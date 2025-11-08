# Auto Groups Checker - Landing Page

This is the marketing landing page for the Auto Groups Checker Chrome extension.

## Structure

- `index.html` - Main landing page with SEO optimization
- Media placeholders for screenshots and videos

## Features

### SEO Optimized
- Semantic HTML5 structure
- Meta tags for search engines
- Open Graph and Twitter Card tags
- Fast loading with minimal dependencies
- Mobile responsive design

### Sections

1. **Hero** - Main value proposition with CTA
2. **Features** - 6 key features with icons
3. **How It Works** - 4-step guide
4. **Video Demo** - Product demonstration placeholder
5. **Screenshots** - Visual showcase placeholders
6. **Help & FAQ** - 10 common questions
7. **CTA** - Final call-to-action
8. **Footer** - Links and copyright

## Media Placeholders

Replace these placeholders with actual media:

### Screenshots Needed (Recommended size: 1200x900px)
1. Widget interface showing the floating modal
2. Preset management with dropdown
3. Group selection dialog with prioritization

### Video Needed (Recommended: 1920x1080, MP4)
- Demo video showing the extension in action (30-60 seconds)

### Images Needed
- `favicon.png` - 32x32px or 64x64px
- `og-image.jpg` - 1200x630px for social sharing
- `twitter-image.jpg` - 1200x675px for Twitter

## Deployment

### Option 1: GitHub Pages
1. Push this folder to your repository
2. Go to Settings → Pages
3. Select branch and `/web` folder
4. Your site will be live at `https://yourusername.github.io/repo-name/`

### Option 2: Netlify
1. Drag and drop the `web` folder to netlify.com
2. Get instant deployment with custom domain support

### Option 3: Vercel
1. Import the repository to Vercel
2. Set root directory to `web`
3. Deploy automatically

## Customization

### Update Links
Replace placeholder links in `index.html`:
- Line 20: `og:url` - Your actual website URL
- Line 22: `og:image` - Your Open Graph image URL
- Line 26-28: Twitter card URLs
- Line 31: Favicon path
- CTA buttons: Chrome Web Store URL

### Branding
- Colors are defined in CSS `:root` variables (lines 35-42)
- Primary color: `#10b981` (green)
- Change colors by updating CSS variables

### Analytics
Add your tracking code before closing `</body>` tag:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Performance

- No external dependencies (except optional analytics)
- Pure CSS animations
- Minimal JavaScript (< 1KB)
- Mobile-first responsive design
- Fast page load (< 1s on most connections)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Same as the main extension project.
