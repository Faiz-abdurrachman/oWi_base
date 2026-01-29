# Image Assets Checklist for oWi AI Mini App

## Required Images

All images should be placed in `frontend/public/`

### App Icon
- **File**: `icon.png`
- **Size**: 1024x1024 pixels
- **Format**: PNG (transparent background)
- **Description**: Main app icon displayed in Mini App store and app header
- **Design**: Gold coin or gold bar with oWi branding

### Splash Screen
- **File**: `splash.png`
- **Size**: 200x200 pixels minimum
- **Format**: PNG (transparent background preferred)
- **Description**: Displayed while app is loading
- **Design**: oWi logo centered

### Embed Image
- **File**: `embed.png`
- **Size**: 1200x630 pixels
- **Format**: PNG or JPG
- **Description**: Preview image when Mini App is shared
- **Design**: Hero banner with app name and tagline

### OG Image (Social Sharing)
- **File**: `og-image.png`
- **Size**: 1200x630 pixels
- **Format**: PNG or JPG
- **Description**: Image for Open Graph/Twitter cards
- **Design**: Same as embed or branded banner

### Favicon
- **File**: `favicon.ico`
- **Size**: 32x32 or 48x48 pixels
- **Format**: ICO
- **Description**: Browser tab icon

### Apple Touch Icon
- **File**: `apple-touch-icon.png`
- **Size**: 180x180 pixels
- **Format**: PNG
- **Description**: iOS home screen icon

---

## Screenshots (for Mini App Store)

Place in `frontend/public/screenshots/`

### Screenshot 1: Dashboard
- **File**: `1-dashboard.png`
- **Size**: 1284x2778 pixels (iPhone 14 Pro Max)
- **Description**: Main dashboard showing portfolio value and gold allocation

### Screenshot 2: Trading
- **File**: `2-trading.png`
- **Size**: 1284x2778 pixels
- **Description**: Trading interface with AI signal and trade form

### Screenshot 3: Portfolio
- **File**: `3-portfolio.png`
- **Size**: 1284x2778 pixels
- **Description**: Portfolio page with charts and history

---

## Design Guidelines

### Color Palette
- **Primary Gold**: #FFD700
- **Navy Background**: #0F172A
- **Accent Gold Light**: #FFF4CC
- **Accent Gold Dark**: #B8860B

### Typography
- **Headings**: Inter Bold
- **Body**: Inter Regular
- **Monospace**: JetBrains Mono

### Style
- Dark mode only
- Glassmorphism effects
- Gold gradients
- Rounded corners (16px standard)

---

## Tools for Creating Images

1. **Figma** (Free) - https://figma.com
2. **Canva** (Free) - https://canva.com
3. **DALL-E / Midjourney** - AI image generation
4. **Remove.bg** - Background removal

---

## Quick Placeholder Generation

If you need quick placeholders, use:

```bash
# Using ImageMagick (if installed)
convert -size 1024x1024 xc:#0F172A -fill "#FFD700" -gravity center -pointsize 72 -annotate 0 "oWi" icon.png
convert -size 200x200 xc:#0F172A -fill "#FFD700" -gravity center -pointsize 24 -annotate 0 "oWi" splash.png
convert -size 1200x630 xc:#0F172A -fill "#FFD700" -gravity center -pointsize 48 -annotate 0 "oWi AI" embed.png
```

Or use online placeholder services:
- https://placehold.co/1024x1024/0F172A/FFD700?text=oWi
- https://placehold.co/200x200/0F172A/FFD700?text=oWi
- https://placehold.co/1200x630/0F172A/FFD700?text=oWi+AI
