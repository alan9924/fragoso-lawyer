import re

file_path = '/Users/alanfragosorivera/Desktop/FRAGOSO/secreto-industrial.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_hero = """    <style>
        .si-hero {
            position: relative;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: #fdfdf9;
            overflow: hidden;
            text-align: center;
            padding: 120px 5% 5rem;
        }

        /* Abstract shapes (solid, not blurred, sharp edges) */
        .si-shape-top-left {
            position: absolute;
            top: -25vh;
            left: -15vw;
            width: 70vw;
            height: 70vw;
            background: #f2e350;
            border-radius: 40% 60% 60% 40% / 50% 40% 60% 50%;
            z-index: 0;
            transform: rotate(-15deg);
        }
        
        .si-shape-bottom-right {
            position: absolute;
            bottom: -35vh;
            right: -10vw;
            width: 90vw;
            height: 90vw;
            background: #ebd93f;
            border-radius: 40% 60% 50% 50% / 60% 50% 50% 40%;
            z-index: 0;
            transform: rotate(20deg);
        }

        .si-content {
            position: relative;
            z-index: 10;
            max-width: 900px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .si-icon {
            width: 50px;
            height: 50px;
            margin-bottom: 2.5rem;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .si-icon svg {
            width: 100%;
            height: 100%;
            color: #1a1a1a;
            fill: #1a1a1a;
        }

        .si-title {
            font-family: var(--font-body), sans-serif;
            font-size: clamp(2.5rem, 6vw, 4.5rem);
            font-weight: 500;
            color: #222;
            line-height: 1.05;
            letter-spacing: -1.5px;
            margin-bottom: 1.5rem;
        }
        
        .si-subtitle {
            font-family: var(--font-body), sans-serif;
            font-size: clamp(1rem, 2vw, 1.15rem);
            font-weight: 400;
            color: #444;
            max-width: 700px;
            line-height: 1.6;
            margin-bottom: 3.5rem;
        }

        .si-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.75rem 2rem;
            border: 1.5px solid #222;
            border-radius: 40px;
            color: #222;
            text-decoration: none;
            transition: all 0.3s ease;
            font-family: var(--font-body);
            font-weight: 500;
            font-size: 0.95rem;
            gap: 1rem;
            background: transparent;
        }

        .si-btn:hover {
            background-color: #222;
            color: #fff;
        }
    </style>

    <!-- ═══ EDITORIAL LAYOUT ═══ -->
    <main class="si-hero">
        <div class="si-shape-top-left"></div>
        <div class="si-shape-bottom-right"></div>
        
        <div class="si-content">
            <div class="si-icon">
                <svg viewBox="0 0 100 100">
                    <!-- Base 8-point star -->
                    <path d="M50 0 L55 40 L95 45 L55 55 L50 95 L45 55 L5 45 L45 40 Z" fill="currentColor"/>
                    <!-- Diagonal 4 points -->
                    <path d="M20 20 L40 40 L80 80 L60 60 Z" fill="none" stroke="currentColor" stroke-width="4"/>
                    <path d="M80 20 L60 40 L20 80 L40 60 Z" fill="none" stroke="currentColor" stroke-width="4"/>
                </svg>
            </div>
            
            <h1 class="si-title">Lo que nadie más sabe hacer en tu empresa, es tuyo solo si puedes probarlo.</h1>
            <p class="si-subtitle">Tu ventaja competitiva no siempre se puede registrar. Las fórmulas, procesos o estrategias que te hacen único requieren un blindaje interno para considerarse secretos industriales protegidos por la ley.</p>
            
            <a href="#precios" class="si-btn">
                BLINDAR MI SECRETO <i class="fa-solid fa-arrow-right"></i>
            </a>
        </div>
    </main>"""

# Find the block to replace
start_marker = "    <!-- ═══ EDITORIAL LAYOUT ═══ -->"
end_marker = "    <!-- ═══ INTRO — QUÉ ES Y QUÉ SE REGISTRA ═══ -->"

if start_marker in content and end_marker in content:
    pre = content[:content.find(start_marker)]
    post = content[content.find(end_marker):]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(pre + new_hero + '\n' + post)
    print("Hero replaced")
else:
    print("Markers not found")

