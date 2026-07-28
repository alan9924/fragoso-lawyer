import re

with open('home-new.css', 'r') as f:
    content = f.read()

old_vars = r""":root {
    --tl-bg: #ffffff;
    --tl-text-main: #111827;
    --tl-text-muted: #4b5563;
    --tl-track-bg: #e5e7eb;
    --tl-primary: #2563eb;       
    --tl-primary-light: #eff6ff; 
    --tl-icon-idle: #93c5fd;     
    --tl-shadow: rgba\(37, 99, 235, 0.15\);
    --tl-font: var\(--font-body\), 'Inter', system-ui, sans-serif;
}"""

new_vars = """:root {
    --tl-bg: #f6f5f3;
    --tl-text-main: #1a1917;
    --tl-text-muted: #54534f;
    --tl-track-bg: #d5ccbf;
    --tl-primary: #1a1917;       
    --tl-primary-light: #eae8e3; 
    --tl-icon-idle: #b5b3ae;     
    --tl-shadow: rgba(26, 25, 23, 0.08);
    --tl-font: var(--font-body), 'Inter', system-ui, sans-serif;
}"""

content = re.sub(old_vars, new_vars, content)

with open('home-new.css', 'w') as f:
    f.write(content)

print("CSS variables updated")
