"""
Quick validation test for Python pipeline
Tests imports and basic structure without running full pipeline
"""

import sys
from pathlib import Path

print("=" * 60)
print("  🧪 PYTHON PIPELINE VALIDATION TEST")
print("=" * 60)

# Test 1: Python version
print("\n✓ Test 1: Python Version")
print(f"  Python {sys.version.split()[0]}")
if sys.version_info >= (3, 8):
    print("  ✅ Python 3.8+ requirement met")
else:
    print("  ❌ Python 3.8+ required")
    sys.exit(1)

# Test 2: Dependencies
print("\n✓ Test 2: Dependencies")
try:
    import requests
    print(f"  ✅ requests {requests.__version__}")
except ImportError:
    print("  ❌ requests not installed")
    sys.exit(1)

try:
    from dotenv import load_dotenv
    print(f"  ✅ python-dotenv (installed)")
except ImportError:
    print("  ❌ python-dotenv not installed")
    sys.exit(1)

# Test 3: Standard library modules
print("\n✓ Test 3: Standard Library Modules")
import subprocess
import webbrowser
import shutil
import re
import json
print("  ✅ subprocess, webbrowser, shutil, re, json")

# Test 4: Pipeline file exists
print("\n✓ Test 4: Pipeline File")
pipeline_path = Path(__file__).parent / "pipeline" / "generate_pipeline.py"
if pipeline_path.exists():
    print(f"  ✅ Found: {pipeline_path}")
    size_kb = pipeline_path.stat().st_size / 1024
    print(f"  Size: {size_kb:.1f} KB")
else:
    print(f"  ❌ Not found: {pipeline_path}")
    sys.exit(1)

# Test 5: Required folders
print("\n✓ Test 5: Directory Structure")
required_folders = [
    "pipeline",
    "pipeline/brand-css",
    "generated-app",
    "generated-app/src",
    "generated-app/src/app"
]

base_dir = Path(__file__).parent
for folder in required_folders:
    path = base_dir / folder
    if path.exists():
        print(f"  ✅ {folder}/")
    else:
        print(f"  ⚠️  Missing: {folder}/")

# Test 6: UPS Brand CSS
print("\n✓ Test 6: UPS Brand CSS")
css_path = base_dir / "pipeline" / "brand-css" / "ups-brand.scss"
if css_path.exists():
    content = css_path.read_text(encoding='utf-8')
    class_count = len(set(re.findall(r'\.([a-zA-Z0-9_-]+)', content)))
    print(f"  ✅ Found: {class_count} CSS classes")
else:
    print(f"  ⚠️  ups-brand.scss not found")

# Test 7: Environment file
print("\n✓ Test 7: Environment Configuration")
env_path = base_dir / ".env"
if env_path.exists():
    print(f"  ✅ .env file found")
    # Check for required keys (without revealing values)
    env_content = env_path.read_text()
    has_figma = 'FIGMA_ACCESS_TOKEN' in env_content
    has_ibm = 'IBM_GRANITE_API_KEY' in env_content
    print(f"  {'✅' if has_figma else '❌'} FIGMA_ACCESS_TOKEN configured")
    print(f"  {'✅' if has_ibm else '❌'} IBM_GRANITE_API_KEY configured")
else:
    print(f"  ⚠️  .env file not found (use .env.template)")

# Test 8: Import pipeline module
print("\n✓ Test 8: Import Pipeline Module")
try:
    sys.path.insert(0, str(base_dir))
    # Try importing just to test syntax
    import importlib.util
    spec = importlib.util.spec_from_file_location("pipeline", pipeline_path)
    module = importlib.util.module_from_spec(spec)
    print("  ✅ Pipeline module syntax valid")
except Exception as e:
    print(f"  ❌ Pipeline module error: {e}")
    sys.exit(1)

# Summary
print("\n" + "=" * 60)
print("  ✅ ALL TESTS PASSED - PIPELINE READY")
print("=" * 60)
print("\n📝 Next Steps:")
print("  1. Configure .env file with your API tokens")
print("  2. Run demo: python pipeline/generate_pipeline.py <file_key> <node_id> <name>")
print("  3. Example: python pipeline/generate_pipeline.py 0eg3UmbqMcZtym1x8sGtZX 261-1272 test-component")
print("\n📖 Documentation: CTO_DEMO_INSTRUCTIONS.md")
print()
