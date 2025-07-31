# Catalyst ROI Calculator - Deployment Guide

## 🚀 Quick Deploy Options

### Option 1: Netlify (Recommended)
1. Run `npm run build`
2. Drag and drop the `dist` folder to Netlify
3. Your app is live!

### Option 2: Vercel
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in project directory
3. Follow the prompts

### Option 3: GitHub Pages
1. Build: `npm run build`
2. Push `dist` folder to `gh-pages` branch
3. Enable GitHub Pages in repository settings

## 📁 Project Structure
```
catalyst-roi-calculator/
├── dist/                     # Production build (after npm run build)
├── src/
│   ├── components/          # React components
│   ├── data/               # ROI scenarios and business logic
│   ├── styles/             # CSS styling
│   └── utils/              # PDF export and utilities
├── public/                 # Static assets
├── index.html             # Main HTML file
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies and scripts
```

## 🔧 Build Commands

### Development
```bash
npm run dev        # Start development server (http://localhost:3000)
```

### Production
```bash
npm run build      # Build for production (outputs to dist/)
npm run preview    # Preview production build locally
```

## 🌐 Environment Configuration

### For Custom Domain
Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/', // or '/your-subdirectory/' for subdirectory hosting
  // ... other config
})
```

### For CDN/Assets
All assets are bundled and optimized automatically. No additional CDN setup required.

## 📊 Performance Optimizations

### Bundle Analysis
The build includes:
- **CSS**: ~10KB gzipped
- **JavaScript**: ~295KB gzipped (includes React, Chart.js, jsPDF)
- **Total**: ~305KB gzipped

### Optimization Features
✅ **Code Splitting**: Automatic by Vite
✅ **Minification**: CSS and JS minified
✅ **Compression**: Gzip-ready assets
✅ **Caching**: Optimized headers for static assets

## 🔐 Security Headers (Optional)

Add these headers for production:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## 🚀 API Configuration (Future)

For future API integration, set environment variables:
```bash
VITE_API_URL=https://your-api.com
VITE_APP_VERSION=1.0.0
```

## 📱 PWA Setup (Future Enhancement)

To add Progressive Web App features:
1. Add `vite-plugin-pwa` to dependencies
2. Configure service worker
3. Add manifest.json

## 🔄 Update Process

1. Make changes to source code
2. Test locally: `npm run dev`
3. Build production: `npm run build`
4. Deploy `dist` folder

## 📈 Analytics Integration

### Google Analytics (Optional)
Add to `index.html` head section:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🛠️ Troubleshooting

### Build Fails
- Check Node.js version (>=16 required)
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `rm -rf dist && npm run build`

### Large Bundle Size Warning
This is normal for the current feature set. The warning appears because:
- Chart.js library (~100KB)
- jsPDF library (~80KB)
- React (~40KB)

### MIME Type Errors
If you see "Incorrect MIME type" errors, ensure your hosting supports:
- `.js` files as `application/javascript`
- `.css` files as `text/css`

## 📞 Support

For deployment issues:
1. Check the build output in `dist/`
2. Test with `npm run preview`
3. Verify all dependencies are installed
4. Check hosting provider documentation

---

**Ready to launch your ROI calculator! 🚀**