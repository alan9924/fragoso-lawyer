import os
import re

directories = [
    '/Users/alanfragosorivera/Desktop/FRAGOSO',
    '/Users/alanfragosorivera/Desktop/FRAGOSO/radar'
]

pattern = re.compile(
    r'\s*<li class="nav-group">\s*<button type="button" class="nav-group-btn" aria-expanded="false" aria-controls="nav-sub-he">\s*Herramientas gratis<span class="nav-chevron" aria-hidden="true"></span>\s*</button>\s*<ul class="nav-submenu" id="nav-sub-he">\s*<li><a href="([^"]*)">Calcular mi finiquito</a></li>\s*<li><a href="([^"]*)">Leer el Radar Legal</a></li>\s*</ul>\s*</li>'
)

def replacer(match):
    href_finiquito = match.group(1)
    href_radar = match.group(2)
    return f'\n                    <li><a href="{href_finiquito}" class="nav-top-link">Calculadora Laboral</a></li>\n                    <li><a href="{href_radar}" class="nav-top-link">Radar Legal</a></li>'

for d in directories:
    for filename in os.listdir(d):
        if filename.endswith('.html'):
            filepath = os.path.join(d, filename)
            with open(filepath, 'r') as f:
                content = f.read()
            
            original_content = content
            content = pattern.sub(replacer, content)
            
            if content != original_content:
                with open(filepath, 'w') as f:
                    f.write(content)
                print(f"Updated {filepath}")

print("Done.")
