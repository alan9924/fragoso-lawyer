import re

file_path = '/Users/alanfragosorivera/Desktop/FRAGOSO/secreto-industrial.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Generate new body content
new_body = """    <!-- ═══ EDITORIAL LAYOUT ═══ -->
    <main class="da-hero-container">
        <div class="da-hero-left">
            <h1 class="da-hero-title">Lo que nadie más sabe hacer en tu empresa, es tuyo solo si puedes probarlo.</h1>
            <p class="da-hero-desc">Tu ventaja competitiva no siempre se puede registrar. Las fórmulas, procesos o estrategias que te hacen único requieren un blindaje interno para considerarse secretos industriales protegidos por la ley.</p>
            <a href="#precios" class="da-hero-btn">BLINDAR MI SECRETO</a>
        </div>
        <div class="da-hero-right">
            <img src="lamp_document_line_art.png" alt="Secreto Industrial" class="da-hero-img">
        </div>
    </main>

    <!-- ═══ INTRO — QUÉ ES Y QUÉ SE REGISTRA ═══ -->
    <section class="da-intro">
        <div class="da-section-wrap">
            <div class="da-intro-grid">

                <!-- Izquierda: Importancia + Lista -->
                <div class="da-intro-col">
                    <span class="da-eyebrow">Lo que puedes proteger</span>
                    <h2 class="da-h2">Categorías protegibles</h2>
                    <p>Cualquier información de aplicación industrial o comercial que guardes con carácter confidencial, que signifique obtener una ventaja competitiva o económica, puede ser un secreto industrial.</p>
                    
                    <h3 style="font-family: var(--font-heading); font-size: 1.4rem; color: #2e2c2a; margin: 2.5rem 0 1rem; font-weight: 400;">Un secreto industrial suele ser:</h3>
                    <ul class="da-chips">
                        <li>Fórmulas y recetas</li>
                        <li>Algoritmos y código propietario</li>
                        <li>Bases de datos de clientes</li>
                        <li>Listas de proveedores clave</li>
                        <li>Estrategias de precio y negocio</li>
                        <li>Procesos de manufactura</li>
                        <li>Manuales operativos no públicos</li>
                    </ul>
                </div>

                <!-- Derecha: Imagen + Foco -->
                <div class="da-intro-col">
                    <img src="hands_orb_inverted.png" alt="Manos protegiendo información" style="margin-bottom: 2rem; width: 100%;">
                    
                    <span class="da-eyebrow">El riesgo silencioso</span>
                    <h2 class="da-h2" style="font-size: 1.6rem; margin-bottom: 1rem;">El fundamento legal que la mayoría ignora</h2>
                    <p>La Ley Federal de Protección a la Propiedad Industrial (LFPPI) establece que para que una información sea considerada legalmente un "Secreto Industrial", no basta con decirle a tus empleados que es secreta.</p>
                    <p>Debes haber adoptado los <strong>medios o sistemas suficientes y razonables</strong> para preservar su confidencialidad. Si no existen contratos, políticas y controles de acceso, ante un juez, tu secreto simplemente era información desprotegida.</p>
                </div>

            </div>
        </div>
    </section>

    <!-- ═══ PRECIOS ═══ -->
    <section class="da-pricing" id="precios">
        <div class="da-section-wrap">
            <div class="da-pricing-head">
                <span class="da-eyebrow">Precios claros</span>
                <h2 class="da-h2" style="margin-bottom: 0;">Soluciones a la medida de tu riesgo</h2>
            </div>

            <div class="da-pricing-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); max-width: 1100px;">

                <!-- 1. Diagnóstico -->
                <div class="da-card" id="card-diagnostico">
                    <div class="ed-price">$3,990 <span style="font-size:0.5em;">MXN</span></div>
                    <p class="da-card-label">Diagnóstico de Secreto Industrial</p>
                    <p class="da-card-desc">Evaluamos si tu información cumple los requisitos de la LFPPI para considerarse secreto, y qué te falta para lograrlo.</p>
                    <ul>
                        <li>Auditoría de información actual</li>
                        <li>Mapeo de accesos y riesgos</li>
                        <li>Dictamen de viabilidad legal</li>
                    </ul>
                    <a href="https://wa.me/524191239646?text=Hola%2C%20quiero%20el%20Diagn%C3%B3stico%20de%20Secreto%20Industrial%20(%243%2C990%20MXN)."
                       target="_blank" rel="noopener" class="ed-btn">Solicitar Diagnóstico</a>
                </div>

                <!-- 2. Blindaje Documental -->
                <div class="da-card highlight" id="card-blindaje">
                    <div class="ed-badge best">Recomendado</div>
                    <div class="ed-price">$7,990 <span style="font-size:0.5em;">MXN</span></div>
                    <p class="da-card-label">Blindaje Documental</p>
                    <p class="da-card-desc">Generamos los contratos (NDAs) y las políticas internas necesarias para cumplir con los "medios razonables" que exige la ley.</p>
                    <ul>
                        <li>NDAs para empleados y terceros</li>
                        <li>Políticas de uso de información</li>
                        <li>Cláusulas restrictivas laborales</li>
                        <li>Protocolo de resguardo</li>
                    </ul>
                    <a href="https://wa.me/524191239646?text=Hola%2C%20quiero%20el%20Blindaje%20Documental%20de%20Secreto%20Industrial%20(%247%2C990%20MXN)."
                       target="_blank" rel="noopener" class="ed-btn">Blindar mi empresa</a>
                </div>

                <!-- 3. Programa Continuo -->
                <div class="da-card" id="card-continuo">
                    <div class="ed-price">desde $2,490 <span style="font-size:0.5em;">MXN/mes</span></div>
                    <p class="da-card-label">Programa de Confidencialidad Continuo</p>
                    <p class="da-card-desc">Para empresas dinámicas. Mantenemos tus contratos actualizados y gestionamos las firmas de confidencialidad de todo nuevo empleado o proveedor.</p>
                    <ul>
                        <li>Onboarding legal continuo</li>
                        <li>Actualización de NDA según el caso</li>
                        <li>Resguardo de evidencia contractual</li>
                        <li>Asesoría recurrente</li>
                    </ul>
                    <a href="https://wa.me/524191239646?text=Hola%2C%20quiero%20el%20Programa%20de%20Confidencialidad%20Continuo%20(desde%20%242%2C490%20MXN/mes)."
                       target="_blank" rel="noopener" class="ed-btn">Cotizar Programa</a>
                </div>

            </div>
        </div>
    </section>

    <!-- ═══ CIERRE ═══ -->
    <section style="padding: 4rem 5vw 6rem; background-color: #fff; text-align: center;">
        <h2 style="font-family: var(--font-heading); font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 400; color: #2e2c2a; max-width: 900px; margin: 0 auto; line-height: 1.3;">
            Tu obra se registra. Tu marca se registra.<br>
            <em style="color: var(--bronze, #c5a880);">Lo que nadie más sabe hacer en tu empresa, se blinda distinto — y nosotros sabemos cómo.</em>
        </h2>
    </section>

    <!-- ═══ FAQ ═══ -->
    <section class="faq-section" style="background: #fff;">
        <span class="faq-eyebrow">Preguntas frecuentes</span>
        <h2 class="faq-title">Sobre el Secreto Industrial</h2>

        <details class="faq-item">
            <summary>¿Qué diferencia hay entre una patente y un secreto industrial?</summary>
            <p>La patente requiere revelar tu invención al público a cambio de un monopolio de 20 años; después, cualquiera puede usarla. El secreto industrial, en cambio, te protege por tiempo indefinido (mientras siga siendo secreto), pero no te protege si alguien más descubre la fórmula de manera independiente. Es ideal para cosas que no pueden aplicar a patentes, como algoritmos ocultos en servidores, recetas o bases de datos.</p>
        </details>
        <details class="faq-item">
            <summary>¿Hacer firmar un NDA es suficiente?</summary>
            <p>Es el primer paso, pero no el único. Un NDA (Acuerdo de Confidencialidad) genérico sirve de poco si no identificas claramente qué información es el secreto. La ley exige "sistemas suficientes y razonables". Esto significa que además del contrato, debe haber controles (ej. contraseñas, áreas restringidas, políticas de uso) que demuestren que realmente trataste esa información como un secreto.</p>
        </details>
        <details class="faq-item">
            <summary>¿Puedo proteger una "idea de negocio" como secreto?</summary>
            <p>Las ideas abstractas no son protegibles por ninguna figura de propiedad intelectual (ni derechos de autor, ni marcas, ni secretos). Lo que proteges como secreto es la información concreta y de aplicación industrial/comercial que te da una ventaja, como el algoritmo ya programado, la base de datos estructurada o la lista de proveedores negociada. Las "ideas al aire" no son secretos industriales.</p>
        </details>
        <details class="faq-item">
            <summary>¿Qué pasa si un empleado roba un secreto industrial?</summary>
            <p>En México, la revelación, apoderamiento o uso indebido de un secreto industrial no solo es un ilícito civil (para demandar pago de daños y perjuicios), sino también un delito federal tipificado en el Código Penal. Sin embargo, para que el Ministerio Público o un juez te den la razón, debes poder probar que tomaste medidas para proteger esa información antes de que fuera robada. Por eso es vital el blindaje previo.</p>
        </details>
    </section>

    <!-- Schema.org structured data -->"""

start_marker = "    <!-- ═══ EDITORIAL LAYOUT ═══ -->"
end_marker = "    <!-- Schema.org structured data -->"

if start_marker in content and end_marker in content:
    pre = content[:content.find(start_marker)]
    post = content[content.find(end_marker):]
    
    # replace schema script too
    schema_pattern = re.compile(r'<script type="application/ld\+json">.*?</script>', re.DOTALL)
    post = schema_pattern.sub('', post)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(pre + new_body + post)
    print("Replaced secreto-industrial.html body")
else:
    print("Markers not found")
