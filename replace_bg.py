import re

file_path = '/Users/alanfragosorivera/Desktop/FRAGOSO/empresa-operacion.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Change background of mercu-section
content = content.replace('background-color: #112a1e;', 'background-color: #ffffff;')
# Change color of title
content = content.replace('.mercu-title {\n    text-align: center;\n    font-family: var(--font-heading), serif;\n    font-size: clamp(2rem, 5vw, 2.8rem);\n    color: #fff;', '.mercu-title {\n    text-align: center;\n    font-family: var(--font-heading), serif;\n    font-size: clamp(2rem, 5vw, 2.8rem);\n    color: #111;')
# Change color of header
content = content.replace('.mercu-header {\n    text-align: center;\n    font-size: 1.6rem;\n    font-weight: 700;\n    margin-bottom: 1.5rem;\n    font-family: var(--font-heading), serif;\n    color: #fff;', '.mercu-header {\n    text-align: center;\n    font-size: 1.6rem;\n    font-weight: 700;\n    margin-bottom: 1.5rem;\n    font-family: var(--font-heading), serif;\n    color: #111;')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced background colors")
