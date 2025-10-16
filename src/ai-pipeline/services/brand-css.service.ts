import * as fs from 'fs';
import * as path from 'path';

/**
 * BrandCSSService - Immutable UPS Brand CSS Parser
 * 
 * CRITICAL: This service treats src/styles.scss as SACRED.
 * It extracts the existing CSS classes and enforces their usage in generated code.
 * NO MODIFICATIONS to styles.scss are ever allowed.
 */
export class BrandCSSService {
  private stylesPath: string;
  private brandTokens: BrandTokens | null = null;

  constructor() {
    this.stylesPath = path.join(process.cwd(), 'src', 'styles.scss');
  }

  /**
   * Parse and extract all UPS brand tokens from styles.scss
   * Returns an immutable reference to approved CSS classes
   */
  public extractBrandTokens(): BrandTokens {
    if (this.brandTokens) {
      return this.brandTokens;
    }

    const scssContent = fs.readFileSync(this.stylesPath, 'utf-8');
    
    this.brandTokens = {
      colors: this.extractColors(scssContent),
      typography: this.extractTypography(scssContent),
      spacing: this.extractSpacing(scssContent),
      utilityClasses: this.extractUtilityClasses(scssContent),
      layout: this.extractLayoutClasses(scssContent),
      metadata: {
        sourceFile: 'src/styles.scss',
        extractedAt: new Date().toISOString(),
        isImmutable: true,
        warning: 'DO NOT MODIFY styles.scss - Use existing classes only'
      }
    };

    return this.brandTokens;
  }

  /**
   * Extract CSS custom properties (--ups-* variables)
   */
  private extractColors(content: string): ColorTokens {
    const colorRegex = /--ups-([\w-]+):\s*(#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3});/g;
    const colors: ColorTokens = {
      cssVariables: {},
      textClasses: [],
      backgroundClasses: []
    };

    let match;
    while ((match = colorRegex.exec(content)) !== null) {
      const colorName = match[1];
      const colorValue = match[2];
      colors.cssVariables[`--ups-${colorName}`] = colorValue;
    }

    // Extract utility classes
    const textColorRegex = /\.text-ups-([\w-]+)/g;
    while ((match = textColorRegex.exec(content)) !== null) {
      colors.textClasses.push(`text-ups-${match[1]}`);
    }

    const bgColorRegex = /\.bg-ups-([\w-]+)/g;
    while ((match = bgColorRegex.exec(content)) !== null) {
      colors.backgroundClasses.push(`bg-ups-${match[1]}`);
    }

    return colors;
  }

  /**
   * Extract typography classes (Roboto font weights)
   */
  private extractTypography(content: string): TypographyTokens {
    const fontWeightRegex = /\.font-roboto-([\w-]+)\s*{\s*font-weight:\s*(\d+);/g;
    const typography: TypographyTokens = {
      fontFamily: 'Roboto',
      weights: {},
      classes: []
    };

    let match;
    while ((match = fontWeightRegex.exec(content)) !== null) {
      const weightName = match[1];
      const weightValue = parseInt(match[2]);
      typography.weights[weightName] = weightValue;
      typography.classes.push(`font-roboto-${weightName}`);
    }

    return typography;
  }

  /**
   * Extract spacing tokens (gap, padding, margin)
   */
  private extractSpacing(content: string): SpacingTokens {
    const spacing: SpacingTokens = {
      gap: {},
      padding: {},
      margin: {}
    };

    // Gap utilities
    const gapRegex = /\.gap-(\d+)\s*{\s*gap:\s*(\d+)px;/g;
    let match;
    while ((match = gapRegex.exec(content)) !== null) {
      spacing.gap[`gap-${match[1]}`] = `${match[2]}px`;
    }

    // Padding utilities
    const paddingRegex = /\.(p[xy]?-\d+)\s*{\s*padding(-\w+)?:\s*(\d+)px;/g;
    while ((match = paddingRegex.exec(content)) !== null) {
      spacing.padding[match[1]] = match[3] + 'px';
    }

    // Margin utilities
    const marginRegex = /\.m-(\d+)\s*{\s*margin:\s*(\d+);/g;
    while ((match = marginRegex.exec(content)) !== null) {
      spacing.margin[`m-${match[1]}`] = match[2];
    }

    return spacing;
  }

  /**
   * Extract all utility classes
   */
  private extractUtilityClasses(content: string): string[] {
    const utilityClasses: string[] = [];
    
    // Match all class definitions
    const classRegex = /\.([\w-]+)\s*{/g;
    let match;
    
    while ((match = classRegex.exec(content)) !== null) {
      const className = match[1];
      // Exclude :root and complex selectors
      if (!className.includes(':') && !className.includes('[')) {
        utilityClasses.push(className);
      }
    }

    return [...new Set(utilityClasses)].sort();
  }

  /**
   * Extract layout/flexbox classes
   */
  private extractLayoutClasses(content: string): LayoutTokens {
    return {
      flexbox: [
        'flex', 'flex-col', 'items-center', 'items-start',
        'justify-center', 'justify-between'
      ],
      positioning: ['relative', 'absolute', 'inset-0'],
      sizing: ['w-full', 'h-full', 'size-full'],
      borderRadius: ['rounded', 'rounded-lg', 'rounded-full'],
      shadows: ['shadow', 'shadow-lg'],
      misc: ['backdrop-blur', 'cursor-pointer', 'text-center', 
             'text-nowrap', 'truncate', 'overflow-hidden']
    };
  }

  /**
   * Generate LLM-friendly documentation of available CSS classes
   */
  public generateCSSContext(): string {
    const tokens = this.extractBrandTokens();
    
    return `
# UPS BRAND CSS GUIDELINES - STRICT ENFORCEMENT

⚠️ CRITICAL RULES:
1. You MUST ONLY use the CSS classes listed below
2. NEVER create new CSS classes or inline styles
3. NEVER modify src/styles.scss
4. All styling must use existing utility classes

## Available Colors

### CSS Variables:
${Object.entries(tokens.colors.cssVariables).map(([name, value]) => `- ${name}: ${value}`).join('\n')}

### Text Color Classes:
${tokens.colors.textClasses.map(c => `- ${c}`).join('\n')}

### Background Color Classes:
${tokens.colors.backgroundClasses.map(c => `- ${c}`).join('\n')}

## Typography

Font Family: ${tokens.typography.fontFamily}

### Font Weight Classes:
${tokens.typography.classes.map(c => `- ${c}`).join('\n')}

## Spacing

### Gap Classes:
${Object.keys(tokens.spacing.gap).map(c => `- ${c}`).join('\n')}

### Padding Classes:
${Object.keys(tokens.spacing.padding).map(c => `- ${c}`).join('\n')}

## Layout Classes

### Flexbox:
${tokens.layout.flexbox.map(c => `- ${c}`).join('\n')}

### Positioning:
${tokens.layout.positioning.map(c => `- ${c}`).join('\n')}

### Sizing:
${tokens.layout.sizing.map(c => `- ${c}`).join('\n')}

### Border Radius:
${tokens.layout.borderRadius.map(c => `- ${c}`).join('\n')}

### Shadows:
${tokens.layout.shadows.map(c => `- ${c}`).join('\n')}

### Miscellaneous:
${tokens.layout.misc.map(c => `- ${c}`).join('\n')}

## All Available Utility Classes (Complete List):
${tokens.utilityClasses.map(c => `- ${c}`).join('\n')}

---

REMINDER: These are the ONLY approved classes. Do not deviate.
`;
  }

  /**
   * Validate that generated code only uses approved CSS classes
   */
  public validateGeneratedCode(htmlCode: string): ValidationResult {
    const tokens = this.extractBrandTokens();
    const allApprovedClasses = new Set(tokens.utilityClasses);
    
    // Extract class attributes from HTML
    const classRegex = /class="([^"]+)"/g;
    const foundClasses: string[] = [];
    const invalidClasses: string[] = [];
    
    let match;
    while ((match = classRegex.exec(htmlCode)) !== null) {
      const classes = match[1].split(/\s+/);
      classes.forEach(cls => {
        foundClasses.push(cls);
        if (!allApprovedClasses.has(cls)) {
          invalidClasses.push(cls);
        }
      });
    }

    return {
      isValid: invalidClasses.length === 0,
      invalidClasses,
      foundClasses: [...new Set(foundClasses)],
      message: invalidClasses.length > 0
        ? `Found ${invalidClasses.length} unauthorized CSS classes. Only use approved UPS brand classes.`
        : 'All CSS classes are approved UPS brand classes.'
    };
  }
}

// Type Definitions
export interface BrandTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  utilityClasses: string[];
  layout: LayoutTokens;
  metadata: {
    sourceFile: string;
    extractedAt: string;
    isImmutable: boolean;
    warning: string;
  };
}

export interface ColorTokens {
  cssVariables: Record<string, string>;
  textClasses: string[];
  backgroundClasses: string[];
}

export interface TypographyTokens {
  fontFamily: string;
  weights: Record<string, number>;
  classes: string[];
}

export interface SpacingTokens {
  gap: Record<string, string>;
  padding: Record<string, string>;
  margin: Record<string, string>;
}

export interface LayoutTokens {
  flexbox: string[];
  positioning: string[];
  sizing: string[];
  borderRadius: string[];
  shadows: string[];
  misc: string[];
}

export interface ValidationResult {
  isValid: boolean;
  invalidClasses: string[];
  foundClasses: string[];
  message: string;
}
