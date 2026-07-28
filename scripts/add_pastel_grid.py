import re

filepath = "/Users/alanfragosorivera/Desktop/FRAGOSO/index.html"
with open(filepath, "r") as f:
    content = f.read()

pastel_section = """
    <!-- ═══ SERVICIOS (PASTEL CARDS) ═══ -->
    <section class="services-section" style="padding: 100px 0;">
        <div class="wrap" style="max-width: 1080px; margin: 0 auto; padding: 0 24px;">
            <header class="sec-head fade-in-up">
                <span class="sec-eyebrow blur-fade">Nuestras áreas</span>
                <h2 class="sec-title blur-fade" data-bf-delay="1">Un despacho enfocado en <em>proteger tu empresa y tus creaciones</em>.</h2>
            </header>
            
            <div class="pastel-grid fade-in-up">
                <a href="marcas.html" class="pastel-card bg-sand">
                    <img src="icon_ip.png" alt="Propiedad Intelectual" class="icon-img" />
                    <h3>Propiedad Intelectual<br>y Derechos de Autor</h3>
                </a>
                
                <a href="contratos.html" class="pastel-card bg-sage">
                    <img src="icon_contracts.png" alt="Contratos" class="icon-img" />
                    <h3>Contratos Claros<br>y Estrategia Legal</h3>
                </a>
                
                <a href="empresa.html" class="pastel-card bg-lilac">
                    <img src="icon_empresa.png" alt="Corporate" class="icon-img" />
                    <h3>Consultoría Corporativa<br>y Blindaje de Negocios</h3>
                </a>

                <a href="radar/index.html" class="pastel-card bg-sky">
                    <img src="icon_radar.png" alt="Radar Legal" class="icon-img" />
                    <h3>Radar Legal:<br>Actualizaciones y Alertas</h3>
                </a>
            </div>
        </div>
    </section>
"""

# Insert before "Cómo funciona"
if "<!-- ═══ SERVICIOS (PASTEL CARDS) ═══ -->" not in content:
    content = content.replace("    <!-- ═══ HOW IT WORKS (INFOGRAPHIC) ═══ -->", pastel_section + "\n    <!-- ═══ HOW IT WORKS (INFOGRAPHIC) ═══ -->")

with open(filepath, "w") as f:
    f.write(content)

print("Added pastel grid to index.html")
