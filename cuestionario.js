/* ════════════════════════════════════════════════════════════════════════
   CUESTIONARIO COMPARTIDO — cuestionario.js (+ cuestionario.css)
   ------------------------------------------------------------------------
   FFCuestionario.abrir(opciones) arma el cuestionario con el diseño de
   llamar-abogado.html y devuelve un control { cerrar, ir, final, respuestas }.

   opciones:
     contenedor   Elemento donde incrustarlo. Sin él se abre como modal.
     quien        Quién "habla" (por defecto "Ferro Fragoso").
     pasos        Lista de pasos (ver abajo).
     respuestas   Valores iniciales, por clave.
     alTerminar(respuestas, api)  Se llama al pulsar el botón del último paso.
                  Puede devolver una promesa; mientras tanto el botón se
                  deshabilita. Para mostrar un resultado usa api.final({...}).
     alCerrar()   Si existe, se muestra la ×. En modal cierra siempre.
     alCambiar(clave, valor, respuestas)  Aviso de cada cambio.

   Cada paso:
     clave        Nombre de la respuesta.
     tipo         'opciones' | 'multiple' | 'texto' | 'campo' | 'campos' |
                  'ficha' | 'contenido'
     titulo       Título corto en serif, arriba de la onda.
     texto        Lo que dice Ferro Fragoso (la pregunta).
     ayuda        Nota pequeña bajo la respuesta.
     opciones     [{ valor, etiqueta, detalle }] o cadenas.
     lista        true: opciones apiladas a lo ancho en vez de píldoras.
     avanzar      En 'opciones', pasar solo al elegir (por defecto true).
     exclusiva    En 'multiple', valor que desmarca a los demás ("Ninguno").
     entrada      En 'campo': { tipo, placeholder, inputmode, min, max, step,
                  maxlength, autocomplete }.
     area         En 'campo': usar área de texto.
     campos       En 'campos': [{ clave, etiqueta, tipo, placeholder,
                  opcional, autocomplete, inputmode, maxlength, opciones }].
     ficha        En 'ficha': [[etiqueta, valor], …]; nota: texto extra.
     render(caja, respuestas, api)  En 'contenido': pinta lo que quieras.
     opcional     La respuesta puede quedar vacía.
     cuando(respuestas)  Mostrar el paso solo si devuelve true.
     validar(valor, respuestas)  Devuelve un mensaje de error o nada.
     boton        Texto del botón en este paso.
     cuenta       false: no cuenta en el progreso (presentaciones).
   ════════════════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    const SVG_ATRAS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>';
    const SVG_CERRAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line></svg>';
    const ALTURAS = [20, 28, 41, 56, 75, 88, 100, 88, 75, 56, 41, 28, 20];
    let serie = 0;

    const el = (tag, clase, texto) => {
        const n = document.createElement(tag);
        if (clase) n.className = clase;
        if (texto != null) n.textContent = texto;
        return n;
    };
    const normalizarOpcion = (o) => (typeof o === 'string' ? { valor: o, etiqueta: o } : o);
    const vacio = (v) => v == null || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && !v.length);

    function abrir(cfg) {
        const id = 'ffq' + (++serie);
        const incrustado = !!cfg.contenedor;
        const quien = cfg.quien || 'Ferro Fragoso';
        const respuestas = Object.assign({}, cfg.respuestas || {});
        let indice = 0;
        let enFinal = false;
        let focoPrevio = document.activeElement;
        let temporizador = null;

        /* ── Estructura ── */
        const raiz = el('div', 'ffq ' + (incrustado ? 'ffq--incrustado' : 'ffq--modal'));
        if (!incrustado) {
            raiz.setAttribute('role', 'dialog');
            raiz.setAttribute('aria-modal', 'true');
            raiz.setAttribute('aria-labelledby', id + '-titulo');
        }
        const panel = el('div', 'ffq-panel');
        const barra = el('div', 'ffq-barra');
        const atras = el('button', 'ffq-chip');
        atras.type = 'button';
        atras.setAttribute('aria-label', 'Pregunta anterior');
        atras.innerHTML = SVG_ATRAS;
        const progreso = el('div', 'ffq-progreso');
        progreso.setAttribute('aria-hidden', 'true');
        const relleno = el('span');
        progreso.appendChild(relleno);
        const cuenta = el('span', 'ffq-cuenta');
        const cerrarBtn = el('button', 'ffq-chip');
        cerrarBtn.type = 'button';
        cerrarBtn.setAttribute('aria-label', 'Cerrar cuestionario');
        cerrarBtn.innerHTML = SVG_CERRAR;
        const conCerrar = !incrustado || typeof cfg.alCerrar === 'function';
        if (!conCerrar) cerrarBtn.hidden = true;
        barra.append(atras, progreso, cuenta, cerrarBtn);

        const titulo = el('h2', 'ffq-titulo');
        titulo.id = id + '-titulo';
        const onda = el('div', 'ffq-onda');
        onda.setAttribute('aria-hidden', 'true');
        onda.innerHTML = ALTURAS.map((h, i) =>
            '<i style="--h:' + h + '%;--d:' + (-(i * 0.17)).toFixed(2) + 's"></i>').join('');

        const dialogo = el('div', 'ffq-dialogo');
        dialogo.setAttribute('aria-live', 'polite');
        const quienEl = el('p', 'ffq-quien');
        quienEl.append(el('span'), document.createTextNode(quien));
        const texto = el('p', 'ffq-texto');
        dialogo.append(quienEl, texto);

        const respuesta = el('div', 'ffq-respuesta');
        const error = el('p', 'ffq-error');
        error.setAttribute('role', 'alert');
        const pie = el('div', 'ffq-pie');
        const sig = el('button', 'ffq-sig', 'Siguiente');
        sig.type = 'button';
        pie.appendChild(sig);

        panel.append(barra, titulo, onda, dialogo, respuesta, error, pie);
        raiz.appendChild(panel);

        if (incrustado) {
            cfg.contenedor.innerHTML = '';
            cfg.contenedor.appendChild(raiz);
        } else {
            document.body.appendChild(raiz);
            document.body.classList.add('ffq-abierto');
        }

        /* ── Utilidades ── */
        const visibles = () => cfg.pasos.filter((p) => !p.cuando || p.cuando(respuestas));
        const contables = () => visibles().filter((p) => p.cuenta !== false && p.tipo !== 'ficha');
        const pasoActual = () => visibles()[indice];

        function hablar() {
            onda.classList.add('habla');
            clearTimeout(temporizador);
            temporizador = setTimeout(() => onda.classList.remove('habla'), 1600);
        }

        function valorDe(p) {
            if (p.tipo === 'campos') {
                const o = {};
                p.campos.forEach((c) => { o[c.clave] = respuestas[c.clave]; });
                return o;
            }
            return respuestas[p.clave];
        }

        function errorDe(p) {
            if (p.tipo === 'ficha' || p.tipo === 'contenido') {
                return p.validar ? p.validar(null, respuestas) : null;
            }
            if (p.tipo === 'campos') {
                for (const c of p.campos) {
                    const v = respuestas[c.clave];
                    if (!c.opcional && vacio(v)) return 'Completa ' + (c.etiqueta || 'este dato').toLowerCase() + '.';
                    if (c.validar && !vacio(v)) {
                        const m = c.validar(v, respuestas);
                        if (m) return m;
                    }
                }
                return p.validar ? p.validar(valorDe(p), respuestas) : null;
            }
            const v = valorDe(p);
            if (!p.opcional && vacio(v)) {
                return p.tipo === 'opciones' || p.tipo === 'multiple' ? 'Elige una opción.' : 'Escribe tu respuesta.';
            }
            if (p.validar && !vacio(v)) return p.validar(v, respuestas) || null;
            return null;
        }

        /* El botón se apaga solo si falta algo obligatorio; un dato mal escrito
           deja el botón activo para que al pulsarlo se explique qué corregir. */
        function faltaAlgo(p) {
            if (p.tipo === 'ficha' || p.tipo === 'contenido') return false;
            if (p.tipo === 'campos') return p.campos.some((c) => !c.opcional && vacio(respuestas[c.clave]));
            return !p.opcional && vacio(respuestas[p.clave]);
        }

        function actualizarBoton() {
            const p = pasoActual();
            if (!p || enFinal) return;
            sig.disabled = faltaAlgo(p);
        }

        function cambiar(clave, valor) {
            respuestas[clave] = valor;
            error.textContent = '';
            if (cfg.alCambiar) cfg.alCambiar(clave, valor, respuestas);
            actualizarBoton();
        }

        /* ── Pintar un paso ── */
        function pintar() {
            enFinal = false;
            const lista = visibles();
            if (indice >= lista.length) indice = lista.length - 1;
            const p = lista[indice];
            respuesta.innerHTML = '';
            error.textContent = '';
            atras.disabled = indice === 0;

            const conteo = contables();
            const pos = conteo.indexOf(p);
            if (pos >= 0) {
                cuenta.textContent = (pos + 1) + '/' + conteo.length;
                relleno.style.width = (pos / conteo.length * 100) + '%';
            } else {
                const antes = conteo.filter((c) => lista.indexOf(c) < indice).length;
                cuenta.textContent = antes ? antes + '/' + conteo.length : '';
                relleno.style.width = (antes / Math.max(conteo.length, 1) * 100) + '%';
            }

            titulo.textContent = p.titulo || '';
            titulo.hidden = !p.titulo;
            texto.textContent = typeof p.texto === 'function' ? p.texto(respuestas) : (p.texto || '');
            dialogo.hidden = !texto.textContent;

            const ultimo = indice === lista.length - 1;
            sig.textContent = p.boton || (ultimo ? 'Terminar' : (p.tipo === 'ficha' ? 'Empezar' : 'Siguiente'));

            const tipo = p.tipo;
            if (tipo === 'opciones' || tipo === 'multiple') pintarOpciones(p);
            else if (tipo === 'texto' || tipo === 'campo') pintarCampo(p);
            else if (tipo === 'campos') pintarCampos(p);
            else if (tipo === 'ficha') pintarFicha(p);
            else if (tipo === 'contenido' && p.render) p.render(respuesta, respuestas, api);

            if (p.ayuda) respuesta.appendChild(el('p', 'ffq-ayuda', typeof p.ayuda === 'function' ? p.ayuda(respuestas) : p.ayuda));
            actualizarBoton();
            hablar();
        }

        function pintarOpciones(p) {
            const multiple = p.tipo === 'multiple';
            const cont = el('div', 'ffq-opciones' + (p.lista ? ' ffq-opciones--lista' : ''));
            cont.setAttribute('role', 'group');
            cont.setAttribute('aria-label', typeof p.texto === 'string' ? p.texto : (p.titulo || ''));
            const opciones = (typeof p.opciones === 'function' ? p.opciones(respuestas) : p.opciones).map(normalizarOpcion);
            const botones = [];
            const marcar = () => {
                const v = respuestas[p.clave];
                botones.forEach(({ b, o }) => {
                    const on = multiple ? (v || []).includes(o.valor) : v === o.valor;
                    b.setAttribute('aria-pressed', on ? 'true' : 'false');
                });
            };
            opciones.forEach((o) => {
                const b = el('button', 'ffq-op');
                b.type = 'button';
                b.textContent = o.etiqueta;
                if (o.detalle) b.appendChild(el('small', '', o.detalle));
                b.addEventListener('click', () => {
                    if (multiple) {
                        let v = (respuestas[p.clave] || []).slice();
                        if (p.exclusiva && o.valor === p.exclusiva) v = v.includes(o.valor) ? [] : [o.valor];
                        else {
                            v = v.filter((x) => x !== p.exclusiva);
                            v = v.includes(o.valor) ? v.filter((x) => x !== o.valor) : v.concat(o.valor);
                        }
                        cambiar(p.clave, v);
                        marcar();
                    } else {
                        cambiar(p.clave, o.valor);
                        marcar();
                        if (p.avanzar !== false) setTimeout(avanzar, 260);
                    }
                });
                botones.push({ b, o });
                cont.appendChild(b);
            });
            marcar();
            respuesta.appendChild(cont);
        }

        function crearControl(def, clave, etiquetaAria) {
            const e = def.entrada || def;
            let ctrl;
            if (def.area || e.tipo === 'area') {
                ctrl = el('textarea', 'ffq-area');
                ctrl.maxLength = e.maxlength || 1200;
            } else if (e.tipo === 'select') {
                ctrl = el('select', 'ffq-select');
                const vacia = el('option', '', e.placeholder || 'Elige una opción');
                vacia.value = '';
                ctrl.appendChild(vacia);
                (e.opciones || []).map(normalizarOpcion).forEach((o) => {
                    const op = el('option', '', o.etiqueta);
                    op.value = o.valor;
                    ctrl.appendChild(op);
                });
            } else {
                ctrl = el('input', 'ffq-input');
                ctrl.type = e.tipo || 'text';
                if (e.maxlength) ctrl.maxLength = e.maxlength;
                if (e.min != null) ctrl.min = e.min;
                if (e.max != null) ctrl.max = e.max;
                if (e.step != null) ctrl.step = e.step;
            }
            if (e.placeholder && ctrl.tagName !== 'SELECT') ctrl.placeholder = e.placeholder;
            if (e.inputmode) ctrl.inputMode = e.inputmode;
            if (e.autocomplete) ctrl.autocomplete = e.autocomplete;
            if (etiquetaAria) ctrl.setAttribute('aria-label', etiquetaAria);
            ctrl.value = respuestas[clave] != null ? respuestas[clave] : '';
            const evento = ctrl.tagName === 'SELECT' ? 'change' : 'input';
            ctrl.addEventListener(evento, () => cambiar(clave, ctrl.value));
            return ctrl;
        }

        function pintarCampo(p) {
            const def = p.tipo === 'texto' ? Object.assign({ area: true }, p) : p;
            const ctrl = crearControl(def, p.clave, typeof p.texto === 'string' ? p.texto : p.titulo);
            ctrl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && ctrl.tagName === 'INPUT') { e.preventDefault(); avanzar(); }
            });
            respuesta.appendChild(ctrl);
            setTimeout(() => ctrl.focus({ preventScroll: true }), 60);
        }

        function pintarCampos(p) {
            const cont = el('div', 'ffq-campos');
            p.campos.forEach((c, i) => {
                const campo = el('div', 'ffq-campo');
                const lab = el('label', '', c.etiqueta);
                const cid = id + '-' + c.clave;
                lab.htmlFor = cid;
                if (c.opcional) lab.appendChild(el('span', 'ffq-opcional', ' (opcional)'));
                const ctrl = crearControl(c, c.clave);
                ctrl.id = cid;
                campo.append(lab, ctrl);
                cont.appendChild(campo);
                if (i === 0) setTimeout(() => ctrl.focus({ preventScroll: true }), 60);
            });
            respuesta.appendChild(cont);
        }

        function pintarFicha(p) {
            if (p.ficha && p.ficha.length) {
                const dl = el('dl', 'ffq-ficha');
                p.ficha.forEach(([k, v]) => {
                    const fila = el('div');
                    fila.append(el('dt', '', k), el('dd', '', v));
                    dl.appendChild(fila);
                });
                respuesta.appendChild(dl);
            }
            if (p.nota) respuesta.appendChild(el('p', 'ffq-ayuda', p.nota));
        }

        /* ── Pantalla final (resultado) ── */
        function final(f) {
            enFinal = true;
            const conteo = contables();
            cuenta.textContent = conteo.length ? conteo.length + '/' + conteo.length : '';
            relleno.style.width = '100%';
            titulo.textContent = f.titulo || '';
            titulo.hidden = !f.titulo;
            texto.textContent = f.texto || '';
            dialogo.hidden = !f.texto;
            respuesta.innerHTML = '';
            error.textContent = '';
            if (f.contenido) respuesta.appendChild(f.contenido);
            atras.disabled = f.atras === false;
            pie.innerHTML = '';
            (f.botones || []).forEach((b, i) => {
                const n = el(b.href ? 'a' : 'button', i === 0 ? 'ffq-sig' : 'ffq-alt', b.texto);
                if (b.href) {
                    n.href = b.href;
                    if (b.nuevaPestana) { n.target = '_blank'; n.rel = 'noopener'; }
                } else n.type = 'button';
                if (b.accion) n.addEventListener('click', (e) => b.accion(e, respuestas, api));
                pie.appendChild(n);
            });
            hablar();
        }

        function restaurarPie() {
            if (pie.firstChild === sig && pie.children.length === 1) return;
            pie.innerHTML = '';
            pie.appendChild(sig);
        }

        /* ── Navegación ── */
        async function avanzar() {
            if (enFinal) return;
            const p = pasoActual();
            const m = errorDe(p);
            if (m) { error.textContent = m; return; }
            const lista = visibles();
            if (indice < lista.length - 1) {
                indice += 1;
                pintar();
                return;
            }
            if (cfg.alTerminar) {
                sig.disabled = true;
                const textoPrevio = sig.textContent;
                try {
                    const r = cfg.alTerminar(respuestas, api);
                    if (r && typeof r.then === 'function') { sig.textContent = 'Enviando…'; await r; }
                } catch (e) {
                    error.textContent = (e && e.message) || 'Algo salió mal. Intenta de nuevo.';
                } finally {
                    if (!enFinal) { sig.disabled = false; sig.textContent = textoPrevio; }
                }
            }
        }

        function retroceder() {
            if (enFinal) { restaurarPie(); enFinal = false; pintar(); return; }
            if (indice > 0) { indice -= 1; pintar(); }
        }

        function cerrar() {
            clearTimeout(temporizador);
            if (!incrustado) {
                raiz.remove();
                if (!document.querySelector('.ffq--modal')) document.body.classList.remove('ffq-abierto');
                document.removeEventListener('keydown', teclas);
                if (focoPrevio && focoPrevio.focus) focoPrevio.focus();
            }
            if (cfg.alCerrar) cfg.alCerrar(respuestas);
        }

        function ir(clave) {
            const i = visibles().findIndex((p) => p.clave === clave);
            if (i >= 0) { restaurarPie(); indice = i; pintar(); }
        }

        const teclas = (e) => { if (e.key === 'Escape') cerrar(); };

        sig.addEventListener('click', avanzar);
        atras.addEventListener('click', retroceder);
        cerrarBtn.addEventListener('click', cerrar);
        if (!incrustado) {
            raiz.addEventListener('click', (e) => { if (e.target === raiz) cerrar(); });
            document.addEventListener('keydown', teclas);
        }

        const api = { cerrar, ir, final, respuestas, avanzar, pintar, raiz };
        pintar();
        if (!incrustado) cerrarBtn.focus();
        return api;
    }

    window.FFCuestionario = { abrir };
})();
