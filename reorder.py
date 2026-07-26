import re

with open('index.html', 'r') as f:
    content = f.read()

pattern = re.compile(
    r'(<!-- ═══ 3\. TESTIMONIOS ═══ -->.*?</section>\s*)'
    r'(<!-- ═══ 4\. EMPRESAS ═══ -->.*?</section>\s*)'
    r'(<!-- ═══ 5\. SOCIOS — pieza de confianza ═══ -->.*?</section>\s*)',
    re.DOTALL
)

def replacer(match):
    test_block = match.group(1)
    emp_block = match.group(2)
    soc_block = match.group(3)
    
    return emp_block + soc_block + test_block

new_content = pattern.sub(replacer, content)

if new_content != content:
    with open('index.html', 'w') as f:
        f.write(new_content)
    print("Sections reordered successfully!")
else:
    print("No changes made. Pattern might not have matched.")
