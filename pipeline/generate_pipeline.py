"""
Figma to Angular Code Generator with Browser Preview
Python Implementation

This module handles the complete pipeline:
1. Fetch Figma design data
2. Generate Angular code with IBM Granite LLM
3. Fix TypeScript properties automatically
4. Validate CSS against UPS brand guidelines
5. Copy to Angular app and update routes
6. Start dev server and open browser
7. Wait for user approval
"""

import os
import sys
import json
import re
import subprocess
import time
import webbrowser
import shutil
import stat
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
class Config:
    FIGMA_TOKEN = os.getenv('FIGMA_ACCESS_TOKEN')
    IBM_API_KEY = os.getenv('IBM_GRANITE_API_KEY')
    IBM_PROJECT_ID = os.getenv('IBM_GRANITE_PROJECT_ID', '0d4fb471-2d2f-4496-8a2c-bfb3567fdea1')
    IBM_ENDPOINT = 'https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29'
    IBM_IAM_ENDPOINT = 'https://iam.cloud.ibm.com/identity/token'
    MODEL_ID = 'ibm/granite-3-8b-instruct'
    
    # Paths
    BASE_DIR = Path(__file__).parent.parent  # Go up to project root
    PREVIEW_DIR = BASE_DIR / 'pipeline' / '.preview'
    COMPONENT_DIR = BASE_DIR / 'generated-app' / 'src' / 'app' / 'components'
    STYLES_PATH = BASE_DIR / 'pipeline' / 'brand-css' / 'ups-brand.scss'
    ROUTES_PATH = BASE_DIR / 'generated-app' / 'src' / 'app' / 'app.routes.ts'

# Colors for terminal output
class Colors:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    CYAN = '\033[96m'
    GRAY = '\033[90m'
    BOLD = '\033[1m'
    END = '\033[0m'

def log(message: str, color: Optional[str] = None):
    """Print colored log messages"""
    if color:
        color_code = getattr(Colors, color.upper(), '')
        print(f"{color_code}{message}{Colors.END}")
    else:
        print(message)

def header(title: str):
    """Print a formatted header"""
    border = '=' * 50
    print(f"\n{Colors.CYAN}{border}")
    print(f"  {title}")
    print(f"{border}{Colors.END}\n")

# ============================================================================
# STEP 1: Fetch Figma Design
# ============================================================================
def fetch_figma_node(file_key: str, node_id: str) -> Dict:
    """Fetch design data from Figma API"""
    log('📥 Step 1: Fetching Figma design data...', 'blue')
    
    # Convert node ID format (261-1272 → 261:1272)
    api_node_id = node_id.replace('-', ':')
    url = f"https://api.figma.com/v1/files/{file_key}/nodes?ids={api_node_id}"
    
    headers = {'X-Figma-Token': Config.FIGMA_TOKEN}
    response = requests.get(url, headers=headers, verify=False)
    
    if not response.ok:
        raise Exception(f"Figma API error: {response.status_code} - {response.text}")
    
    data = response.json()
    node = data['nodes'].get(api_node_id)
    
    if not node or 'document' not in node:
        raise Exception(f"Node {node_id} not found in Figma file")
    
    log(f'✓ Fetched node: {node_id}', 'green')
    return node['document']

# ============================================================================
# STEP 2: Load UPS Brand CSS
# ============================================================================
def load_brand_css() -> Dict[str, any]:
    """Load approved UPS brand CSS classes"""
    log('🎨 Step 2: Loading UPS Brand CSS...', 'blue')
    
    with open(Config.STYLES_PATH, 'r', encoding='utf-8') as f:
        css_content = f.read()
    
    # Extract all CSS classes
    class_matches = re.findall(r'\.([a-zA-Z0-9_-]+)', css_content)
    approved_classes = list(set(class_matches))
    
    log(f'✓ Brand CSS loaded: {len(approved_classes)} approved classes', 'green')
    
    return {
        'classes': approved_classes,
        'raw_css': css_content
    }

# ============================================================================
# STEP 3: Get IBM Access Token
# ============================================================================
def get_ibm_access_token() -> str:
    """Get IBM Cloud IAM access token"""
    log('🔑 Step 3: Getting IBM access token...', 'blue')
    
    data = {
        'grant_type': 'urn:ibm:params:oauth:grant-type:apikey',
        'apikey': Config.IBM_API_KEY
    }
    
    response = requests.post(Config.IBM_IAM_ENDPOINT, data=data, verify=False)
    
    if not response.ok:
        raise Exception(f"IBM IAM error: {response.status_code}")
    
    token = response.json()['access_token']
    log('✓ Access token obtained', 'green')
    return token

# ============================================================================
# STEP 4: Build Strict CSS Prompt
# ============================================================================
def build_strict_prompt(figma_node: Dict, brand_css: Dict, component_name: str) -> str:
    """Build prompt with strict CSS enforcement"""
    log('🧠 Step 4: Building prompt with STRICT CSS enforcement...', 'blue')
    
    figma_json = json.dumps(figma_node, indent=2)
    truncated_figma = figma_json[:5000] + '...' if len(figma_json) > 5000 else figma_json
    
    classes_str = ', '.join(brand_css['classes'])
    
    prompt = f"""You are an expert Angular developer. Generate a complete Angular standalone component from this Figma design.

🚨 CRITICAL SYSTEM CONSTRAINTS - VIOLATIONS WILL BREAK THE APPLICATION 🚨

This Angular project uses CUSTOM UPS BRAND CSS ONLY.
Tailwind CSS is NOT installed. Bootstrap is NOT installed.

❌ ABSOLUTELY FORBIDDEN CLASSES:
- h-screen, w-screen, min-h-screen
- text-lg, text-base, text-sm, text-xl
- py-2, px-4, p-8, m-4
- opacity-0 through opacity-100
- bg-gradient-to-*

✅ APPROVED CSS CLASSES - ONLY USE THESE {len(brand_css['classes'])} CLASSES:
{classes_str}

🎯 STRICT RULES:
1. If a CSS class is NOT in the approved list above → DO NOT USE IT
2. Need gradient? → Use inline style: [style]="'background: linear-gradient(...)'"
3. Need opacity? → Use inline style: [style]="'opacity: 0.6'"
4. Need sizing? → Use inline style: [style]="'width: 300px; height: 200px'"

FIGMA DESIGN DATA:
{truncated_figma}

COMPONENT NAME: {component_name}

Generate 3 files with proper Angular 20+ standalone component structure:

1. TypeScript Component (.ts):
   ✅ CORRECT IMPORTS:
   - import {{ Component }} from '@angular/core';
   - import {{ CommonModule }} from '@angular/common';
   
   ❌ FORBIDDEN IMPORTS (these will cause syntax errors):
   - DO NOT import: standalone, NgModule, Injector (unless actually needed)
   - standalone is a PROPERTY, not an import!
   
   ✅ CORRECT COMPONENT STRUCTURE:
   - Use standalone: true as a PROPERTY in @Component decorator
   - DO NOT mix standalone with @NgModule - choose one or the other
   - For this project: ALWAYS use standalone components
   
   ✅ METHODS & PROPERTIES:
   - If HTML has (click)="methodName()" → TypeScript MUST have methodName() {{}}
   - If HTML has {{propertyName}} → TypeScript MUST have propertyName property
   - Include ALL properties and methods referenced in HTML template
   
2. HTML Template (.html):
   - ONLY use approved UPS CSS classes from the list above
   - For ANY style not in approved list: use [style] attribute
   - Use Angular property binding: [style], [class]
   
3. SCSS Styles (.scss):
   - Should be MINIMAL or EMPTY (use global UPS classes)

Format your response EXACTLY like this:

```typescript
// TypeScript code here
// EXAMPLE CORRECT STRUCTURE:
// import {{ Component }} from '@angular/core';
// import {{ CommonModule }} from '@angular/common';
// 
// @Component({{
//   selector: 'app-{component_name}',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './{component_name}.component.html',
//   styleUrls: ['./{component_name}.component.scss']
// }})
// export class {component_name.title()}Component {{
//   // Include ALL methods used in template
//   onClick(): void {{
//     console.log('clicked');
//   }}
// }}
```

```html
<!-- HTML template here -->
```

```scss
/* SCSS styles here */
```

Generate clean, production-ready code now."""

    log('✓ Enhanced strict CSS prompt created', 'green')
    return prompt

# ============================================================================
# STEP 5: Generate Code with IBM Granite
# ============================================================================
def generate_with_granite(prompt: str, access_token: str) -> str:
    """Generate code using IBM Granite LLM"""
    log('🤖 Step 5: Generating code with IBM Granite LLM...', 'blue')
    
    request_body = {
        'messages': [{'role': 'user', 'content': prompt}],
        'project_id': Config.IBM_PROJECT_ID,
        'model_id': Config.MODEL_ID,
        'max_tokens': 6000,
        'temperature': 0.1
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }
    
    response = requests.post(Config.IBM_ENDPOINT, json=request_body, headers=headers, verify=False)
    
    if not response.ok:
        raise Exception(f"IBM Granite API error: {response.status_code} - {response.text}")
    
    generated_code = response.json()['choices'][0]['message']['content']
    log('✓ Code generated successfully', 'green')
    return generated_code

# ============================================================================
# STEP 6: Parse Generated Code
# ============================================================================
def parse_generated_code(generated_code: str) -> Dict[str, str]:
    """Parse TypeScript, HTML, and SCSS from generated code"""
    log('📦 Step 6: Parsing generated files...', 'blue')
    
    ts_match = re.search(r'```typescript\n(.*?)```', generated_code, re.DOTALL)
    html_match = re.search(r'```html\n(.*?)```', generated_code, re.DOTALL)
    scss_match = re.search(r'```scss\n(.*?)```', generated_code, re.DOTALL)
    
    files = {
        'typescript': ts_match.group(1).strip() if ts_match else '',
        'html': html_match.group(1).strip() if html_match else '',
        'scss': scss_match.group(1).strip() if scss_match else ''
    }
    
    log('✓ Files parsed successfully', 'green')
    return files

# ============================================================================
# STEP 6.5: Fix TypeScript Logic
# ============================================================================
def fix_typescript_logic(typescript: str, html: str) -> str:
    """Extract properties from HTML and inject into TypeScript"""
    log('🔧 Step 6.5: Analyzing HTML for missing TypeScript properties...', 'blue')
    
    # Extract property references from HTML
    referenced_properties = set()
    
    # Event bindings: (click)="prop = value"
    for match in re.finditer(r'\(click\)="(\w+)\s*=', html):
        referenced_properties.add(match.group(1))
    
    # *ngIf directives
    for match in re.finditer(r'\*ngIf="(\w+)', html):
        if match.group(1) not in ['style', 'class', 'src']:
            referenced_properties.add(match.group(1))
    
    # Toggle patterns: prop = !prop
    for match in re.finditer(r'(\w+)\s*=\s*!(\w+)', html):
        referenced_properties.add(match.group(1))
        referenced_properties.add(match.group(2))
    
    # Check which properties already exist in TypeScript
    existing_properties = set()
    for match in re.finditer(r'^\s*(\w+)\s*[:=]', typescript, re.MULTILINE):
        existing_properties.add(match.group(1))
    
    # Find missing properties
    missing_properties = referenced_properties - existing_properties - {'constructor'}
    
    if not missing_properties:
        log('✓ All properties already defined in TypeScript', 'green')
        return typescript
    
    log(f'⚠️  Found {len(missing_properties)} missing properties: {", ".join(missing_properties)}', 'yellow')
    
    # Inject missing properties
    class_match = re.search(r'export class \w+Component \{', typescript)
    if not class_match:
        log('⚠️  Could not find class declaration', 'yellow')
        return typescript
    
    # Generate property declarations
    property_declarations = []
    for prop in missing_properties:
        is_boolean = f'{prop} = !{prop}' in html or f'*ngIf="{prop}"' in html
        if is_boolean:
            property_declarations.append(f'  {prop}: boolean = false;')
        else:
            property_declarations.append(f'  {prop} = \'\';')
    
    # Insert properties after class declaration
    insertion_point = class_match.end()
    fixed_typescript = (
        typescript[:insertion_point] +
        '\n' + '\n'.join(property_declarations) + '\n' +
        typescript[insertion_point:]
    )
    
    log(f'✅ Added {len(missing_properties)} missing properties to TypeScript', 'green')
    return fixed_typescript

# ============================================================================
# STEP 7: Validate CSS
# ============================================================================
def validate_css_strict(html_content: str, approved_classes: List[str]) -> Dict:
    """Validate CSS classes against approved list"""
    log('🔍 Step 7: Validating CSS (STRICT MODE)...', 'yellow')
    
    # Extract all class names from HTML
    used_classes = set()
    for match in re.finditer(r'class="([^"]+)"', html_content):
        classes = match.group(1).split()
        used_classes.update(cls.strip() for cls in classes if cls.strip())
    
    # Check violations
    violations = [cls for cls in used_classes if cls not in approved_classes]
    
    result = {
        'total_classes': len(used_classes),
        'approved_count': len(used_classes) - len(violations),
        'violations': violations,
        'is_valid': len(violations) == 0
    }
    
    if result['is_valid']:
        log('✅ CSS Validation PASSED! All classes approved.', 'green')
    else:
        log(f'❌ CSS Validation FAILED! {len(violations)} unauthorized classes found:', 'red')
        for cls in violations:
            log(f'   - {cls}', 'red')
    
    return result

# ============================================================================
# STEP 8: Save to Preview Folder
# ============================================================================
def save_to_preview(component_name: str, files: Dict[str, str]) -> Dict[str, Path]:
    """Save generated files to preview folder"""
    log('💾 Step 8: Saving to preview folder...', 'blue')
    
    preview_path = Config.PREVIEW_DIR / component_name
    preview_path.mkdir(parents=True, exist_ok=True)
    
    file_paths = {
        'ts': preview_path / f'{component_name}.component.ts',
        'html': preview_path / f'{component_name}.component.html',
        'scss': preview_path / f'{component_name}.component.scss'
    }
    
    file_paths['ts'].write_text(files['typescript'], encoding='utf-8')
    file_paths['html'].write_text(files['html'], encoding='utf-8')
    file_paths['scss'].write_text(files['scss'], encoding='utf-8')
    
    log(f'✓ Preview files saved to: .preview/{component_name}/', 'green')
    return file_paths

# ============================================================================
# STEP 9: Update Routes
# ============================================================================
def update_routes(component_name: str):
    """Update app.routes.ts with new component"""
    log(f'🛣️  Step 9: Updating routes for {component_name}...', 'blue')
    
    routes_content = Config.ROUTES_PATH.read_text(encoding='utf-8')
    
    # Prepare import and route statements
    class_name = ''.join(word.capitalize() for word in component_name.split('-')) + 'Component'
    import_path = f'./components/{component_name}/{component_name}.component'
    
    import_statement = f"import {{ {class_name} }} from '{import_path}';"
    route_entry = f"{{ path: '{component_name}', component: {class_name} }}"
    
    # Check if already exists
    if import_statement in routes_content:
        log('⚠️  Import already exists, skipping route update', 'yellow')
        return
    
    # Add import after Routes import
    routes_import_match = re.search(r"(import \{ Routes \} from '@angular/router';)", routes_content)
    if routes_import_match:
        insert_pos = routes_import_match.end()
        routes_content = (
            routes_content[:insert_pos] +
            '\n' + import_statement +
            routes_content[insert_pos:]
        )
    
    # Add route entry
    routes_match = re.search(r'export const routes: Routes = \[(.*?)\];', routes_content, re.DOTALL)
    if routes_match:
        existing_routes = routes_match.group(1).strip()
        if existing_routes:
            new_routes = f'[\n  {route_entry},\n{existing_routes}\n]'
        else:
            new_routes = f'[\n  {route_entry}\n]'
        
        routes_content = re.sub(
            r'export const routes: Routes = \[.*?\];',
            f'export const routes: Routes = {new_routes};',
            routes_content,
            flags=re.DOTALL
        )
    
    Config.ROUTES_PATH.write_text(routes_content, encoding='utf-8')
    log(f'✅ Routes updated: /{component_name} → {class_name}', 'green')

# ============================================================================
# STEP 10: Copy to Generated App
# ============================================================================
def safe_remove_tree(path: Path, max_retries: int = 3):
    """Safely remove directory tree, handling Windows file locks"""
    import stat
    
    def handle_remove_readonly(func, path, exc):
        """Error handler for Windows readonly files"""
        if not os.access(path, os.W_OK):
            os.chmod(path, stat.S_IWUSR)
            func(path)
        else:
            raise
    
    for attempt in range(max_retries):
        try:
            if path.exists():
                shutil.rmtree(path, onerror=handle_remove_readonly)
            return True
        except PermissionError:
            if attempt < max_retries - 1:
                time.sleep(0.5)  # Wait for file locks to release
                continue
            else:
                # Last resort: rename and create new
                backup_path = path.parent / f'{path.name}_old_{int(time.time())}'
                try:
                    path.rename(backup_path)
                    log(f'⚠️  Could not delete {path.name}, renamed to {backup_path.name}', 'yellow')
                    return True
                except:
                    log(f'⚠️  Could not remove {path.name}, will overwrite files', 'yellow')
                    return False
    return False

def copy_to_generated_app(component_name: str) -> Path:
    """Copy component from preview to generated-app"""
    log('📁 Step 10: Copying to generated-app...', 'blue')
    
    src_path = Config.PREVIEW_DIR / component_name
    dest_path = Config.COMPONENT_DIR / component_name
    
    # Remove existing if present (Windows-safe)
    if dest_path.exists():
        safe_remove_tree(dest_path)
    
    # Ensure destination doesn't exist before copying
    if dest_path.exists():
        # Overwrite individual files if can't delete folder
        for src_file in src_path.rglob('*'):
            if src_file.is_file():
                rel_path = src_file.relative_to(src_path)
                dest_file = dest_path / rel_path
                dest_file.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src_file, dest_file)
    else:
        shutil.copytree(src_path, dest_path)
    
    log(f'✓ Copied to: generated-app/src/app/components/{component_name}/', 'green')
    return dest_path

# ============================================================================
# STEP 11: Check Server Running
# ============================================================================
def check_server_running() -> bool:
    """Check if dev server is running on localhost:4200"""
    try:
        response = requests.get('http://localhost:4200', timeout=2)
        return response.status_code == 200
    except:
        return False

# ============================================================================
# STEP 12: Wait for Server
# ============================================================================
def wait_for_server(max_wait: int = 120) -> bool:
    """Wait for dev server to be ready"""
    log('⏳ Waiting for dev server to start...', 'yellow')
    
    start_time = time.time()
    while time.time() - start_time < max_wait:
        if check_server_running():
            log('✅ Dev server is ready!', 'green')
            return True
        time.sleep(2)
        log('   Checking server...', 'gray')
    
    log('❌ Server failed to start within timeout', 'red')
    return False

# ============================================================================
# STEP 13: Setup Browser Preview
# ============================================================================
def setup_browser_preview(component_name: str) -> bool:
    """Setup browser preview automation"""
    log('🌐 Step 11: Setting up browser preview...', 'blue')
    
    # Copy component to generated-app
    copy_to_generated_app(component_name)
    
    # Update routes
    update_routes(component_name)
    
    # Check if server is running
    if check_server_running():
        log('✓ Dev server already running', 'green')
    else:
        log('🚀 Starting dev server in new PowerShell window...', 'yellow')
        
        # Start dev server in new window
        start_cmd = 'npm start'
        subprocess.Popen(
            ['powershell', '-Command', f'Start-Process powershell -ArgumentList \'-NoExit\', \'-Command\', \'cd "{Config.BASE_DIR / "generated-app"}"; {start_cmd}\''],
            cwd=Config.BASE_DIR / 'generated-app',
            shell=True
        )
        
        # Wait for server
        if not wait_for_server():
            return False
    
    # Open browser
    url = f'http://localhost:4200/{component_name}'
    log(f'🌐 Opening browser: {url}', 'cyan')
    webbrowser.open(url)
    
    log('✅ Browser preview ready!', 'green')
    return True

# ============================================================================
# STEP 14: Prompt for Approval
# ============================================================================
def prompt_for_approval() -> str:
    """Ask user to approve or reject the component"""
    header('USER APPROVAL REQUIRED')
    log('Please review the component in your browser.', 'cyan')
    log('', None)
    log('Options:', 'bold')
    log('  [A] Accept    - Copy to final location', 'green')
    log('  [R] Reject    - Discard and cleanup', 'red')
    log('  [G] Regenerate - Try generating again', 'yellow')
    log('', None)
    
    while True:
        choice = input(f'{Colors.CYAN}Your choice (A/R/G): {Colors.END}').strip().upper()
        if choice in ['A', 'R', 'G']:
            return choice
        log('Invalid choice. Please enter A, R, or G.', 'red')

# ============================================================================
# STEP 15: Cleanup on Reject
# ============================================================================
def cleanup_browser_preview(component_name: str):
    """Cleanup files on reject"""
    log('🧹 Cleaning up rejected component...', 'yellow')
    
    # Remove from generated-app (Windows-safe)
    dest_path = Config.COMPONENT_DIR / component_name
    if dest_path.exists():
        if safe_remove_tree(dest_path):
            log(f'✓ Removed from generated-app: {component_name}', 'green')
        else:
            log(f'⚠️  Could not fully remove {component_name}, but routes will be reverted', 'yellow')
    
    # Revert routes
    routes_content = Config.ROUTES_PATH.read_text(encoding='utf-8')
    class_name = ''.join(word.capitalize() for word in component_name.split('-')) + 'Component'
    import_statement = f"import {{ {class_name} }} from './components/{component_name}/{component_name}.component';"
    
    # Remove import
    routes_content = routes_content.replace('\n' + import_statement, '')
    
    # Remove route entry
    route_pattern = rf'\{{\s*path:\s*[\'"]{component_name}[\'"],\s*component:\s*{class_name}\s*\}},?\n?\s*'
    routes_content = re.sub(route_pattern, '', routes_content)
    
    Config.ROUTES_PATH.write_text(routes_content, encoding='utf-8')
    log('✓ Routes reverted', 'green')
    
    # Note: Dev server left running (user controls it)
    log('ℹ️  Dev server left running - you can stop it manually', 'gray')

# ============================================================================
# STEP 16: Handle Approval
# ============================================================================
def handle_approval(choice: str, component_name: str) -> str:
    """Handle user's approval choice"""
    if choice == 'A':
        log('✅ Component ACCEPTED! Files are already in final location.', 'green')
        return 'accepted'
    elif choice == 'R':
        cleanup_browser_preview(component_name)
        log('❌ Component REJECTED and cleaned up.', 'red')
        return 'rejected'
    else:  # 'G'
        cleanup_browser_preview(component_name)
        log('🔄 Component will be REGENERATED...', 'yellow')
        return 'regenerate'

# ============================================================================
# Main Pipeline Orchestrator
# ============================================================================
def run_pipeline(file_key: str, node_id: str, component_name: str):
    """Run the complete pipeline"""
    
    header(f'🚀 FIGMA TO ANGULAR CODE GENERATOR')
    log(f'File Key: {file_key}', 'cyan')
    log(f'Node ID: {node_id}', 'cyan')
    log(f'Component: {component_name}', 'cyan')
    
    try:
        # Validation
        if not all([Config.FIGMA_TOKEN, Config.IBM_API_KEY]):
            raise Exception('Missing required environment variables. Check .env file.')
        
        # STEP 1: Fetch Figma design
        figma_node = fetch_figma_node(file_key, node_id)
        
        # STEP 2: Load brand CSS
        brand_css = load_brand_css()
        
        # STEP 3: Get IBM token
        access_token = get_ibm_access_token()
        
        # STEP 4: Build prompt
        prompt = build_strict_prompt(figma_node, brand_css, component_name)
        
        # STEP 5: Generate code
        generated_code = generate_with_granite(prompt, access_token)
        
        # STEP 6: Parse files
        files = parse_generated_code(generated_code)
        
        # STEP 6.5: Fix TypeScript
        files['typescript'] = fix_typescript_logic(files['typescript'], files['html'])
        
        # STEP 7: Validate CSS
        css_validation = validate_css_strict(files['html'], brand_css['classes'])
        
        # STEP 8: Save to preview
        save_to_preview(component_name, files)
        
        # STEP 9-11: Browser preview
        preview_success = setup_browser_preview(component_name)
        
        if not preview_success:
            log('⚠️  Browser preview failed, but files are saved.', 'yellow')
        
        # STEP 12: User approval
        approval = prompt_for_approval()
        result = handle_approval(approval, component_name)
        
        if result == 'regenerate':
            log('🔄 Regenerating component...', 'yellow')
            run_pipeline(file_key, node_id, component_name)  # Recursive call
        else:
            header('✨ PIPELINE COMPLETE ✨')
            if result == 'accepted':
                log(f'Component location: generated-app/src/app/components/{component_name}/', 'green')
                log(f'Route: http://localhost:4200/{component_name}', 'cyan')
    
    except KeyboardInterrupt:
        log('\n\n⚠️  Pipeline interrupted by user', 'yellow')
        sys.exit(0)
    except Exception as e:
        log(f'\n\n❌ Pipeline error: {str(e)}', 'red')
        import traceback
        traceback.print_exc()
        sys.exit(1)

# ============================================================================
# CLI Entry Point
# ============================================================================
if __name__ == '__main__':
    if len(sys.argv) < 4:
        print(f"""
{Colors.BOLD}Usage:{Colors.END}
  python pipeline/generate_pipeline.py <file_key> <node_id> <component_name>

{Colors.BOLD}Example:{Colors.END}
  python pipeline/generate_pipeline.py 0eg3UmbqMcZtym1x8sGtZX 261-1272 home-page-test

{Colors.BOLD}Environment Variables Required:{Colors.END}
  FIGMA_ACCESS_TOKEN     - Your Figma API token
  IBM_GRANITE_API_KEY    - Your IBM Cloud API key
  IBM_GRANITE_PROJECT_ID - Your IBM Watson project ID (optional)

{Colors.BOLD}Before running:{Colors.END}
  1. Create .env file with credentials
  2. Install dependencies: pip install -r requirements.txt
  3. Ensure Angular app exists: generated-app/
        """)
        sys.exit(1)
    
    file_key = sys.argv[1]
    node_id = sys.argv[2]
    component_name = sys.argv[3]
    
    run_pipeline(file_key, node_id, component_name)
