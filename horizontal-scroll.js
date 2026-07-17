/* ============================================================================
   FERRO FRAGOSO — Scroll horizontal con pin (Acerca → Áreas → Socios →
   Por qué escogernos → Promesa)
   ----------------------------------------------------------------------------
   Solo en escritorio (≥900px) y sin "reduced motion": el escenario (#h-stage)
   se ancla y el scroll vertical se traduce en desplazamiento horizontal del
   track (#h-track), un panel (.h-panel) por sección. En móvil o con
   movimiento reducido no se activa nada: las secciones quedan apiladas en
   vertical con el comportamiento normal del sitio.
   ============================================================================ */
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const track = document.querySelector('#h-track');
        const stage = document.querySelector('#h-stage');
        if (!track || !stage) return;

        const paneles = gsap.utils.toArray('.h-panel');
        const enlaces = gsap.utils.toArray('.nav-links a[data-panel]');
        const n = paneles.length;
        if (!n) return;

        const distancia = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
            x: () => -distancia(),
            ease: 'none',
            scrollTrigger: {
                trigger: stage,
                start: 'top top',
                // Distancia 1:1 con el track: un solo gesto de scroll (rueda/trackpad)
                // ya cubre lo necesario para llegar al siguiente panel, en vez de
                // requerir scroll adicional acumulado.
                end: () => `+=${distancia()}`,
                pin: true,
                scrub: 0.35, // Sigue el scroll casi al instante, sin inercia perceptible
                invalidateOnRefresh: true,
                snap: {
                    snapTo: 1 / (n - 1),
                    duration: { min: 0.15, max: 0.35 },
                    delay: 0,
                    ease: 'power1.out'
                }
            }
        });

        /* Clic en el menú → desplaza el scroll de la página a la posición
           vertical equivalente del panel. El resaltado del enlace activo
           ya lo gestiona el sectionObserver existente en script.js, que
           sigue funcionando porque los paneles siguen intersectando el
           viewport (aunque se muevan en X en vez de en Y). */
        function irAPanel(i) {
            const st = tween.scrollTrigger;
            const y = st.start + (st.end - st.start) * (i / (n - 1));
            window.scrollTo({ top: y, behavior: 'smooth' });
        }

        enlaces.forEach((a) => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                irAPanel(+a.dataset.panel);
                history.replaceState(null, '', a.getAttribute('href'));
            });
        });
    });
});
