import re

filepath = "/Users/alanfragosorivera/Desktop/FRAGOSO/index.html"
with open(filepath, "r") as f:
    content = f.read()

# Replace the old timeline-container with the new serious-list
new_list = """
        <div class="serious-list fade-in-up">
            <article class="serious-list-item">
                <div class="serious-list-num">1</div>
                <div class="serious-list-title">Elige y paga</div>
                <div class="serious-list-desc">Escoge tu servicio y paga en el momento, con precio cerrado. Sin cotizaciones a puerta cerrada, sin llamadas para ‘ver cuánto sale’. Precio transparente desde el clic.</div>
            </article>

            <article class="serious-list-item">
                <div class="serious-list-num">2</div>
                <div class="serious-list-title">Cuéntanos tu caso</div>
                <div class="serious-list-desc">Respondes unas preguntas simples, subes lo que aplique o eliges tu horario. Todo a tu ritmo, sin fricciones.</div>
            </article>

            <article class="serious-list-item">
                <div class="serious-list-num">3</div>
                <div class="serious-list-title">Un abogado entrega</div>
                <div class="serious-list-desc">Un abogado con cédula toma tu caso y te entrega la solución — documento, trámite, análisis o estrategia. Nunca un bot. Típicamente en 24-48 horas.</div>
            </article>
        </div>
"""

# Extract the part to replace using regex
pattern = re.compile(r'<div class="timeline-container">.*?</article>\s*</div>\s*</div>', re.DOTALL)
content = re.sub(pattern, new_list, content)

with open(filepath, "w") as f:
    f.write(content)

print("Refactored timeline in index.html")
