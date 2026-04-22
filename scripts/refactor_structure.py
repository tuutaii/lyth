import os
import re

PACKAGE_NAME = "lyth_astrology"
LIB_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "lib"))

def resolve_import(current_file_path, import_str):
    if import_str.startswith("package:") or import_str.startswith("dart:"):
        return import_str
    
    current_dir = os.path.dirname(current_file_path)
    # import_str: ../models/user.dart
    target_path = os.path.normpath(os.path.join(current_dir, import_str))
    
    # Check if inside lib
    if target_path.startswith(LIB_DIR):
        rel_path = os.path.relpath(target_path, LIB_DIR)
        # Convert backward slashes to forward slashes for Windows safety
        rel_path = rel_path.replace("\\", "/")
        return f"package:{PACKAGE_NAME}/{rel_path}"
    return import_str

def convert_to_absolute():
    for root, dirs, files in os.walk(LIB_DIR):
        for f in files:
            if f.endswith(".dart"):
                file_path = os.path.join(root, f)
                with open(file_path, "r", encoding="utf-8") as file:
                    content = file.read()
                
                # regex to find imports
                # import '../models/x.dart';
                # import 'dashboard/widgets/y.dart';
                def repl(match):
                    full_match = match.group(0)
                    import_path = match.group(1)
                    new_import = resolve_import(file_path, import_path)
                    return f"import '{new_import}'"
                
                new_content = re.sub(r"import\s+'([^']+)'", repl, content)
                
                if new_content != content:
                    with open(file_path, "w", encoding="utf-8") as file:
                        file.write(new_content)
                    print(f"Converted absolute imports in: {os.path.relpath(file_path, LIB_DIR)}")

import shutil

def restructure_project():
    # Target directories
    core_dir = os.path.join(LIB_DIR, "core")
    data_dir = os.path.join(LIB_DIR, "data")
    presentation_dir = os.path.join(LIB_DIR, "presentation")
    
    os.makedirs(core_dir, exist_ok=True)
    os.makedirs(data_dir, exist_ok=True)
    os.makedirs(presentation_dir, exist_ok=True)
    
    moves = {
        "theme": os.path.join(core_dir, "theme"),
        "models": os.path.join(data_dir, "models"),
        "services": os.path.join(data_dir, "services"),
        "screens": os.path.join(presentation_dir, "screens"),
        "widgets": os.path.join(presentation_dir, "widgets"),
        "viewmodels": os.path.join(presentation_dir, "blocs") # We will replace viewmodels with blocs
    }
    
    for src, dst in moves.items():
        src_path = os.path.join(LIB_DIR, src)
        if os.path.exists(src_path):
            shutil.move(src_path, dst)
            print(f"Moved {src} to {os.path.relpath(dst, LIB_DIR)}")

def update_package_imports():
    replacements = {
        f"package:{PACKAGE_NAME}/theme/": f"package:{PACKAGE_NAME}/core/theme/",
        f"package:{PACKAGE_NAME}/models/": f"package:{PACKAGE_NAME}/data/models/",
        f"package:{PACKAGE_NAME}/services/": f"package:{PACKAGE_NAME}/data/services/",
        f"package:{PACKAGE_NAME}/screens/": f"package:{PACKAGE_NAME}/presentation/screens/",
        f"package:{PACKAGE_NAME}/widgets/": f"package:{PACKAGE_NAME}/presentation/widgets/",
        f"package:{PACKAGE_NAME}/viewmodels/": f"package:{PACKAGE_NAME}/presentation/blocs/"
    }
    
    for root, dirs, files in os.walk(LIB_DIR):
        for f in files:
            if f.endswith(".dart"):
                file_path = os.path.join(root, f)
                with open(file_path, "r", encoding="utf-8") as file:
                    content = file.read()
                
                new_content = content
                for old, new in replacements.items():
                    new_content = new_content.replace(old, new)
                
                if new_content != content:
                    with open(file_path, "w", encoding="utf-8") as file:
                        file.write(new_content)
                    print(f"Updated package paths in: {os.path.relpath(file_path, LIB_DIR)}")

if __name__ == "__main__":
    print("1. Converting relative imports to absolute package imports...")
    convert_to_absolute()
    print("2. Moving directories to standard MVVM Clean structure...")
    restructure_project()
    print("3. Updating package import paths to match new directories...")
    update_package_imports()
    print("✅ Project structure standardisation complete.")
