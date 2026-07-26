import re

with open('index.html', 'r') as f:
    content = f.read()

new_html = """
    <!-- ═══ HOW IT WORKS (INFOGRAPHIC) ═══ -->
    <section class="process-section" id="como-funciona-timeline">
        <header class="process-header">
            <h2 class="process-title">De la duda a la solución, en tres pasos.</h2>
            <p class="process-subtitle">Sin cotizaciones a puerta cerrada, sin llamadas para ‘ver cuánto sale’. Precio cerrado desde el clic.</p>
        </header>

        <div class="timeline-container">
            <div class="timeline-track" aria-hidden="true">
                <div class="timeline-progress"></div>
            </div>

            <div class="timeline-list">
                <!-- Paso 1 -->
                <article class="timeline-item" id="step-1">
                    <div class="timeline-number" aria-hidden="true">1</div>
                    <div class="timeline-side timeline-left">
                        <div class="timeline-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                                <line x1="2" y1="10" x2="22" y2="10" />
                                <path d="M7 15h2" />
                            </svg>
                        </div>
                    </div>
                    <div class="timeline-side timeline-right">
                        <div class="timeline-content">
                            <span class="step-tag">En línea · Seguro</span>
                            <h3 class="step-title">Elige y paga</h3>
                            <p class="step-desc">Escoge tu servicio y paga en el momento, con precio cerrado.</p>
                        </div>
                    </div>
                </article>

                <!-- Paso 2 -->
                <article class="timeline-item" id="step-2">
                    <div class="timeline-number" aria-hidden="true">2</div>
                    <div class="timeline-side timeline-left">
                        <div class="timeline-content">
                            <span class="step-tag">Cuestionario breve</span>
                            <h3 class="step-title">Cuéntanos tu caso</h3>
                            <p class="step-desc">Respondes unas preguntas simples, subes lo que aplique o eliges tu horario. A tu ritmo.</p>
                        </div>
                    </div>
                    <div class="timeline-side timeline-right">
                        <div class="timeline-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                        </div>
                    </div>
                </article>

                <!-- Paso 3 -->
                <article class="timeline-item" id="step-3">
                    <div class="timeline-number" aria-hidden="true">3</div>
                    <div class="timeline-side timeline-left">
                        <div class="timeline-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <polyline points="9 11 11 13 15 9" />
                            </svg>
                        </div>
                    </div>
                    <div class="timeline-side timeline-right">
                        <div class="timeline-content">
                            <span class="step-tag">24–48 h hábiles</span>
                            <h3 class="step-title">Un abogado entrega</h3>
                            <p class="step-desc">Un abogado con cédula toma tu caso y te entrega la solución — documento, trámite, análisis o estrategia. Nunca un bot.</p>
                        </div>
                    </div>
                </article>
            </div>
        </div>

        <div class="timeline-guarantee">
            <div class="guarantee-capsule">
                <svg class="guarantee-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 11 11 13 15 9" />
                </svg>
                <span class="guarantee-text">Revisión en 48 h o te devolvemos tu dinero.</span>
            </div>
        </div>

        <div class="timeline-cta-wrap">
            <a href="#soluciones" class="timeline-cta-btn">Ver servicios y precios</a>
            <p class="timeline-cta-secondary">Precios claros antes de pagar.</p>
        </div>
    </section>
"""

# Regex to match the old infographic block from <section class="how-it-works-infographic"> to </section>
pattern = r'<!-- ═══ HOW IT WORKS \(INFOGRAPHIC\) ═══ -->\s*<section class="how-it-works-infographic".*?</section>'
content = re.sub(pattern, new_html, content, flags=re.DOTALL)

with open('index.html', 'w') as f:
    f.write(content)

print("HTML Replaced")
