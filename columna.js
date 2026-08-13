/* ============================================================================
   LA COLUMNA — conector entre secciones
   ----------------------------------------------------------------------------
   Una sola columna jónica vive fija en pantalla y atraviesa todo el sitio.
   Tres estados:

     1. HERO     · gira sola, 360° continuos. Es el único momento decorativo.
     2. AL TOCAR · en cuanto el usuario hace scroll, el giro automático se corta
                   para siempre. A partir de ahí la columna solo obedece.
     3. CONECTOR · el giro lo manda el scroll, y se DETIENE en cada sección.
                   Eso es lo que la vuelve un conector y no un adorno: la
                   rotación marca en qué tramo del sitio estás.

   Cómo se logra el "gira y se detiene": entre dos secciones el avance no es
   lineal sino una curva con mesetas en los extremos. Cuando una sección está
   centrada, la columna se queda quieta; el giro ocurre en el tránsito.

   El fuste NO es una imagen. Un fuste estriado girando sobre su eje es
   exactamente un patrón vertical desplazándose en horizontal: se resuelve con
   un gradiente repetido y `background-position`. Así gira infinito y sin
   costura, mide lo que tenga que medir de alto, y no pesa un solo KB.
   ========================================================================== */
(function () {
  'use strict';

  const GRADOS_POR_SECCION = 96;   /* cuánto gira entre una sección y la siguiente */
  const MESETA = 0.18;             /* fracción de reposo al entrar y salir de cada sección */

  const spine = document.getElementById('columna-spine');
  if (!spine) return;

  const fuste = spine.querySelector('.columna-fuste');
  const capitel = spine.querySelector('.columna-capitel');
  const rail = document.getElementById('columna-rail');
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Las secciones se leen del DOM, no de una lista escrita a mano: si mañana
     se agrega o quita una sección, el conector se entera solo. */
  const secciones = [].slice.call(
    document.querySelectorAll('[data-columna-seccion]')
  );
  if (!secciones.length) return;

  /* ── Riel de marcas ─────────────────────────────────────────────────── */
  const marcas = [];
  if (rail) {
    secciones.forEach((sec, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'columna-marca';
      b.dataset.i = String(i);
      const etiqueta = sec.getAttribute('data-columna-seccion') || ('Sección ' + (i + 1));
      b.setAttribute('aria-label', 'Ir a ' + etiqueta);
      b.innerHTML = '<span class="columna-marca-linea"></span>' +
                    '<span class="columna-marca-txt">' + etiqueta + '</span>';
      b.addEventListener('click', () => {
        sec.scrollIntoView({
          behavior: quieto.matches ? 'auto' : 'smooth',
          block: 'start',
        });
      });
      rail.appendChild(b);
      marcas.push(b);
    });
  }

  /* ── Estado ─────────────────────────────────────────────────────────── */
  let tocado = false;      /* ¿el usuario ya hizo scroll alguna vez? */
  let activa = -1;
  let pedido = 0;

  /* Suaviza con mesetas en los extremos: 0 y 1 se mantienen planos un rato, y
     el movimiento se concentra en el tramo central. De ahí sale la sensación
     de que la columna "se detiene" en cada sección. */
  function conMesetas(p) {
    const t = Math.min(1, Math.max(0, (p - MESETA) / (1 - 2 * MESETA)));
    return t * t * (3 - 2 * t);
  }

  function medir() {
    const centro = window.scrollY + window.innerHeight * 0.5;

    /* Cuál sección manda ahora y cuánto se avanzó hacia la siguiente. */
    let i = 0;
    for (let k = 0; k < secciones.length; k++) {
      if (secciones[k].offsetTop <= centro) i = k;
    }
    const actual = secciones[i];
    const siguiente = secciones[i + 1];
    const desde = actual.offsetTop;
    const hasta = siguiente ? siguiente.offsetTop : desde + actual.offsetHeight;
    const bruto = hasta > desde ? (centro - desde) / (hasta - desde) : 0;
    const p = Math.min(1, Math.max(0, bruto));

    const giro = (i + conMesetas(p)) * GRADOS_POR_SECCION;
    spine.style.setProperty('--giro', giro.toFixed(2));

    if (i !== activa) {
      activa = i;
      marcas.forEach((m, k) => m.classList.toggle('is-activa', k === i));
      /* Se anuncia el tramo para lectores de pantalla sin robar el foco. */
      spine.setAttribute('data-seccion',
        actual.getAttribute('data-columna-seccion') || '');
    }
  }

  function alScroll() {
    if (!tocado) {
      /* El giro libre del hero se apaga al primer scroll y no vuelve. Que
         reapareciera después se sentiría como que la página tiene vida propia
         justo cuando el usuario está tratando de leer. */
      tocado = true;
      spine.classList.remove('columna--hero');
      spine.classList.add('columna--conector');
    }
    if (pedido) return;
    pedido = requestAnimationFrame(() => { pedido = 0; medir(); });
  }

  /* ── Arranque ───────────────────────────────────────────────────────── */
  if (quieto.matches) {
    /* Sin giro automático ni transiciones: la columna se queda quieta y el
       riel sigue sirviendo para navegar, que es su función útil. */
    spine.classList.add('columna--conector', 'columna--sin-giro');
    medir();
  } else {
    spine.classList.add('columna--hero');
    /* Si la página se abre ya desplazada (recarga a media altura), no tiene
       sentido mostrar el estado de hero. */
    if (window.scrollY > 4) alScroll();
    else medir();
  }

  window.addEventListener('scroll', alScroll, { passive: true });
  window.addEventListener('resize', () => { activa = -1; medir(); }, { passive: true });
  window.addEventListener('load', medir);
})();

/* ── El pictograma de la sección del miedo ──
   Un video en bucle corriendo bajo el pliegue gasta batería sin que nadie lo
   vea. Se pausa al salir de pantalla y se reanuda al volver. */
(function () {
  'use strict';
  var v = document.querySelector('.mono-video');
  if (!v) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    v.removeAttribute('autoplay');
    v.pause();
    return;
  }

  var arrancar = function () { var p = v.play(); if (p && p.catch) p.catch(function () {}); };

  new IntersectionObserver(function (e) {
    if (e[0].isIntersecting) arrancar(); else v.pause();
  }, { threshold: 0 }).observe(v);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) v.pause();
  });
})();
