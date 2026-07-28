with open('home-new.css', 'a') as f:
    f.write("""
/* --- NUEVA SECCION: CÓMO FUNCIONA TIMELINE --- */
:root {
    --tl-bg: #ffffff;
    --tl-text-main: #111827;
    --tl-text-muted: #4b5563;
    --tl-track-bg: #e5e7eb;
    --tl-primary: #2563eb;       
    --tl-primary-light: #eff6ff; 
    --tl-icon-idle: #93c5fd;     
    --tl-shadow: rgba(37, 99, 235, 0.15);
    --tl-font: var(--font-body), 'Inter', system-ui, sans-serif;
}

.process-section {
    background-color: var(--tl-bg);
    color: var(--tl-text-main);
    font-family: var(--tl-font);
    padding: 7rem 2rem;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
}

.process-header {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 5rem auto;
}

.process-title {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    line-height: 1.1;
    margin: 0 0 1rem 0;
    letter-spacing: -0.02em;
    color: var(--tl-text-main);
}

.process-subtitle {
    font-size: clamp(1rem, 2vw, 1.15rem);
    line-height: 1.6;
    color: var(--tl-text-muted);
    margin: 0;
}

.timeline-container {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem 0;
}

.timeline-track {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background-color: var(--tl-track-bg);
    z-index: 1;
}

.timeline-progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0%;
    background-color: var(--tl-primary);
    transition: height 0.1s linear;
}

.timeline-list {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 8rem; 
}

.timeline-item {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.timeline-item.is-visible {
    opacity: 1;
    transform: translateY(0);
}

.timeline-number {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--tl-bg);
    border: 2px solid var(--tl-track-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--tl-track-bg);
    z-index: 3;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.timeline-side {
    width: 50%;
    padding: 0 4rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.timeline-left {
    align-items: flex-end;
    text-align: right;
}

.timeline-right {
    align-items: flex-start;
    text-align: left;
}

.timeline-content {
    max-width: 380px;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.step-tag {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--tl-primary);
    display: inline-block;
    margin-bottom: 0.5rem;
}

.step-title {
    font-family: var(--font-heading);
    font-size: clamp(1.4rem, 2.5vw, 1.7rem);
    font-weight: 700;
    color: var(--tl-text-main);
    margin: 0 0 1rem 0;
    letter-spacing: -0.01em;
}

.step-desc {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--tl-text-muted);
    margin: 0;
}

.timeline-icon {
    width: 140px;
    height: 140px;
    color: var(--tl-icon-idle);
    opacity: 0.6;
    transform: scale(0.95);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.timeline-icon svg {
    width: 100%;
    height: 100%;
}

.timeline-item.is-active .timeline-number {
    background-color: var(--tl-primary);
    border-color: var(--tl-primary);
    color: #ffffff;
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 0 0 6px var(--tl-bg), 0 4px 15px var(--tl-shadow);
}

.timeline-item.is-active .timeline-icon {
    color: var(--tl-primary);
    opacity: 1;
    transform: scale(1.05);
}

.timeline-guarantee {
    display: flex;
    justify-content: center;
    margin: 6rem 0 3rem 0;
}

.guarantee-capsule {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background-color: var(--tl-primary-light);
    padding: 0.85rem 1.6rem;
    border-radius: 50px;
    border: 1px solid rgba(37, 99, 235, 0.1);
}

.guarantee-icon {
    width: 20px;
    height: 20px;
    color: var(--tl-primary);
    flex-shrink: 0;
}

.guarantee-text {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--tl-primary);
}

.timeline-cta-wrap {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
}

.timeline-cta-btn {
    display: inline-block;
    padding: 1.1rem 2.5rem;
    background-color: var(--tl-primary);
    color: #ffffff;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 700;
    border-radius: 8px;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px var(--tl-shadow);
}

.timeline-cta-btn:hover {
    background-color: #1d4ed8;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px var(--tl-shadow);
}

.timeline-cta-btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.3);
}

.timeline-cta-secondary {
    font-size: 0.85rem;
    color: var(--tl-text-muted);
    margin: 0;
}

@media (max-width: 768px) {
    .process-section {
        padding: 4rem 1.5rem;
    }
    .timeline-list {
        gap: 5rem;
    }
    .timeline-track {
        left: 24px;
        transform: none;
    }
    .timeline-item {
        flex-direction: column;
        align-items: flex-start;
        padding-left: 65px;
    }
    .timeline-number {
        left: 24px;
        top: 24px;
    }
    .timeline-side {
        width: 100%;
        padding: 0;
        align-items: flex-start;
        text-align: left;
    }
    .timeline-side:has(.timeline-icon) {
        order: 1; 
        margin-bottom: 1rem;
    }
    .timeline-side:has(.timeline-content) {
        order: 2; 
    }
    .timeline-icon {
        width: 80px;
        height: 80px;
        transform: none !important;
    }
    .timeline-item.is-active .timeline-number {
        transform: translate(-50%, -50%); 
    }
    .timeline-cta-btn {
        width: 100%;
        box-sizing: border-box;
    }
}

@media (prefers-reduced-motion: reduce) {
    .timeline-item {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
    }
    .timeline-progress {
        height: 100% !important;
        transition: none !important;
    }
    .timeline-number, .timeline-icon, .timeline-cta-btn {
        transition: none !important;
        transform: none !important;
    }
}
""")
print("CSS Appended")
