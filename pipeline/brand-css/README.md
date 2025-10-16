# UPS Brand CSS

**MASTER SOURCE OF TRUTH** for all UPS brand-compliant CSS classes.

## 📋 Overview

This folder contains the definitive list of **53 approved CSS classes** that all generated components must use.

- **Master File**: `ups-brand.scss`
- **Total Classes**: 53
- **Copy Location**: `generated-app/src/styles.scss`

## 🔄 Keeping Files in Sync

After editing `ups-brand.scss`, you MUST sync it to the generated app:

```bash
# Option 1: Use the sync script
npm run sync-css

# Option 2: Manual copy
cp pipeline/brand-css/ups-brand.scss generated-app/src/styles.scss
```

⚠️ **IMPORTANT**: Always edit `pipeline/brand-css/ups-brand.scss`, NOT the generated-app copy!

## 📊 Class Categories

### 1. Text Colors (8 classes)
```scss
.text-ups-black     // #121212 - Primary text
.text-ups-white     // #FFFFFF - White text
.text-ups-gold      // #FFC400 - Gold accent
.text-ups-brown     // #351C15 - Dark brown
.text-ups-grey-1    // #5F5753 - Darkest grey
.text-ups-grey-2    // #8C857E - Dark grey
.text-ups-grey-3    // #BFB8AF - Medium grey
.text-ups-blue      // #0662BB - Blue accent
```

### 2. Background Colors (5 classes)
```scss
.bg-ups-black       // Black background
.bg-ups-white       // White background
.bg-ups-gold        // Gold background
.bg-ups-grey-4      // #DFDBD7 - Light grey
.bg-ups-grey-5      // #F2F1EF - Lightest grey
```

### 3. Typography (5 classes)
```scss
.font-roboto-light      // Font weight: 300
.font-roboto-regular    // Font weight: 400
.font-roboto-medium     // Font weight: 500
.font-roboto-bold       // Font weight: 700
.font-roboto-black      // Font weight: 900
```

### 4. Flexbox Layout (9 classes)
```scss
.flex                // display: flex
.flex-col            // flex-direction: column
.items-center        // align-items: center
.items-start         // align-items: flex-start
.justify-center      // justify-content: center
.justify-between     // justify-content: space-between
.gap-2               // gap: 8px
.gap-4               // gap: 16px
.gap-8               // gap: 32px
```

### 5. Positioning (3 classes)
```scss
.relative            // position: relative
.absolute            // position: absolute
.inset-0             // top: 0; right: 0; bottom: 0; left: 0
```

### 6. Sizing (3 classes)
```scss
.w-full              // width: 100%
.h-full              // height: 100%
.size-full           // width: 100%; height: 100%
```

### 7. Spacing (4 classes)
```scss
.p-4                 // padding: 16px
.px-4                // padding-left: 16px; padding-right: 16px
.py-4                // padding-top: 16px; padding-bottom: 16px
.m-0                 // margin: 0
```

### 8. Border Radius (3 classes)
```scss
.rounded             // border-radius: 4px
.rounded-lg          // border-radius: 8px
.rounded-full        // border-radius: 9999px
```

### 9. Shadows (2 classes)
```scss
.shadow              // Subtle shadow
.shadow-lg           // Large shadow
```

### 10. Effects (1 class)
```scss
.backdrop-blur       // backdrop-filter: blur(6px)
```

### 11. Cursor (1 class)
```scss
.cursor-pointer      // cursor: pointer
```

### 12. Text Utilities (3 classes)
```scss
.text-center         // text-align: center
.text-nowrap         // white-space: nowrap
.truncate            // Ellipsis overflow
```

### 13. Overflow (1 class)
```scss
.overflow-hidden     // overflow: hidden
```

### 14. Z-Index (2 classes)
```scss
.z-10                // z-index: 10
.z-20                // z-index: 20
```

## 🚫 What's NOT Allowed

The following are **STRICTLY FORBIDDEN** in generated components:

### ❌ Tailwind CSS Classes
- No `tw-*` classes
- No Tailwind utilities (even if they look similar)
- Reason: IBM Granite training bias causes it to default to Tailwind

### ❌ Custom CSS Classes
- No arbitrary class names
- No component-specific utility classes
- Exception: Component-scoped styles in `.component.scss` files are OK

### ❌ Inline Styles (mostly)
- Avoid inline styles when possible
- **Exception**: Use inline styles for:
  - Gradients (e.g., `background: linear-gradient(...)`)
  - Opacity overlays (e.g., `opacity: 0.8`)
  - Dynamic values from TypeScript

## ✅ Usage Guidelines

### Good Example ✅
```html
<div class="flex items-center justify-between bg-ups-white p-4">
  <h1 class="text-ups-black font-roboto-bold">UPS Tracking</h1>
  <button class="bg-ups-gold text-ups-black rounded cursor-pointer">
    Track
  </button>
</div>
```

### Bad Example ❌
```html
<!-- DON'T USE TAILWIND -->
<div class="tw-flex tw-items-center tw-bg-white">
  <h1 class="tw-text-black tw-font-bold">UPS Tracking</h1>
</div>

<!-- DON'T CREATE CUSTOM UTILITIES -->
<div class="my-custom-flex my-header">
  <h1 class="title-large">UPS Tracking</h1>
</div>
```

### Acceptable Inline Styles ✅
```html
<!-- Gradients - OK -->
<div [style.background]="'linear-gradient(180deg, #FFC400 0%, #351C15 100%)'">
  Content
</div>

<!-- Opacity overlays - OK -->
<div class="absolute inset-0 bg-ups-black" [style.opacity]="0.5">
  Overlay
</div>

<!-- Dynamic values from TypeScript - OK -->
<div [style.width.px]="dynamicWidth">
  Content
</div>
```

## 🔧 Pipeline Integration

The `generate-with-preview.mjs` script:
1. Reads this file to get approved classes
2. Validates generated code against this list
3. Rejects components with >7% non-compliant CSS
4. Provides detailed error messages

```javascript
// In generate-with-preview.mjs
const config = {
  stylesPath: path.join(__dirname, 'brand-css', 'ups-brand.scss'),
  // ...
}
```

## 📈 Compliance Metrics

Current achievement:
- **93% compliance** in generated components
- **53 approved classes** strictly enforced
- **0 Tailwind classes** in production code

Target:
- 95%+ compliance
- Expand to 60-70 classes as needed

## 🔄 Adding New Classes

To add a new approved class:

1. **Edit this file** (`ups-brand.scss`)
2. **Document it** in this README
3. **Update the count** (currently 53)
4. **Sync to generated-app**: `npm run sync-css`
5. **Update the LLM prompt** in `generate-with-preview.mjs`
6. **Test with a component** to verify
7. **Commit both files** together

## 📝 Version History

- **v1.0** (Oct 16, 2025) - Initial 53 classes
  - Separated from generated-app
  - Added comprehensive documentation
  - Established as single source of truth

## 🎯 Related Files

- **Master**: `pipeline/brand-css/ups-brand.scss` (this file)
- **Copy**: `generated-app/src/styles.scss` (used by Angular)
- **Validator**: `pipeline/generate-with-preview.mjs` (validates compliance)
- **Prompt**: `buildStrictPrompt()` function (trains LLM on these classes)

## 📚 Additional Resources

- [UPS Brand Guidelines](https://www.ups.com/brand)
- [CSS Validation Logic](../generate-with-preview.mjs#L300-L400)
- [Developer Guide](../../docs/guides/DEVELOPER_GUIDE.md)
