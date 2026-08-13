import re

file_path = '/Users/alanfragosorivera/Desktop/FRAGOSO/secreto-industrial.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = '<img src="hands_orb_inverted.png" alt="Manos protegiendo información" style="margin-bottom: 2rem; width: 100%;">'

replacement = """<style>
.ff-folder-graphic {
    position: relative;
    width: 100%;
    max-width: 450px;
    margin: 0 auto 2.5rem;
    aspect-ratio: 4 / 5;
    background-color: #a80c14;
    background-image: 
        repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 6px),
        repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 6px);
    border-radius: 4px 8px 8px 4px;
    box-shadow: 
        inset 10px 0 30px rgba(0,0,0,0.3),
        inset -5px 0 15px rgba(0,0,0,0.1),
        0 15px 35px rgba(0,0,0,0.15);
    overflow: hidden;
}

.ff-folder-spine {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 15px;
    background: linear-gradient(90deg, rgba(0,0,0,0.5), rgba(0,0,0,0.1) 60%, transparent);
}

.ff-folder-clip {
    position: absolute;
    left: 5%;
    top: 30%;
    bottom: 30%;
    width: 12px;
    background: linear-gradient(90deg, #111 0%, #555 30%, #222 50%, #555 70%, #111 100%);
    border-radius: 10px;
    box-shadow: 3px 0 8px rgba(0,0,0,0.5);
}
.ff-folder-clip::before, .ff-folder-clip::after {
    content: '';
    position: absolute;
    left: -2px;
    right: -2px;
    height: 8px;
    background: #d61e28;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.4);
    border-radius: 2px;
}
.ff-folder-clip::before { top: 20%; }
.ff-folder-clip::after { bottom: 20%; }

.ff-folder-label {
    position: absolute;
    top: 50%;
    left: 55%;
    transform: translate(-50%, -50%);
    background: #f4f4f0;
    border: 3px solid #111;
    padding: 5px;
    width: 65%;
    color: #111;
    font-family: var(--font-body), "Courier New", monospace;
}
.ff-label-inner {
    border: 2px solid #111;
    display: flex;
    flex-direction: column;
}
.ff-label-header {
    text-align: center;
    border-bottom: 2px solid #111;
    padding: 6px 0;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 1px;
}
.ff-label-row {
    display: flex;
    border-bottom: 1px solid #111;
    padding: 6px 8px;
    font-size: 0.75rem;
    font-weight: 600;
    align-items: center;
}
.ff-label-row:last-child { border-bottom: none; }
.ff-blackout {
    background: #111;
    color: #111;
    display: inline-block;
    height: 10px;
    width: 100%;
}

.ff-stamp {
    position: absolute;
    top: 50%;
    left: 55%;
    transform: translate(-50%, -50%) rotate(-18deg);
    background: #d61e28;
    color: #fff;
    font-family: var(--font-body), "Courier New", monospace;
    font-size: clamp(1.4rem, 3vw, 2rem);
    font-weight: 700;
    letter-spacing: 2px;
    padding: 4px 15px;
    border: 3px solid #d61e28;
    box-shadow: 2px 4px 15px rgba(0,0,0,0.2);
    text-transform: uppercase;
}

.ff-scribble {
    position: absolute;
    width: 80px;
    height: auto;
    color: rgba(255,255,255,0.9);
}
.ff-scribble-1 { top: 6%; left: 10%; }
.ff-scribble-2 { bottom: 6%; right: 10%; }
</style>

<div class="ff-folder-graphic">
    <div class="ff-folder-spine"></div>
    <div class="ff-folder-clip"></div>
    
    <!-- Top Left Scribble -->
    <svg class="ff-scribble ff-scribble-1" viewBox="0 0 100 50" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10,35 C20,15 30,35 40,25 C50,15 60,35 70,25 C80,15 90,45 85,30" />
        <path d="M5,25 L95,25" stroke-width="3" />
        <text x="15" y="45" font-family="monospace" font-size="7" fill="currentColor" stroke="none">NOT EXPECTED TO BE</text>
    </svg>

    <div class="ff-folder-label">
        <div class="ff-label-inner">
            <div class="ff-label-header">TOP SECRET</div>
            <div style="display:flex;">
                <div style="width: 18px; border-right: 2px solid #111; display:flex; align-items:center; justify-content:center;">
                    <span style="transform: rotate(-90deg); font-size: 0.55rem; letter-spacing: 2px; font-weight:600;">ding</span>
                </div>
                <div style="flex:1;">
                    <div class="ff-label-row">
                        <div style="display:flex; flex-direction:column; gap:4px; width:100%;">
                            <span>Classified</span>
                            <span>Source: <span class="ff-blackout" style="width:40px;"></span></span>
                        </div>
                    </div>
                    <div class="ff-label-row">
                        <div style="display:flex; flex-direction:column; gap:4px; width:100%;">
                            <span><span class="ff-blackout" style="width:60px;"></span></span>
                            <span>Date: <span class="ff-blackout" style="width:50px;"></span></span>
                        </div>
                    </div>
                    <div class="ff-label-row" style="justify-content: center; padding: 8px;">
                        <span>Designed by [Legal]</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="ff-stamp">CLASSIFIED</div>
    
    <!-- Bottom Right Scribble -->
    <svg class="ff-scribble ff-scribble-2" viewBox="0 0 100 50" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15,30 C30,10 45,40 60,20 C75,0 90,30 85,15" />
        <path d="M5,20 L95,20" stroke-width="3" />
        <text x="5" y="40" font-family="monospace" font-size="7" fill="currentColor" stroke="none">IS THE WINNER REALLY A WINNER?</text>
    </svg>
</div>"""

if target in content:
    new_content = content.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Replaced image with CSS graphic")
else:
    print("Target image tag not found")
