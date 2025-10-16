import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import { IBMTokenManager } from './ibm-token-manager.service.js';

dotenv.config();

/**
 * GraniteLLMService - IBM Granite API Integration with automatic token management
 * 
 * Handles communication with IBM Granite LLM for code generation
 */
export class GraniteLLMService {
  private tokenManager: IBMTokenManager;
  private apiEndpoint: string;
  private projectId: string;
  private modelId: string;

  constructor() {
    const apiKey = process.env['IBM_GRANITE_API_KEY'] || '';
    this.tokenManager = new IBMTokenManager(apiKey);
    this.apiEndpoint = process.env['IBM_GRANITE_ENDPOINT'] || 'https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29';
    this.projectId = process.env['IBM_GRANITE_PROJECT_ID'] || '';
    this.modelId = process.env['IBM_GRANITE_MODEL_ID'] || 'ibm/granite-3-8b-instruct';

    if (!apiKey) {
      console.warn('⚠️  IBM_GRANITE_API_KEY not found in .env file');
    }
    if (!this.projectId) {
      console.warn('⚠️  IBM_GRANITE_PROJECT_ID not found in .env file');
    }
  }

  /**
   * Generate code using IBM Granite LLM (Chat API)
   */
  public async generateCode(prompt: string, options: GenerationOptions = {}): Promise<GenerationResponse> {
    const {
      maxTokens = 4000,
      temperature = 0.2,
      systemPrompt = this.getDefaultSystemPrompt()
    } = options;

    try {
      // Get fresh access token
      const accessToken = await this.tokenManager.getAccessToken();

      // IBM Granite Chat API format
      const payload = {
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        project_id: this.projectId,
        model_id: this.modelId,
        max_tokens: maxTokens,
        temperature: temperature,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      };

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`IBM Granite API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as any;
      
      // Extract generated text from chat response
      const generatedText = data.choices?.[0]?.message?.content || '';
      
      return {
        success: true,
        generatedCode: generatedText,
        tokensUsed: data.usage?.total_tokens || 0,
        model: this.modelId,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Error calling IBM Granite API:', error);
      return {
        success: false,
        generatedCode: '',
        tokensUsed: 0,
        model: this.modelId,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate Angular component code from Figma design
   */
  public async generateAngularComponent(
    componentName: string,
    figmaData: any,
    brandCSSContext: string,
    existingCodeContext?: string
  ): Promise<ComponentGenerationResult> {
    
    const prompt = this.buildComponentPrompt(
      componentName,
      figmaData,
      brandCSSContext,
      existingCodeContext
    );

    const response = await this.generateCode(prompt, {
      maxTokens: 6000,
      temperature: 0.15, // Very low for strict adherence to CSS classes
      systemPrompt: this.getAngularSystemPrompt()
    });

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Code generation failed'
      };
    }

    // Parse the generated code into separate files
    const parsedCode = this.parseGeneratedCode(response.generatedCode);

    return {
      success: true,
      typescript: parsedCode.typescript,
      html: parsedCode.html,
      scss: parsedCode.scss,
      metadata: {
        componentName,
        generatedAt: response.timestamp,
        tokensUsed: response.tokensUsed,
        model: response.model
      }
    };
  }

  /**
   * Build comprehensive prompt for component generation
   */
  private buildComponentPrompt(
    componentName: string,
    figmaData: any,
    brandCSSContext: string,
    existingCodeContext?: string
  ): string {
    return `
# Task: Generate Angular Component from Figma Design

## Component Name: ${componentName}

## UPS Brand CSS (STRICTLY ENFORCE - USE ONLY THESE CLASSES):
${brandCSSContext}

${existingCodeContext ? `
## Existing Code Context (for consistency):
${existingCodeContext}
` : ''}

## Figma Design Data:
\`\`\`json
${JSON.stringify(figmaData, null, 2)}
\`\`\`

## Requirements:

1. **CSS USAGE - CRITICAL:**
   - ONLY use CSS classes from the UPS Brand CSS list above
   - DO NOT create any new CSS classes
   - DO NOT use inline styles
   - DO NOT write any SCSS code in the .scss file (leave it empty or minimal)

2. **Angular Best Practices:**
   - Use Angular 20 standalone component syntax
   - Use TypeScript with strict typing
   - Follow reactive patterns with signals if appropriate
   - Use proper lifecycle hooks

3. **Code Structure:**
   - Generate THREE separate files:
     * TypeScript component file (.ts)
     * HTML template file (.html)
     * SCSS file (.scss) - should be EMPTY or only contain component-specific overrides

4. **HTML Guidelines:**
   - Semantic HTML5 elements
   - Proper accessibility attributes (aria-labels, roles)
   - Use existing UPS brand utility classes extensively

## Output Format:

Please generate the code in this exact format:

\`\`\`typescript
// ${componentName}.component.ts
[TypeScript component code here]
\`\`\`

\`\`\`html
<!-- ${componentName}.component.html -->
[HTML template code here - USE ONLY UPS BRAND CSS CLASSES]
\`\`\`

\`\`\`scss
/* ${componentName}.component.scss */
/* Leave empty - use utility classes instead */
\`\`\`

---END---
`;
  }

  /**
   * Parse generated code into separate files
   */
  private parseGeneratedCode(generatedText: string): ParsedCode {
    const result: ParsedCode = {
      typescript: '',
      html: '',
      scss: ''
    };

    // Extract TypeScript code
    const tsMatch = generatedText.match(/```typescript\n([\s\S]*?)```/);
    if (tsMatch) {
      result.typescript = tsMatch[1].trim();
    }

    // Extract HTML code
    const htmlMatch = generatedText.match(/```html\n([\s\S]*?)```/);
    if (htmlMatch) {
      result.html = htmlMatch[1].trim();
    }

    // Extract SCSS code
    const scssMatch = generatedText.match(/```scss\n([\s\S]*?)```/);
    if (scssMatch) {
      result.scss = scssMatch[1].trim();
    }

    return result;
  }

  /**
   * Default system prompt for Angular code generation
   */
  private getAngularSystemPrompt(): string {
    return `You are an expert Angular developer specializing in converting Figma designs to Angular components.

CRITICAL RULES:
1. You MUST ONLY use CSS classes from the provided UPS Brand CSS list
2. NEVER create new CSS classes or use inline styles
3. Generate clean, production-ready Angular 20 code
4. Follow TypeScript best practices and strict typing
5. Ensure all generated HTML uses semantic elements
6. Make components accessible (ARIA labels, keyboard navigation)

You will be provided with:
- Figma design JSON data
- UPS Brand CSS approved classes list
- Optionally, existing code for context

Generate Angular components that perfectly match the Figma design using ONLY the approved CSS classes.`;
  }

  /**
   * Generic system prompt
   */
  private getDefaultSystemPrompt(): string {
    return `You are Granite, an AI language model developed by IBM. You are a cautious assistant. You carefully follow instructions. You are helpful and harmless and you follow ethical guidelines and promote positive behavior.`;
  }

  /**
   * Test connection to IBM Granite API
   */
  public async testConnection(): Promise<boolean> {
    try {
      const testResponse = await this.generateCode('Hello, this is a test. Respond with "OK".', {
        maxTokens: 50,
        temperature: 0.1
      });

      return testResponse.success;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Type Definitions
export interface GenerationOptions {
  maxTokens?: number;
  temperature?: number;
  stopSequences?: string[];
  systemPrompt?: string;
}

export interface GenerationResponse {
  success: boolean;
  generatedCode: string;
  tokensUsed: number;
  model: string;
  timestamp: string;
  error?: string;
}

export interface ComponentGenerationResult {
  success: boolean;
  typescript?: string;
  html?: string;
  scss?: string;
  metadata?: {
    componentName: string;
    generatedAt: string;
    tokensUsed: number;
    model: string;
  };
  error?: string;
}

export interface ParsedCode {
  typescript: string;
  html: string;
  scss: string;
}
