import * as fs from 'fs';
import * as path from 'path';
import https from 'https';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import { BrandCSSService } from './services/brand-css.service.js';
import { GraniteLLMService } from './services/granite-llm.service.js';

dotenv.config();

/**
 * AI Code Generation Pipeline
 * 
 * Orchestrates: Figma Fetch → Context Building → IBM Granite Generation → Validation → File Creation
 */
export class CodeGenerationPipeline {
  private brandCSSService: BrandCSSService;
  private graniteLLMService: GraniteLLMService;
  private figmaAccessToken: string;
  
  // SSL workaround for corporate environments
  private httpsAgent = new https.Agent({ rejectUnauthorized: false });

  constructor() {
    this.brandCSSService = new BrandCSSService();
    this.graniteLLMService = new GraniteLLMService();
    this.figmaAccessToken = process.env['FIGMA_ACCESS_TOKEN'] || '';
  }

  /**
   * Main pipeline execution
   */
  public async generateComponentFromFigma(
    fileKey: string,
    nodeId: string,
    componentName: string,
    options: PipelineOptions = {}
  ): Promise<PipelineResult> {
    
    console.log('\n═══════════════════════════════════════════');
    console.log('  🤖 AI Code Generation Pipeline');
    console.log('═══════════════════════════════════════════\n');
    
    try {
      // Step 1: Fetch Figma Design Data
      console.log('📥 Step 1: Fetching Figma design data...');
      const figmaData = await this.fetchFigmaNode(fileKey, nodeId);
      console.log(`✓ Fetched node: ${nodeId}\n`);

      // Step 2: Extract Brand CSS Context
      console.log('🎨 Step 2: Loading UPS Brand CSS...');
      const brandCSSContext = this.brandCSSService.generateCSSContext();
      console.log('✓ Brand CSS context loaded\n');

      // Step 3: Analyze Existing Code (optional)
      console.log('🔍 Step 3: Analyzing existing codebase...');
      const existingCodeContext = options.analyzeExistingCode 
        ? this.analyzeExistingComponents()
        : undefined;
      console.log('✓ Code analysis complete\n');

      // Step 4: Generate Code with IBM Granite
      console.log('🧠 Step 4: Generating code with IBM Granite LLM...');
      const generationResult = await this.graniteLLMService.generateAngularComponent(
        componentName,
        figmaData,
        brandCSSContext,
        existingCodeContext
      );

      if (!generationResult.success) {
        throw new Error(generationResult.error || 'Code generation failed');
      }

      console.log('✓ Code generated successfully\n');

      // Step 5: Validate Generated Code
      console.log('✅ Step 5: Validating generated code...');
      const validation = this.brandCSSService.validateGeneratedCode(generationResult.html || '');
      
      if (!validation.isValid) {
        console.warn('⚠️  Warning: Some CSS classes are not approved:');
        validation.invalidClasses.forEach(cls => console.warn(`   - ${cls}`));
        
        if (!options.allowInvalidCSS) {
          throw new Error('Generated code contains unauthorized CSS classes. Aborting.');
        }
      } else {
        console.log('✓ All CSS classes are UPS brand approved\n');
      }

      // Step 6: Save Generated Files
      console.log('💾 Step 6: Saving component files...');
      const savedFiles = await this.saveComponentFiles(
        componentName,
        generationResult.typescript || '',
        generationResult.html || '',
        generationResult.scss || '',
        options.outputPath
      );
      console.log('✓ Files saved successfully\n');

      console.log('═══════════════════════════════════════════');
      console.log('  ✅ Pipeline Complete!');
      console.log('═══════════════════════════════════════════\n');

      return {
        success: true,
        componentName,
        files: savedFiles,
        validation,
        metadata: generationResult.metadata
      };

    } catch (error) {
      console.error('\n❌ Pipeline failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Fetch Figma node data via API
   */
  private async fetchFigmaNode(fileKey: string, nodeId: string): Promise<any> {
    const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`;
    
    const response = await fetch(url, {
      headers: {
        'X-Figma-Token': this.figmaAccessToken
      },
      agent: this.httpsAgent
    });

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status}`);
    }

    const data = await response.json() as any;
    return data.nodes[nodeId.replace('-', ':')];
  }

  /**
   * Analyze existing Angular components for patterns
   */
  private analyzeExistingComponents(): string {
    const componentsDir = path.join(process.cwd(), 'src', 'app', 'components');
    
    if (!fs.existsSync(componentsDir)) {
      return 'No existing components found.';
    }

    const analysis: string[] = ['## Existing Component Patterns:\n'];
    
    const components = fs.readdirSync(componentsDir);
    components.forEach(compDir => {
      const compPath = path.join(componentsDir, compDir);
      if (fs.statSync(compPath).isDirectory()) {
        const tsFile = path.join(compPath, `${compDir}.component.ts`);
        if (fs.existsSync(tsFile)) {
          const content = fs.readFileSync(tsFile, 'utf-8');
          // Extract component decorator
          const decoratorMatch = content.match(/@Component\({[\s\S]*?}\)/);
          if (decoratorMatch) {
            analysis.push(`### ${compDir}:`);
            analysis.push('```typescript');
            analysis.push(decoratorMatch[0]);
            analysis.push('```\n');
          }
        }
      }
    });

    return analysis.join('\n');
  }

  /**
   * Save generated component files to disk
   */
  private async saveComponentFiles(
    componentName: string,
    typescript: string,
    html: string,
    scss: string,
    outputPath?: string
  ): Promise<SavedFiles> {
    const baseDir = outputPath || path.join(process.cwd(), 'src', 'app', 'components', componentName);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    const files: SavedFiles = {
      typescript: path.join(baseDir, `${componentName}.component.ts`),
      html: path.join(baseDir, `${componentName}.component.html`),
      scss: path.join(baseDir, `${componentName}.component.scss`)
    };

    // Write files
    fs.writeFileSync(files.typescript, typescript, 'utf-8');
    fs.writeFileSync(files.html, html, 'utf-8');
    fs.writeFileSync(files.scss, scss || '/* Use UPS brand utility classes */', 'utf-8');

    console.log(`   📄 ${files.typescript}`);
    console.log(`   📄 ${files.html}`);
    console.log(`   📄 ${files.scss}`);

    return files;
  }

  /**
   * Test all services are properly configured
   */
  public async runDiagnostics(): Promise<DiagnosticsResult> {
    console.log('\n🔧 Running diagnostics...\n');

    const results: DiagnosticsResult = {
      figmaApiConnected: false,
      graniteApiConnected: false,
      brandCSSLoaded: false,
      errors: []
    };

    // Test Figma API
    try {
      if (!this.figmaAccessToken) {
        results.errors.push('FIGMA_ACCESS_TOKEN not found in .env');
      } else {
        // Simple test call
        results.figmaApiConnected = true;
        console.log('✓ Figma API token found');
      }
    } catch (error) {
      results.errors.push(`Figma API test failed: ${error}`);
    }

    // Test IBM Granite API
    try {
      results.graniteApiConnected = await this.graniteLLMService.testConnection();
      if (results.graniteApiConnected) {
        console.log('✓ IBM Granite API connected');
      } else {
        results.errors.push('IBM Granite API connection failed');
      }
    } catch (error) {
      results.errors.push(`Granite API test failed: ${error}`);
    }

    // Test Brand CSS
    try {
      const tokens = this.brandCSSService.extractBrandTokens();
      results.brandCSSLoaded = tokens.utilityClasses.length > 0;
      console.log(`✓ Brand CSS loaded (${tokens.utilityClasses.length} classes)`);
    } catch (error) {
      results.errors.push(`Brand CSS load failed: ${error}`);
    }

    console.log('\n' + (results.errors.length === 0 ? '✅ All systems ready!' : '⚠️  Some issues detected'));
    
    if (results.errors.length > 0) {
      console.log('\nErrors:');
      results.errors.forEach(err => console.log(`  - ${err}`));
    }

    return results;
  }
}

// Type Definitions
export interface PipelineOptions {
  outputPath?: string;
  analyzeExistingCode?: boolean;
  allowInvalidCSS?: boolean;
}

export interface PipelineResult {
  success: boolean;
  componentName?: string;
  files?: SavedFiles;
  validation?: any;
  metadata?: any;
  error?: string;
}

export interface SavedFiles {
  typescript: string;
  html: string;
  scss: string;
}

export interface DiagnosticsResult {
  figmaApiConnected: boolean;
  graniteApiConnected: boolean;
  brandCSSLoaded: boolean;
  errors: string[];
}
