import os
import re

directories = [
    '/Users/alanfragosorivera/Desktop/FRAGOSO',
    '/Users/alanfragosorivera/Desktop/FRAGOSO/radar'
]

# Patterns to remove
patterns = [
    # Empresas in nav-links
    re.compile(r'\s*<!-- 1 solo destino => enlace directo, sin desplegable -->\n\s*<li><a href="[^"]*empresas\.html" class="nav-top-link">Empresas</a></li>'),
    re.compile(r'\s*<li><a href="[^"]*empresas\.html" class="nav-top-link">Empresas</a></li>'),
    
    # Socios in nav-mobile-only
    re.compile(r'\s*<!-- Visibles solo en el panel movil \(en escritorio viven a la derecha\) -->\n\s*<li class="nav-mobile-only"><a href="[^"]*#socios" class="nav-top-link">Socios</a></li>'),
    re.compile(r'\s*<li class="nav-mobile-only"><a href="[^"]*#socios" class="nav-top-link">Socios</a></li>'),
    
    # Socios in nav-actions
    re.compile(r'\s*<a href="[^"]*#socios" class="nav-socios-link">Socios</a>')
]

for d in directories:
    for filename in os.listdir(d):
        if filename.endswith('.html'):
            filepath = os.path.join(d, filename)
            with open(filepath, 'r') as f:
                content = f.read()
            
            original_content = content
            for p in patterns:
                content = p.sub('', content)
            
            if content != original_content:
                with open(filepath, 'w') as f:
                    f.write(content)
                print(f"Updated {filepath}")

print("Done.")
