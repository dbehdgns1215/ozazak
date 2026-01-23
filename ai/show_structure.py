"""
프로젝트 구조를 확인하는 스크립트
"""
import os
from pathlib import Path


def print_tree(directory, prefix="", max_depth=4, current_depth=0):
    """디렉토리 트리 출력"""
    if current_depth >= max_depth:
        return
    
    try:
        entries = sorted(Path(directory).iterdir(), key=lambda x: (not x.is_dir(), x.name))
    except PermissionError:
        return
    
    for i, entry in enumerate(entries):
        is_last = i == len(entries) - 1
        current_prefix = "└── " if is_last else "├── "
        print(f"{prefix}{current_prefix}{entry.name}")
        
        if entry.is_dir() and not entry.name.startswith('.') and entry.name not in ['__pycache__', 'venv', 'env']:
            extension_prefix = "    " if is_last else "│   "
            print_tree(entry, prefix + extension_prefix, max_depth, current_depth + 1)


if __name__ == "__main__":
    project_root = Path(__file__).parent
    print(f"\n프로젝트 구조: {project_root}\n")
    print(project_root.name + "/")
    print_tree(project_root)
