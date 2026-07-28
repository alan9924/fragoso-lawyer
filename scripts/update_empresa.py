import re

filepath = "/Users/alanfragosorivera/Desktop/FRAGOSO/empresa.html"
with open(filepath, "r") as f:
    content = f.read()

# Replace CSS
old_css_regex = r"/\* Premium System Section \*/.*?@media \(max-width: 768px\) \{.*?\}\s*\n"
new_css = """  /* Premium System Section - SaaS Editorial */
  .premium-system-section {
    padding: 160px 0;
    background: transparent;
  }
  .premium-system-container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 5%;
    display: grid;
    grid-template-columns: 1fr;
    gap: 80px;
  }
  
  .premium-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-family: monospace;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--taupe-dark, #544e4b);
  }
  .eyebrow-dot {
    width: 6px;
    height: 6px;
    background: #a9b5f9; /* Light purple/blue dot from reference */
  }
  
  .premium-title {
    font-family: var(--font-heading);
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    line-height: 1.05;
    font-weight: 400;
    letter-spacing: -0.02em;
    color: var(--carbon);
    margin: 24px 0;
  }
  
  .premium-system-header p {
    font-family: var(--font-body);
    color: var(--taupe-dark, #544e4b);
    max-width: 480px;
    font-size: 1.15rem;
    line-height: 1.6;
    font-weight: 300;
  }
  
  .premium-system-list {
    position: relative;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .premium-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 80px;
    opacity: 0.25;
    transition: opacity 0.6s ease, transform 0.6s ease;
    transform: translateY(20px);
  }
  .premium-item:last-child {
    padding-bottom: 0;
  }
  .premium-item.active {
    opacity: 1;
    transform: translateY(0);
  }
  
  .premium-system-num {
    font-family: monospace;
    font-size: 0.85rem;
    color: var(--taupe-dark, #544e4b);
    margin-bottom: 8px;
  }
  
  .premium-item-title {
    font-family: var(--font-body);
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--carbon);
    margin: 0;
    letter-spacing: -0.01em;
  }
  
  .premium-item-desc {
    font-family: var(--font-body);
    font-size: 1.1rem;
    line-height: 1.6;
    font-weight: 300;
    color: var(--taupe-dark, #544e4b);
    margin: 0;
  }

  @media (min-width: 1024px) {
    .premium-system-container {
      grid-template-columns: 1fr 1fr;
      gap: 120px;
      align-items: flex-start;
    }
    .premium-system-header {
      position: sticky;
      top: 180px;
    }
    .premium-system-list {
      padding-left: 80px;
    }
    /* The static background line */
    .premium-system-list::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 1px;
      background: rgba(0,0,0,0.1);
    }
    /* The active progress line */
    .premium-system-list::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 1px;
      height: var(--progress, 0%);
      background: var(--carbon);
      transition: height 0.1s linear;
    }
  }
"""
content = re.sub(old_css_regex, new_css, content, flags=re.DOTALL)

# Replace HTML
old_html_regex = r"<!-- SISTEMA -->\s*<section class=\"premium-system-section\">.*?</section>"
new_html = """<!-- SISTEMA -->
<section class="premium-system-section">
  <div class="premium-system-container">
    <div class="premium-system-header">
      <span class="premium-eyebrow"><span class="eyebrow-dot"></span>NUESTRO ENFOQUE</span>
      <h2 class="premium-title">El sistema que<br>protege todo.</h2>
      <p>Cuatro frentes que blindan tu operación durante todo el año — no cuando ya hay un problema encima.</p>
    </div>
    
    <ol class="premium-system-list" id="premiumScrollList">
      <li class="premium-item active">
        <span class="premium-system-num">01</span>
        <h3 class="premium-item-title">Redacción y revisión.</h3>
        <p class="premium-item-desc">Estructuramos, redactamos y analizamos tus contratos y acuerdos. Nada se firma sin que un abogado lo haya revisado rigurosamente primero.</p>
      </li>
      <li class="premium-item">
        <span class="premium-system-num">02</span>
        <h3 class="premium-item-title">Monitoreo continuo.</h3>
        <p class="premium-item-desc">Tus plantillas y acuerdos estándar, siempre vigentes. Cuando la ley cambia, tus documentos clave ya están actualizados automáticamente.</p>
      </li>
      <li class="premium-item">
        <span class="premium-system-num">03</span>
        <h3 class="premium-item-title">Reporte de riesgo.</h3>
        <p class="premium-item-desc">Auditamos tus contratos vigentes y te comunicamos, por escrito, exactamente dónde estás expuesto y qué debes corregir de forma prioritaria.</p>
      </li>
      <li class="premium-item">
        <span class="premium-system-num">04</span>
        <h3 class="premium-item-title">Alertas regulatorias.</h3>
        <p class="premium-item-desc">Los cambios legislativos que afectan tu industria, analizados a tiempo. Te enteras y te preparas mucho antes de que se vuelvan un problema.</p>
      </li>
    </ol>
  </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('premiumScrollList');
  if(!list) return;
  const items = list.querySelectorAll('.premium-item');
  
  window.addEventListener('scroll', () => {
    const rect = list.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Start progress when the top of the list reaches the middle of the screen
    const startOffset = windowHeight * 0.6;
    const progressStart = rect.top - startOffset;
    
    if (progressStart < 0) {
      // Calculate percentage
      let progress = (Math.abs(progressStart) / (rect.height * 0.8)) * 100;
      progress = Math.min(100, Math.max(0, progress));
      list.style.setProperty('--progress', progress + '%');
    } else {
      list.style.setProperty('--progress', '0%');
    }
    
    // Highlight items based on their individual position
    items.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      // If item's top passes the middle of screen (plus some margin)
      if (itemRect.top < windowHeight * 0.65) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });
  
  // Trigger once on load
  window.dispatchEvent(new Event('scroll'));
});
</script>"""
content = re.sub(old_html_regex, new_html, content, flags=re.DOTALL)

with open(filepath, "w") as f:
    f.write(content)
print("Updated HTML and JS")
