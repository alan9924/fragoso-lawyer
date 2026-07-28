document.addEventListener('DOMContentLoaded', () => {

    /* ── Always start at top (Hero) ── */
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const navbar = document.getElementById('navbar');
    const loader = document.getElementById('intro-loader');

    /* ════════════════════════════════════
       INTRO LOADER + HERO CASCADE
    ════════════════════════════════════ */
    /* Los selectores .hero-tagline y .hero-cta-oval ya no existían en el markup
       (se renombraron a .hero-tagline-primary / -secondary), así que el
       .filter(Boolean) los descartaba en silencio y los taglines quedaban fuera
       de la cascada de entrada.
       El CTA no se incluye a propósito: .hero-cta-group ya se anima por CSS con
       .blur-fade, y meterlo aquí haría que JS y CSS se peleen la opacidad. */
    const heroItems = [
        document.querySelector('.hero-eyebrow'),
        document.querySelector('.hero-title'),
        document.querySelector('.hero-rule'),
        document.querySelector('.hero-tagline-primary'),
        document.querySelector('.hero-tagline-secondary'),
    ].filter(Boolean);

    heroItems.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(22px)'; el.style.transition = 'none'; });

    setTimeout(() => {
        if (!window.__VIDEO_LOADER && loader) loader.classList.add('hidden');
        
        document.body.style.overflow = '';

        setTimeout(() => {
            heroItems.forEach((el, i) => {
                setTimeout(() => {
                    el.style.transition = 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, i * 140);
            });
            // Social + fragment fade in
            document.querySelectorAll('.hero-social-left, .hero-fragment-wrap, .hero-scroll-hint').forEach((el, i) => {
                setTimeout(() => {
                    el.style.transition = 'opacity 1s cubic-bezier(0.22,1,0.36,1)';
                    el.style.opacity = '1';
                }, 700 + i * 100);
            });
        }, 350);
    }, 1500);

    // Hide extra hero elements initially
    document.querySelectorAll('.hero-social-left, .hero-fragment-wrap, .hero-scroll-hint').forEach(el => {
        el.style.opacity = '0';
    });

    /* ════════════════════════════════════
       BLUR-WORD ANIMATION ENGINE
       Ported from React blur-text-animation component to vanilla JS.
       Animates each word in the hero taglines with cinematic blur + 3D reveal.
    ════════════════════════════════════ */
    function initBlurWordAnimation(selector, startDelay = 2200, loopDelay = 7000) {
        const el = document.querySelector(selector);
        if (!el) return;

        // Wrap each word in an animated span
        const rawText = el.textContent.trim();
        const splitWords = rawText.split(' ');
        const totalWords = splitWords.length;

        const wordData = splitWords.map((word, index) => {
            const progress = index / totalWords;
            const exponentialDelay = Math.pow(progress, 0.8) * 0.5;
            const baseDelay = index * 0.06;
            const microVariation = (Math.random() - 0.5) * 0.05;
            return {
                text: word,
                duration: 2.2 + Math.cos(index * 0.3) * 0.3,
                delay:    baseDelay + exponentialDelay + microVariation,
                blur:     12 + Math.floor(Math.random() * 8),
                scale:    0.9 + Math.sin(index * 0.2) * 0.05
            };
        });

        // Build HTML
        el.innerHTML = wordData.map((w, i) =>
            `<span class="blur-word" data-index="${i}"></span>`
        ).join('');

        const spans = el.querySelectorAll('.blur-word');
        spans.forEach((span, i) => {
            span.textContent = wordData[i].text;
            span.style.transitionDuration      = `${wordData[i].duration}s`;
            span.style.transitionTimingFunction = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            // Initial hidden state
            span.style.transitionDelay = '0s';
        });

        // Calculate how long the full reveal takes
        let maxTime = 0;
        wordData.forEach(w => { maxTime = Math.max(maxTime, w.delay + w.duration); });

        let animTimer = null;
        let loopTimer = null;

        function reveal() {
            spans.forEach((span, i) => {
                span.style.transitionDelay = `${wordData[i].delay}s`;
                span.classList.remove('is-hidden');
                span.classList.add('is-visible');
            });
            // After full reveal, schedule hide + loop
            animTimer = setTimeout(() => {
                spans.forEach(span => {
                    span.style.transitionDelay = '0s';
                    span.classList.remove('is-visible');
                    span.classList.add('is-hidden');
                });
                loopTimer = setTimeout(reveal, loopDelay);
            }, (maxTime + 6.0) * 1000);
        }

        // Kick off after page intro delay
        setTimeout(reveal, startDelay);
    }

    // Animate primary tagline (starts at 2.2s after page load)
    initBlurWordAnimation('.hero-tagline-primary', 2200, 3000);
    // Animate secondary tagline (starts 0.6s after primary for cascade feel)
    initBlurWordAnimation('.hero-tagline-secondary', 2800, 3000);

    /* ════════════════════════════════════
       NAVBAR SCROLL BEHAVIOR
    ════════════════════════════════════ */
    const heroSection = document.getElementById('inicio');
    window.addEventListener('scroll', () => {
        // Show navbar ONLY after scrolling past the Hero
        const triggerHeight = heroSection ? window.innerHeight * 0.9 : 60;
        
        if (window.scrollY > triggerHeight) {
            navbar.classList.add('scrolled');
            navbar.classList.remove('hidden-top');
        } else {
            navbar.classList.remove('scrolled');
            // Only hide it completely if it's the home page with a Hero
            if (heroSection) {
                navbar.classList.add('hidden-top');
            }
        }
    }, { passive: true });

    const heroScrollBtn = document.getElementById('hero-scroll-btn');
    if (heroScrollBtn) {
        heroScrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const offset = window.innerHeight;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        });
    }

    /* ════════════════════════════════════
       SCROLL REVEAL ENGINE
    ════════════════════════════════════ */

    // 1. Standard fade-in-up / fade-in-left / fade-in-right / fade-in
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .fade-in, .valor-reveal-1, .valor-reveal-2, .valor-reveal-3, .valor-reveal-4, .valor-reveal-5, .valor-reveal-6').forEach(el => {
        revealObserver.observe(el);
    });

    // Premium Text Masking
    document.querySelectorAll('.reveal-mask').forEach(el => {
        const content = el.innerHTML;
        el.innerHTML = `<span class="reveal-mask-line"><span class="reveal-mask-inner">${content}</span></span>`;
        revealObserver.observe(el);
    });

    // Typewriter Reveal Effect (Ported from useAnimatedText React hook)
    const typewriterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (el.dataset.animated) return;
                el.dataset.animated = 'true';
                
                const parseString = el.dataset.original.replace(/<br\s*\/?>/gi, '¶');
                const parts = parseString.split(''); 
                const totalLength = parts.length;
                
                // Adjust duration based on text length (longer text = slightly longer duration)
                const durationMs = Math.min(Math.max(totalLength * 15, 800), 2500);
                const startTime = performance.now();
                
                // easeOut function
                const easeOut = t => 1 - Math.pow(1 - t, 3);
                
                el.style.opacity = '1';

                function update(time) {
                    const elapsed = time - startTime;
                    let progress = Math.min(elapsed / durationMs, 1);
                    progress = easeOut(progress);
                    
                    const cursor = Math.floor(progress * totalLength);
                    const currentText = parts.slice(0, cursor).join('');
                    
                    el.innerHTML = currentText.replace(/¶/g, '<br>');
                    
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        // Ensure original HTML is fully restored at the end
                        el.innerHTML = el.dataset.original;
                    }
                }
                
                requestAnimationFrame(update);
                typewriterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.typewriter-reveal').forEach(el => {
        el.dataset.original = el.innerHTML;
        // Fix height so layout doesn't jump during typing
        el.style.minHeight = el.offsetHeight + 'px';
        el.style.opacity = '0'; // Hide initially until typing starts
        el.innerHTML = '';
        typewriterObserver.observe(el);
    });

    // --- TEXT BLUR IN REVEAL (Ported from React TextBlurIn component) ---
    const blurInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (el.dataset.animated) return;
                el.dataset.animated = 'true';
                
                const spans = el.querySelectorAll('.blur-word-in');
                spans.forEach((span, index) => {
                    setTimeout(() => {
                        span.style.opacity = '1';
                        span.style.filter = 'blur(0px)';
                        span.style.transform = 'translateY(0)';
                    }, index * 40); // 40ms stagger per word
                });
                
                blurInObserver.unobserve(el);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.text-blur-in').forEach(el => {
        const text = el.textContent.trim();
        const words = text.split(/\s+/);
        el.innerHTML = words.map(word => 
            `<span class="blur-word-in" style="display:inline-block; opacity:0; filter:blur(10px); transform:translateY(5px); transition:opacity 0.8s ease-out, filter 0.8s ease-out, transform 0.8s ease-out;">${word}</span>`
        ).join(' ');
        blurInObserver.observe(el);
    });

    // --- WORD FADE IN REVEAL (Ported from React WordFadeIn component) ---
    const wordFadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (el.dataset.animated) return;
                el.dataset.animated = 'true';
                
                const spans = el.querySelectorAll('.word-fade-span');
                spans.forEach((span, index) => {
                    setTimeout(() => {
                        span.style.opacity = '1';
                        span.style.transform = 'translateY(0)';
                    }, index * 100); // 100ms stagger per word as per typical framer motion configs
                });
                
                wordFadeInObserver.unobserve(el);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.word-fade-in').forEach(el => {
        const text = el.textContent.trim();
        const words = text.split(/\s+/);
        el.innerHTML = words.map(word => 
            `<span class="word-fade-span" style="display:inline-block; opacity:0; transform:translateY(10px); transition:opacity 0.5s ease-out, transform 0.5s ease-out;">${word}</span>`
        ).join(' ');
        wordFadeInObserver.observe(el);
    });

    /* ════════════════════════════════════
       MAGNETIC HOVER EFFECT & PARALLAX
    ════════════════════════════════════ */
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
            btn.style.transition = 'transform 0.7s var(--ease-premium)';
        });
        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'none';
        });
    });

    const parallaxBg = document.querySelector('.parallax-bg');
    if (parallaxBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            parallaxBg.style.transform = `translateY(${scrolled * 0.15}px)`;
        }, { passive: true });
    }

    // 2. Animated rules (lines that draw themselves)
    document.querySelectorAll('.reveal-line, .reveal-line-v, .line-wrap').forEach(el => revealObserver.observe(el));

    // 3. Stagger grids — assign --stagger-i to each child automatically
    document.querySelectorAll('.stagger-grid').forEach(grid => {
        const items = grid.querySelectorAll('.stagger-item');
        items.forEach((item, i) => {
            item.style.setProperty('--stagger-i', i);
        });

        const gridObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.stagger-item').forEach(item => {
                        item.classList.add('visible');
                    });
                    gridObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        gridObserver.observe(grid);
    });

    // 4. Section heading split reveal (eyebrow text slides left-to-right with clip)
    document.querySelectorAll('.reveal-heading').forEach(el => {
        el.style.clipPath = 'inset(0 100% 0 0)';
        el.style.transition = 'clip-path 0.9s cubic-bezier(0.22,1,0.36,1)';

        const headingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.clipPath = 'inset(0 0% 0 0)';
                    headingObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        headingObserver.observe(el);
    });

    /* ════════════════════════════════════
       NAVEGACIÓN — menú móvil, desplegables y anclas
       Fuente única de verdad: setMenu(abierto).
       Un solo listener delegado gestiona TODOS los enlaces (sin duplicados).
    ════════════════════════════════════ */
    if (!window.__ffNavInit) {          // evita listeners duplicados si el script se ejecuta dos veces
        window.__ffNavInit = true;

        const mobileBtn   = document.getElementById('mobileMenuBtn');
        const navMenu     = document.getElementById('navMenu') || document.querySelector('.nav-menu');
        const navGroupBtns = document.querySelectorAll('.nav-group-btn');
        const desktopMQ   = window.matchMedia('(min-width: 1201px)');

        let menuAbierto = false;   // ← estado único
        let scrollGuardado = 0;

        const cerrarGrupos = (excepto) => {
            navGroupBtns.forEach(b => { if (b !== excepto) b.setAttribute('aria-expanded', 'false'); });
        };

        /* Bloqueo/desbloqueo de scroll (position:fixed, seguro en iOS) */
        const bloquearScroll = () => {
            scrollGuardado = window.scrollY || window.pageYOffset || 0;
            document.body.style.top = `-${scrollGuardado}px`;
            document.body.classList.add('menu-locked');
        };
        const desbloquearScroll = () => {
            if (!document.body.classList.contains('menu-locked')) return;
            document.body.classList.remove('menu-locked');
            document.body.style.top = '';
            // 'instant' evita que el scroll-behavior:smooth del html anime este salto
            window.scrollTo({ top: scrollGuardado, left: 0, behavior: 'instant' });
        };

        /* ÚNICA función que cambia el estado del menú */
        const setMenu = (abrir) => {
            if (!navMenu) return;
            abrir = !!abrir;
            if (abrir === menuAbierto) return;      // idempotente
            menuAbierto = abrir;

            navMenu.classList.toggle('open', abrir);
            document.body.classList.toggle('nav-open', abrir);

            if (mobileBtn) {
                mobileBtn.classList.toggle('open', abrir);
                mobileBtn.setAttribute('aria-expanded', String(abrir));
                mobileBtn.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
            }

            if (abrir) {
                bloquearScroll();
            } else {
                desbloquearScroll();
                cerrarGrupos();
            }
        };

        if (mobileBtn && navMenu) {
            mobileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                setMenu(!menuAbierto);
            });
        }

        /* Desplegables del nav */
        navGroupBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const abierto = btn.getAttribute('aria-expanded') === 'true';
                cerrarGrupos(btn);
                btn.setAttribute('aria-expanded', String(!abierto));
            });
        });

        /* Tocar el fondo del panel (no un enlace) lo cierra */
        if (navMenu) {
            navMenu.addEventListener('click', (e) => {
                if (e.target === navMenu) setMenu(false);
            });
        }

        /* Clic fuera: cierra los desplegables abiertos */
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-group')) cerrarGrupos();
        });

        /* Escape: cierra y devuelve el foco */
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            cerrarGrupos();
            if (menuAbierto) {
                setMenu(false);
                if (mobileBtn) mobileBtn.focus();
            }
        });

        /* Al pasar a escritorio, el panel debe cerrarse SIEMPRE:
           la hamburguesa se oculta y el usuario quedaría sin forma de
           desbloquear el scroll (causa del congelamiento). */
        const alCambiarBreakpoint = (ev) => { if (ev.matches) setMenu(false); };
        if (desktopMQ.addEventListener) desktopMQ.addEventListener('change', alCambiarBreakpoint);
        else desktopMQ.addListener(alCambiarBreakpoint);            // Safari antiguo

        /* Red de seguridad: si algo deja el scroll bloqueado sin menú abierto */
        window.addEventListener('pageshow', () => {
            if (!menuAbierto) desbloquearScroll();
        });

        /* ── Enlaces: UN SOLO listener delegado para todo el documento ──
           Sustituye a los dos bucles previos (.nav-menu a y a[href^="#"]),
           que registraban dos handlers sobre el mismo enlace. */
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link || e.defaultPrevented) return;
            if (link.target === '_blank' || link.hasAttribute('download')) return;

            const href = link.getAttribute('href') || '';
            const enPanel = !!link.closest('.nav-menu');

            // 1) Cerrar el panel y devolver el scroll ANTES de navegar
            if (enPanel) setMenu(false);

            // 2) Solo interceptamos anclas de esta misma página
            if (!href.startsWith('#') || href.length < 2) return;

            let destino = null;
            try { destino = document.querySelector(href); } catch (err) { return; }
            if (!destino) return;

            e.preventDefault();

            // 3) Esperar un frame: el desbloqueo ya restauró la posición y el
            //    layout está estable, así que el cálculo del destino es correcto.
            requestAnimationFrame(() => {
                const nav = document.getElementById('navbar');
                const offset = (nav && getComputedStyle(nav).position === 'fixed' ? nav.offsetHeight : 0) + 16;
                const top = destino.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
                if (history.replaceState) history.replaceState(null, '', href);
            });
        });
    }

    /* ════════════════════════════════════
       BLUR FADE — equivalente nativo de <BlurFade inView/>
       useInView(ref, { once: true, margin: "-50px" })
    ════════════════════════════════════ */
    const blurFadeEls = document.querySelectorAll('.blur-fade');

    if (blurFadeEls.length) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduceMotion) {
            // Sin animación: el contenido aparece directamente
            blurFadeEls.forEach(el => el.classList.add('is-visible'));
        } else {
            // Se repite en cada entrada: al salir de pantalla vuelve al estado
            // "hidden" (sin transición) y se anima de nuevo al reaparecer.
            const blurFadeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    entry.target.classList.toggle('is-visible', entry.isIntersecting);
                });
            }, { rootMargin: '-50px' });

            blurFadeEls.forEach(el => {
                // delay personalizado por elemento: data-bf-delay-ms="250"
                const ms = el.dataset.bfDelayMs;
                if (ms) el.style.setProperty('--bf-delay', (parseFloat(ms) / 1000) + 's');
                blurFadeObserver.observe(el);
            });
        }
    }

    /* ════════════════════════════════════
       ANIMATED GROUP — equivalente nativo de <AnimatedGroup preset="..."/>
       El contenedor escalona a sus hijos (staggerChildren: 0.1)
    ════════════════════════════════════ */
    const animatedGroups = document.querySelectorAll('.animated-group');

    if (animatedGroups.length) {
        const reduceMotionAG = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Índice de cada hijo -> retardo escalonado (var --ag-i)
        animatedGroups.forEach(group => {
            [...group.children].forEach((child, i) => {
                child.style.setProperty('--ag-i', i);
            });
        });

        if (reduceMotionAG) {
            animatedGroups.forEach(g => g.classList.add('is-visible'));
        } else {
            const groupObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    entry.target.classList.toggle('is-visible', entry.isIntersecting);
                });
            }, { rootMargin: '-50px' });

            animatedGroups.forEach(g => groupObserver.observe(g));
        }
    }

    /* ════════════════════════════════════
       TEXT REVEAL — entrada tipo <TextRotate/> (sin rotación)
       Parte el texto en palabras o caracteres y los sube escalonados.
    ════════════════════════════════════ */
    const trEls = document.querySelectorAll('.tr-reveal');

    if (trEls.length) {
        const trReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Soporta unicode/emoji igual que splitIntoCharacters del componente
        const splitChars = (txt) => {
            if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
                const seg = new Intl.Segmenter('es', { granularity: 'grapheme' });
                return Array.from(seg.segment(txt), s => s.segment);
            }
            return Array.from(txt);
        };

        trEls.forEach(el => {
            if (el.dataset.trReady) return;

            const modo = el.dataset.trSplit === 'characters' ? 'characters' : 'words';
            const textoPlano = el.textContent.replace(/\s+/g, ' ').trim();
            let i = 0;

            // Reconstruye el contenido conservando etiquetas inline (<b>, <em>, <a>…)
            const procesar = (nodo) => {
                const salida = document.createDocumentFragment();
                nodo.childNodes.forEach(hijo => {
                    if (hijo.nodeType === Node.TEXT_NODE) {
                        const partes = hijo.textContent.split(/(\s+)/);
                        partes.forEach(parte => {
                            if (!parte) return;
                            if (/^\s+$/.test(parte)) { salida.appendChild(document.createTextNode(' ')); return; }
                            const w = document.createElement('span');
                            w.className = 'tr-word';
                            const trozos = modo === 'characters' ? splitChars(parte) : [parte];
                            trozos.forEach(t => {
                                const c = document.createElement('span');
                                c.className = 'tr-char';
                                c.style.setProperty('--tr-i', i++);
                                c.textContent = t;
                                w.appendChild(c);
                            });
                            salida.appendChild(w);
                        });
                    } else if (hijo.nodeType === Node.ELEMENT_NODE) {
                        const clon = hijo.cloneNode(false);
                        clon.appendChild(procesar(hijo));
                        salida.appendChild(clon);
                    }
                });
                return salida;
            };

            const animado = document.createElement('span');
            animado.setAttribute('aria-hidden', 'true');
            animado.appendChild(procesar(el));

            const sr = document.createElement('span');
            sr.className = 'tr-sr';
            sr.textContent = textoPlano;

            el.textContent = '';
            el.appendChild(sr);
            el.appendChild(animado);
            el.dataset.trReady = '1';
        });

        if (trReduce) {
            trEls.forEach(el => el.classList.add('is-visible'));
        } else {
            const trObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    entry.target.classList.toggle('is-visible', entry.isIntersecting);
                });
            }, { rootMargin: '-50px' });
            trEls.forEach(el => trObserver.observe(el));
        }
    }

    /* ════════════════════════════════════
       TESTIMONIOS — carrusel deslizable (solo móvil)
       En escritorio la rejilla queda intacta y el carrusel se apaga.
    ════════════════════════════════════ */
    (function () {
        const pista = document.querySelector('.testimonios-grid');
        const dots  = document.getElementById('tstDots');
        if (!pista || !dots) return;

        const tarjetas = [...pista.querySelectorAll('.testimonio-card')];
        if (tarjetas.length < 2) return;

        const movilMQ  = window.matchMedia('(max-width: 860px)');
        const menosMov = window.matchMedia('(prefers-reduced-motion: reduce)');

        let activo = 0, autoplay = null, observer = null, pausado = false;

        let tween = null;

        /* Desplazamiento animado con requestAnimationFrame en vez de
           scrollTo({behavior:'smooth'}): así la duración y la curva son las
           mismas en todos los motores y no dependen del scroll-behavior
           heredado del documento (el html usa smooth, y sobre contenedores
           con scroll-snap el comportamiento nativo varía entre Safari y
           Chrome). Si el usuario prefiere menos movimiento, salta directo. */
        const irA = (i, suave = true) => {
            const t = tarjetas[i];
            if (!t) return;
            const destino = Math.max(0, Math.min(
                t.offsetLeft - pista.offsetLeft - (pista.clientWidth - t.clientWidth) / 2,
                pista.scrollWidth - pista.clientWidth
            ));

            if (tween) cancelAnimationFrame(tween);
            if (!suave || menosMov.matches) { pista.scrollLeft = destino; return; }

            const inicio = pista.scrollLeft;
            const delta  = destino - inicio;
            if (Math.abs(delta) < 1) return;
            const DUR = 460;
            const t0 = performance.now();
            const easeOutCubic = (p) => 1 - Math.pow(1 - p, 3);

            const paso = (ahora) => {
                const p = Math.min(1, (ahora - t0) / DUR);
                pista.scrollLeft = inicio + delta * easeOutCubic(p);
                if (p < 1) tween = requestAnimationFrame(paso);
                else tween = null;
            };
            tween = requestAnimationFrame(paso);
        };

        const marcar = (i) => {
            activo = i;
            [...dots.children].forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
            // La tarjeta centrada toma el foco visual (ver .is-active en styles.css)
            tarjetas.forEach((t, k) => t.classList.toggle('is-active', k === i));
        };

        const pararAuto = () => { clearInterval(autoplay); autoplay = null; };
        const iniciarAuto = () => {
            pararAuto();
            if (menosMov.matches || pausado) return;
            autoplay = setInterval(() => {
                irA((activo + 1) % tarjetas.length);
            }, 5000);
        };

        const activar = () => {
            if (observer) return;                       // ya activo

            dots.innerHTML = '';
            tarjetas.forEach((_, i) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'tst-dot';
                b.setAttribute('role', 'tab');
                b.setAttribute('aria-label', `Ver testimonio ${i + 1} de ${tarjetas.length}`);
                b.setAttribute('aria-current', String(i === 0));
                b.addEventListener('click', () => {
                    pausado = true; pararAuto();        // el usuario manda: se detiene el automático
                    irA(i);
                });
                dots.appendChild(b);
            });

            // El punto activo lo dicta la tarjeta más visible dentro de la pista
            observer = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting && e.intersectionRatio > 0.6) {
                        marcar(tarjetas.indexOf(e.target));
                    }
                });
            }, { root: pista, threshold: [0.6] });
            tarjetas.forEach(t => observer.observe(t));
            marcar(0);   // estado inicial antes del primer disparo del observer

            // Cualquier gesto del usuario cancela el avance automático
            ['pointerdown', 'touchstart', 'wheel'].forEach(ev =>
                pista.addEventListener(ev, () => { pausado = true; pararAuto(); }, { passive: true })
            );

            iniciarAuto();
        };

        const desactivar = () => {
            pararAuto();
            if (observer) { observer.disconnect(); observer = null; }
            dots.innerHTML = '';
            tarjetas.forEach(t => t.classList.remove('is-active'));
            pista.scrollLeft = 0;                        // deja la rejilla en su sitio
        };

        const evaluar = () => { movilMQ.matches ? activar() : desactivar(); };
        evaluar();
        if (movilMQ.addEventListener) movilMQ.addEventListener('change', evaluar);
        else movilMQ.addListener(evaluar);
    })();

    /* SMOOTH SCROLLING — unificado en el listener delegado de NAVEGACIÓN.
       Antes existía aquí un segundo bucle sobre a[href^="#"] que registraba
       un handler adicional en los mismos enlaces del menú: dos rutas de
       cierre distintas compitiendo, con lógica de desbloqueo duplicada. */

    /* ════════════════════════════════════
       ACTIVE NAV LINK TRACKING
    ════════════════════════════════════ */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active-link', link.getAttribute('href') === `#${entry.target.id}`);
                });
            }
        });
    }, { threshold: 0.35 });

    sections.forEach(s => sectionObserver.observe(s));

    /* ════════════════════════════════════
       FIRMA ANIMADA — la caligrafía se "escribe" al entrar en vista
       (y se vuelve a firmar cada vez que la sección reaparece)
    ════════════════════════════════════ */
    const firmaVideo = document.querySelector('.promesa-signature-video');
    if (firmaVideo) {
        const firmaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    try { firmaVideo.currentTime = 0; } catch (e) {}
                    const p = firmaVideo.play();
                    if (p && p.catch) p.catch(() => {});
                }
            });
        }, { threshold: 0.4 });
        firmaObserver.observe(firmaVideo);
    }

    /* ════════════════════════════════════
       VALOR CARD — subtle scale on hover via JS (touch fallback)
    ════════════════════════════════════ */
    document.querySelectorAll('.valor-card, .area-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'background 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1)';
        });
    });

    /* ════════════════════════════════════
       MOBILE RADIAL NAVIGATION (App-like UI)
    ════════════════════════════════════ */
    const radialNav = document.querySelector('.mobile-radial-nav');
    const radialFab = document.getElementById('radial-fab-trigger');
    const radialTabBtns = document.querySelectorAll('.radial-tab-btn');
    const hPanels = document.querySelectorAll('.h-panel');

    if (radialNav && radialFab && radialTabBtns.length > 0 && hPanels.length > 0) {
        
        // Init active state for the first panel
        if (window.innerWidth < 900) {
            hPanels[0].classList.add('active-panel');
        }

        // Toggle radial menu
        radialFab.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent document click from firing immediately
            radialNav.classList.toggle('is-open');
        });

        // Close menu if clicking outside
        document.addEventListener('click', (e) => {
            if (radialNav.classList.contains('is-open') && !radialNav.contains(e.target)) {
                radialNav.classList.remove('is-open');
            }
        });

        // Handle button clicks
        radialTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active classes
                radialTabBtns.forEach(b => b.classList.remove('active'));
                hPanels.forEach(p => p.classList.remove('active-panel'));
                
                // Add active to clicked btn
                btn.classList.add('active');
                
                // Show target panel
                const targetId = btn.getAttribute('data-target');
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.add('active-panel');
                    
                    // Scroll to the top of the panels area so it's fully visible
                    const track = document.getElementById('h-track');
                    if (track) {
                        window.scrollTo({
                            top: track.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
                
                // Close radial menu
                radialNav.classList.remove('is-open');
            });
        });
        
        // Handle resize layout changes
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 900) {
                hPanels.forEach(p => p.classList.remove('active-panel'));
                radialNav.classList.remove('is-open'); // ensure closed
            } else {
                const hasActive = Array.from(hPanels).some(p => p.classList.contains('active-panel'));
                if (!hasActive && hPanels[0]) {
                    hPanels[0].classList.add('active-panel');
                    radialTabBtns[0].classList.add('active');
                }
            }
        });
    }

    /* ════════════════════════════════════
       PLANES — Toggle Mensual / Anual
    ════════════════════════════════════ */
    const pricingToggle = document.getElementById('pricingToggle');
    const pricingPill = document.getElementById('pricingTogglePill');

    if (pricingToggle && pricingPill) {
        const toggleBtns = pricingToggle.querySelectorAll('.pricing-toggle-btn');
        const amountValues = document.querySelectorAll('.pricing-card-price .amount-value');
        const annualNotes = document.querySelectorAll('.pricing-card-price .annual-note');

        const formatMXN = (n) => Number(n).toLocaleString('es-MX');

        const movePill = (btn) => {
            pricingPill.style.width = `${btn.offsetWidth}px`;
            pricingPill.style.transform = `translateX(${btn.offsetLeft - 6}px)`;
        };

        const setMode = (mode) => {
            toggleBtns.forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
            const activeBtn = pricingToggle.querySelector(`.pricing-toggle-btn[data-mode="${mode}"]`);
            if (activeBtn) movePill(activeBtn);

            amountValues.forEach(el => {
                const value = mode === 'monthly' ? el.dataset.monthly : el.dataset.annual;
                el.classList.add('is-updating');
                setTimeout(() => {
                    el.textContent = formatMXN(value);
                    el.classList.remove('is-updating');
                }, 150);
            });

            annualNotes.forEach(el => {
                const text = mode === 'monthly' ? el.dataset.monthlyNote : el.dataset.annualNote;
                if (text) el.textContent = text;
            });
        };

        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => setMode(btn.dataset.mode));
        });

        const syncPill = () => {
            const activeBtn = pricingToggle.querySelector('.pricing-toggle-btn.active') || toggleBtns[0];
            movePill(activeBtn);
        };

        requestAnimationFrame(syncPill);
        window.addEventListener('resize', syncPill);
    }

    /* ════════════════════════════════════
       RADAR LEGAL — ALTA DE SUSCRIPTORES
       No hay proveedor de email marketing conectado todavía
       (Brevo queda pendiente de credenciales). Mientras tanto,
       en vez de simular un envío que nunca llega a ningún lado,
       el formulario abre un correo pre-llenado hacia el despacho
       para no perder al lead. Para migrar a Brevo: sustituir el
       bloque `mailto:` por un fetch() al Form Action URL real.
    ════════════════════════════════════ */
    document.querySelectorAll('#radar-form, #article-radar-form').forEach((form) => {
        const msg = form.querySelector('[role="status"]');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = form.querySelector('input[type="email"]');
            const privacyInput = form.querySelector('input[type="checkbox"]');
            const etiquetaInput = form.querySelector('input[name="etiqueta"]');
            const email = emailInput ? emailInput.value.trim() : '';
            const etiqueta = etiquetaInput ? etiquetaInput.value : 'radar';

            if (privacyInput && !privacyInput.checked) {
                if (msg) {
                    msg.textContent = 'Debes aceptar el aviso de privacidad para continuar.';
                    msg.style.color = '#900';
                }
                return;
            }

            if (typeof trackEvent === 'function') {
                trackEvent('radar_alta', { etiqueta, email_dominio: email.split('@')[1] || '' });
            }

            const subject = encodeURIComponent('Alta Radar Legal FF');
            const body = encodeURIComponent(`Quiero suscribirme al Radar Legal FF.\n\nCorreo: ${email}\nOrigen: ${etiqueta}`);
            window.location.href = `mailto:contacto@ferrofragoso.com?subject=${subject}&body=${body}`;

            if (msg) {
                msg.textContent = 'Se abrió tu correo para confirmar la suscripción. Si no se abrió automáticamente, escríbenos a contacto@ferrofragoso.com.';
                msg.style.color = 'var(--carbon, #2e2c2a)';
            }
            form.reset();
        });
    });
    /* ════════════════════════════════════
       HOME SOLUTIONS LANES TOGGLE
       Controls switching between "Para mí" and "Para mi empresa" lanes in the pricing section.
    ════════════════════════════════════ */
    const solutionsSection = document.getElementById('soluciones');
    if (solutionsSection) {
        const toggleButtons = solutionsSection.querySelectorAll('.toggle button');
        const lanes = solutionsSection.querySelectorAll('.lane');
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                toggleButtons.forEach(x => x.classList.remove('active'));
                btn.classList.add('active');
                
                const targetLaneId = btn.getAttribute('data-lane');
                lanes.forEach(lane => {
                    lane.classList.toggle('active', lane.id === targetLaneId);
                });
                
                // Smooth scroll to the top of the solutions section to keep layout aligned
                solutionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    // --- TIMELINE DE CÓMO FUNCIONA ---
    (function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('.timeline-item').forEach(item => {
                item.classList.add('is-visible', 'is-active');
            });
            const progress = document.querySelector('.timeline-progress');
            if (progress) progress.style.height = '100%';
            return;
        }

        const items = document.querySelectorAll('.timeline-item');
        if (items.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        items.forEach(item => observer.observe(item));

        const section = document.getElementById('como-funciona-timeline');
        const track = document.querySelector('.timeline-track');
        const progress = document.querySelector('.timeline-progress');

        if (!section || !track || !progress) return;

        let isScrolling = false;

        function updateTimeline() {
            const sectionRect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            const startPoint = viewportHeight / 2;
            const totalHeight = sectionRect.height;
            const currentPosition = startPoint - sectionRect.top;

            let percentage = (currentPosition / totalHeight) * 100;
            percentage = Math.max(0, Math.min(100, percentage));

            progress.style.height = `${percentage}%`;

            items.forEach(item => {
                const numberNode = item.querySelector('.timeline-number');
                if (!numberNode) return;
                
                const numRect = numberNode.getBoundingClientRect();
                const numCenterY = numRect.top + (numRect.height / 2);
                
                if (numCenterY <= viewportHeight / 2) {
                    item.classList.add('is-active');
                } else {
                    item.classList.remove('is-active');
                }
            });

            isScrolling = false;
        }

        window.addEventListener('scroll', function () {
            if (!isScrolling) {
                window.requestAnimationFrame(updateTimeline);
                isScrolling = true;
            }
        }, { passive: true });

        window.addEventListener('resize', function () {
            window.requestAnimationFrame(updateTimeline);
        });

        updateTimeline();
    })();

});
