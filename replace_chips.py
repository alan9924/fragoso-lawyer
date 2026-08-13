import re

file_path = '/Users/alanfragosorivera/Desktop/FRAGOSO/secreto-industrial.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """                    <ul class="da-chips">
                        <li>Fórmulas y recetas</li>
                        <li>Algoritmos y código propietario</li>
                        <li>Bases de datos de clientes</li>
                        <li>Listas de proveedores clave</li>
                        <li>Estrategias de precio y negocio</li>
                        <li>Procesos de manufactura</li>
                        <li>Manuales operativos no públicos</li>
                    </ul>"""

replacement = """                    <style>
                        .nyt-grid {
                            display: grid;
                            grid-template-columns: repeat(2, 1fr);
                            gap: 0;
                            margin-top: 2rem;
                            border: 1px solid rgba(0,0,0,0.1);
                        }
                        .nyt-card {
                            aspect-ratio: 1 / 1;
                            position: relative;
                            padding: 1.5rem;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            overflow: hidden;
                            border: 1px solid rgba(0,0,0,0.1);
                        }
                        .nyt-text {
                            font-family: var(--font-heading), serif;
                            font-size: clamp(1rem, 2vw, 1.4rem);
                            font-weight: 500;
                            line-height: 1.1;
                            position: relative;
                            z-index: 2;
                            text-align: center;
                            text-wrap: balance;
                        }
                        .nyt-brand {
                            position: absolute;
                            bottom: 0.8rem;
                            right: 0.8rem;
                            font-family: var(--font-heading), serif;
                            font-weight: 700;
                            font-size: 0.85rem;
                            z-index: 2;
                            opacity: 0.9;
                        }
                        .nyt-brand-left {
                            position: absolute;
                            bottom: 0.8rem;
                            left: 0.8rem;
                            font-family: var(--font-body), sans-serif;
                            font-weight: 500;
                            font-size: 0.6rem;
                            letter-spacing: 1px;
                            z-index: 2;
                            opacity: 0.6;
                        }
                        .nyt-white { background: #fff; color: #111; }
                        .nyt-black { background: #1a1a1a; color: #fff; }
                        .nyt-bronze { background: #b89355; color: #fff; }
                        .nyt-red { background: #d61e28; color: #fff; }
                        
                        /* Graphic elements */
                        .nyt-shape-lines {
                            position: absolute;
                            top: 0; left: 0; width: 100%; height: 50%;
                            z-index: 1;
                        }
                        .nyt-quote-icon {
                            font-size: 2.5rem;
                            color: #b89355;
                            text-align: center;
                            margin-bottom: 0.5rem;
                            line-height: 0.5;
                            position: relative;
                            z-index: 2;
                            font-family: serif;
                        }
                        .nyt-span-2 {
                            grid-column: 1 / -1;
                            aspect-ratio: 2 / 1;
                        }
                        @media(max-width: 600px) {
                            .nyt-grid { grid-template-columns: repeat(2, 1fr); }
                            .nyt-card { padding: 0.8rem; }
                            .nyt-text { font-size: 0.95rem; }
                        }
                    </style>

                    <div class="nyt-grid">
                        <!-- 1. Fórmulas y recetas -->
                        <div class="nyt-card nyt-white">
                            <svg class="nyt-shape-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M-10,40 Q20,-10 60,30 T120,10" fill="none" stroke="#d61e28" stroke-width="1.5"/>
                                <path d="M-10,60 Q30,10 70,50 T120,30" fill="none" stroke="#d61e28" stroke-width="0.8"/>
                                <circle cx="30" cy="15" r="30" fill="none" stroke="#d61e28" stroke-width="0.8" />
                            </svg>
                            <span class="nyt-brand-left">FF</span>
                            <h4 class="nyt-text" style="text-align: left;">Fórmulas y<br>recetas</h4>
                            <span class="nyt-brand">ff.</span>
                        </div>

                        <!-- 2. Algoritmos y código propietario -->
                        <div class="nyt-card nyt-bronze">
                            <svg style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:1;" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0,10 Q50,40 100,10" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                                <path d="M0,20 Q50,50 100,20" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                                <path d="M0,30 Q50,60 100,30" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                                <path d="M0,40 Q50,70 100,40" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                                <path d="M0,50 Q50,80 100,50" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                                <path d="M0,60 Q50,90 100,60" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                                <path d="M0,70 Q50,100 100,70" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                                <path d="M0,80 Q50,110 100,80" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                            </svg>
                            <span class="nyt-brand-left">FF</span>
                            <h4 class="nyt-text">Algoritmos<br>y código<br>propietario</h4>
                            <span class="nyt-brand">ff.</span>
                        </div>

                        <!-- 3. Bases de datos de clientes -->
                        <div class="nyt-card nyt-white">
                            <svg class="nyt-shape-lines" viewBox="0 0 100 100" preserveAspectRatio="none" style="top:50%; transform:translateY(-50%);">
                                <path d="M-10,50 L40,50 L120,10" fill="none" stroke="#d61e28" stroke-width="1"/>
                                <path d="M-10,60 L50,60 L120,20" fill="none" stroke="#d61e28" stroke-width="0.5"/>
                            </svg>
                            <span class="nyt-brand-left">FF</span>
                            <h4 class="nyt-text" style="text-align: left;">Bases de datos<br>de clientes</h4>
                            <span class="nyt-brand">ff.</span>
                        </div>

                        <!-- 4. Listas de proveedores -->
                        <div class="nyt-card nyt-black">
                            <div style="position:absolute; top:20%; left:15%; width:12%; height:60%; background:rgba(255,255,255,0.1); filter:blur(4px);"></div>
                            <div style="position:absolute; top:10%; left:44%; width:12%; height:80%; background:rgba(255,255,255,0.1); filter:blur(4px);"></div>
                            <div style="position:absolute; top:25%; left:73%; width:12%; height:50%; background:rgba(255,255,255,0.1); filter:blur(4px);"></div>
                            <span class="nyt-brand-left">FF</span>
                            <h4 class="nyt-text">Listas de<br>proveedores<br>clave</h4>
                            <span class="nyt-brand">ff.</span>
                        </div>

                        <!-- 5. Estrategias de precio y negocio -->
                        <div class="nyt-card nyt-white">
                            <div class="nyt-quote-icon">“</div>
                            <h4 class="nyt-text" style="font-size: clamp(0.9rem, 2vw, 1.1rem); font-style: italic;">Estrategias de precio y negocio.</h4>
                            <div style="text-align: center; margin-top: 10px; font-size: 0.7rem; color: #666; position:relative; z-index:2;">— Mapeo financiero</div>
                            <span class="nyt-brand-left">FF</span>
                            <span class="nyt-brand">ff.</span>
                        </div>

                        <!-- 6. Procesos de manufactura -->
                        <div class="nyt-card nyt-black" style="background-image: radial-gradient(circle at center, #333 0%, #111 70%);">
                            <div style="position:absolute; width:100%; height:100%; top:0; left:0; opacity:0.2; background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E'); z-index:1;"></div>
                            <span class="nyt-brand-left">FF</span>
                            <h4 class="nyt-text">Procesos de<br>manufactura</h4>
                            <span class="nyt-brand">ff.</span>
                        </div>

                        <!-- 7. Manuales operativos -->
                        <div class="nyt-card nyt-white nyt-span-2">
                            <svg class="nyt-shape-lines" style="width:50%; height:100%; right:0; left:auto;" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <circle cx="100" cy="50" r="40" fill="none" stroke="#d61e28" stroke-width="1" />
                                <circle cx="100" cy="50" r="30" fill="none" stroke="#d61e28" stroke-width="0.5" />
                            </svg>
                            <span class="nyt-brand-left">FF</span>
                            <h4 class="nyt-text">Manuales operativos<br>no públicos</h4>
                            <span class="nyt-brand">ff.</span>
                        </div>
                    </div>"""

if target in content:
    new_content = content.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Replaced chips with NYT grid")
else:
    print("Target chips ul not found")
