import os
import re

directory = 'src'

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.css'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()

            new_content = content.replace('glass-panel', 'modern-card')
            new_content = new_content.replace('var(--primary)', 'var(--text-main)')
            new_content = new_content.replace('rgba(255,255,255,0.05)', 'var(--bg-card-hover)')
            new_content = new_content.replace('rgba(255, 255, 255, 0.05)', 'var(--bg-card-hover)')
            new_content = new_content.replace('rgba(255,255,255,0.1)', 'var(--border-color)')

            if new_content != content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
