import re

file_path = '/Users/alanfragosorivera/Desktop/FRAGOSO/empresa-operacion.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_content = """<!-- TABLA CREENCIA VS REALIDAD (ESTILO MERCU) -->
<style>
.mercu-section {
    background-color: #112a1e;
    padding: 6rem 5vw;
    color: #fff;
    font-family: var(--font-body), sans-serif;
    overflow: hidden;
}

.mercu-title {
    text-align: center;
    font-family: var(--font-heading), serif;
    font-size: clamp(2rem, 5vw, 2.8rem);
    color: #fff;
    margin-bottom: 4rem;
}

.mercu-container {
    max-width: 1150px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 3rem;
    align-items: center;
}

.mercu-col {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    position: relative;
}

/* Vertical bars */
.mercu-col-left::after,
.mercu-col-right::after {
    content: '';
    position: absolute;
    width: 2px;
    background-color: #2a4b3b;
    z-index: 1;
    top: 90px; 
    bottom: 50px;
}
.mercu-col-left::after { right: -24px; }
.mercu-col-right::after { left: -24px; }

.mercu-header {
    text-align: center;
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    font-family: var(--font-heading), serif;
    color: #fff;
}

.mercu-pill {
    position: relative;
    padding: 1.25rem 1.5rem;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.95rem;
    line-height: 1.4;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 2;
}

/* Horizontal connecting lines for pills */
.mercu-pill::after,
.mercu-pill::before {
    content: '';
    position: absolute;
    top: 50%;
    height: 2px;
    background-color: #2a4b3b;
    width: 24px;
    z-index: 1;
}
.mercu-pill-left::after { right: -24px; }
.mercu-pill-right::before { left: -24px; }

.mercu-pill-left {
    background-color: #1f3b2d;
    color: #e5e7eb;
    border: 1px solid #2a4b3b;
}

.mercu-pill-right {
    background-color: #c7f2a4;
    color: #112a1e;
    font-weight: 600;
}

.mercu-icon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
}

.mercu-icon-left {
    background-color: #112a1e;
    color: #c7f2a4;
    border: 1px solid #c7f2a4;
}

.mercu-icon-right {
    background-color: #fff;
    color: #112a1e;
}

.mercu-center {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
    margin-top: 3.5rem; 
}

.mercu-logo {
    width: 50px;
    height: 50px;
    background-color: #c7f2a4;
    color: #112a1e;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.2rem;
    font-family: var(--font-heading), serif;
    position: relative;
    z-index: 3;
}
.mercu-logo-outer {
    width: 60px;
    height: 60px;
    background-color: #112a1e;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #2a4b3b;
    position: relative;
}

/* Horizontal connecting lines for logo */
.mercu-center::before,
.mercu-center::after {
    content: '';
    position: absolute;
    top: 50%;
    height: 2px;
    background-color: #2a4b3b;
    width: 24px;
    z-index: 1;
}
.mercu-center::before { left: -24px; }
.mercu-center::after { right: -24px; }

@media (max-width: 900px) {
    .mercu-container {
        grid-template-columns: 1fr;
        gap: 3rem;
    }
    .mercu-center, 
    .mercu-col-left::after, 
    .mercu-col-right::after, 
    .mercu-pill::after, 
    .mercu-pill::before {
        display: none;
    }
    .mercu-header {
        margin-bottom: 0.5rem;
    }
}
</style>

<section class="mercu-section">
    <h2 class="mercu-title">No es lo que piensas</h2>
    <div class="mercu-container">
        
        <div class="mercu-col mercu-col-left">
            <h3 class="mercu-header">Lo que piensas</h3>
            <div class="mercu-pill mercu-pill-left">
                <div class="mercu-icon mercu-icon-left"><i class="fa-solid fa-xmark"></i></div>
                <span>Tener un abogado de planta es un lujo carísimo.</span>
            </div>
            <div class="mercu-pill mercu-pill-left">
                <div class="mercu-icon mercu-icon-left"><i class="fa-solid fa-xmark"></i></div>
                <span>Le hablaré al abogado solo cuando tenga una demanda encima.</span>
            </div>
            <div class="mercu-pill mercu-pill-left">
                <div class="mercu-icon mercu-icon-left"><i class="fa-solid fa-xmark"></i></div>
                <span>Cobran por hora, la factura será impredecible y no sé cuánto me va a costar.</span>
            </div>
        </div>
        
        <div class="mercu-center">
            <div class="mercu-logo-outer">
                <div class="mercu-logo">ff.</div>
            </div>
        </div>

        <div class="mercu-col mercu-col-right">
            <h3 class="mercu-header">La realidad</h3>
            <div class="mercu-pill mercu-pill-right">
                <div class="mercu-icon mercu-icon-right"><i class="fa-solid fa-check"></i></div>
                <span>Cuesta una fracción de un sueldo, pero tienes a todo un despacho a tu disposición.</span>
            </div>
            <div class="mercu-pill mercu-pill-right">
                <div class="mercu-icon mercu-icon-right"><i class="fa-solid fa-check"></i></div>
                <span>Un juicio cuesta mucho más que prevenirlo hoy revisando lo que firmas y negocias.</span>
            </div>
            <div class="mercu-pill mercu-pill-right">
                <div class="mercu-icon mercu-icon-right"><i class="fa-solid fa-check"></i></div>
                <span>Las membresías tienen precio fijo mensual y cerrado. Tu presupuesto jurídico es 100% predecible.</span>
            </div>
        </div>
        
    </div>
</section>"""

start_marker = "<!-- TABLA CREENCIA VS REALIDAD -->"
end_marker = "<!-- SEGMENTOS -->"

if start_marker in content and end_marker in content:
    pre = content[:content.find(start_marker)]
    post = content[content.find(end_marker):]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(pre + new_content + '\n' + post)
    print("Section replaced")
else:
    print("Markers not found")

