import os
import glob
import re

html_files = glob.glob('/Users/alanfragosorivera/Desktop/FRAGOSO/*.html')

nav_link_pattern = re.compile(
    r'<li><a href="propiedad-intelectual\.html" class="nav-top-link"(.*?)>Propiedad intelectual</a></li>'
)

nav_replacement = r'''<li class="nav-group">
                        <button type="button" class="nav-group-btn" aria-expanded="false" aria-controls="nav-sub-pi"\1>
                            Propiedad intelectual<span class="nav-chevron" aria-hidden="true"></span>
                        </button>
                        <ul class="nav-submenu" id="nav-sub-pi">
                            <li><a href="propiedad-intelectual.html">Ver todo</a></li>
                            <li><a href="marcas.html">Registro de marca</a></li>
                            <li><a href="derechos-autor.html">Derechos de autor</a></li>
                            <li><a href="secreto-industrial.html">Secreto industrial</a></li>
                        </ul>
                    </li>'''

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = nav_link_pattern.sub(nav_replacement, content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {file_path}')

# 2. Add 3rd card in propiedad-intelectual.html
pi_path = '/Users/alanfragosorivera/Desktop/FRAGOSO/propiedad-intelectual.html'
with open(pi_path, 'r', encoding='utf-8') as f:
    pi_content = f.read()

card_3 = """                <!-- CARD 3: Secreto Industrial -->
                <a href="secreto-industrial.html" class="pi-card" style="background-color: #f7ede2; border-radius: 20px; padding: 3rem 2.5rem; text-decoration: none; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; position: relative;">
                    <div class="pi-card-bg-letter">S</div>
                    <div class="pi-card-content">
                        <h3 style="font-size: 2rem; font-weight: 600; color: #111; margin-bottom: 1rem; font-family: var(--font-body); letter-spacing: -0.5px;">Secreto industrial</h3>
                        <p style="font-size: 1.05rem; color: #333; line-height: 1.6; margin-bottom: 0;">Lo que nadie más sabe hacer en tu empresa, se blinda distinto. Diagnostica y protege fórmulas, algoritmos, o estrategias de negocio mediante confidencialidad legalmente oponible.</p>
                    </div>
                </a>
"""

if '<!-- CARD 3: Secreto Industrial -->' not in pi_content:
    pi_content = pi_content.replace('            </div>\n\n            <!-- FRANQUICIAR -->', f'{card_3}            </div>\n\n            <!-- FRANQUICIAR -->')
    with open(pi_path, 'w', encoding='utf-8') as f:
        f.write(pi_content)
    print("Added card 3 to propiedad-intelectual.html")

