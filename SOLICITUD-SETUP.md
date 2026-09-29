# Formulario de solicitud — reemplazo de WhatsApp en todo el sitio

[`solicitud.html`](solicitud.html) es la pieza que le faltaba al flujo "Elige y paga → Cuéntanos tu caso → Un abogado entrega" que `index.html` ya prometía en su sección "Cómo funciona", pero que hasta ahora no existía: el cliente elige **cualquier** servicio o membresía del catálogo, deja sus datos, y recibe su folio al instante — sin pasar por WhatsApp.

**No necesita configuración nueva de Notion** si ya seguiste `SEGUIMIENTO-SETUP.md` — usa la misma base, el mismo token. Solo agrega las 2 columnas nuevas que se mencionan ahí (`Nombre` y `Detalle del cliente`).

## Ya no hay "productos elegibles" limitados

Antes esto solo aceptaba 3 productos que no necesitaban intake previo (el resto seguía yendo a WhatsApp). Ese límite se quitó: **el catálogo completo de `precios.js`** (servicios a la carta + membresías) está disponible aquí, salvo:

- Modificadores (`modificador: true` — ej. "envío certificado", "entrega exprés"): no son un producto en sí, son un extra sobre otro.
- `llamada_filtro`: es una llamada gratuita, va a Calendly directamente (ver `AGENDA-SETUP.md`), no a este formulario.

La lista de exclusiones vive en dos lugares que deben coincidir — `EXCLUIDOS` en [`api/solicitud.js`](api/solicitud.js) y `EXCLUIDOS` en el `<script>` de [`solicitud.html`](solicitud.html).

## Qué reemplaza al "intake" de WhatsApp

El campo **"Cuéntanos tu caso"** es literalmente el mismo lugar donde antes se escribía el mensaje de WhatsApp — la información que antes leía un abogado en el chat (qué marca, qué monto, qué evidencia hay) ahora llega igual, solo que con folio y seguimiento desde el primer momento, en vez de perderse en una conversación de chat.

Cómo llega un cliente aquí, según de dónde venga:

- **Con un producto ya decidido** (`solicitud.html?servicio=marca_esencial`): la página bloquea ese servicio y muestra su nombre y precio; hay un link "Elegir otro servicio" por si se equivocó.
- **Con contexto adicional prellenado** (`&detalle=...`): el textarea "Cuéntanos tu caso" llega prellenado con lo que antes hubiera sido el mensaje de WhatsApp. El cliente puede editarlo.
- **Sin nada** (entra directo a `solicitud.html`): ve un `<select>` con todo el catálogo y elige.

## Cuestionarios por producto (en vez del campo libre)

Para algunas familias de producto, "Cuéntanos tu caso" no basta — hace falta información puntual antes de poder cotizar o presentar un trámite. Esos productos muestran en su lugar un **cuestionario paso a paso** (una pregunta por pantalla, con una explicación de por qué se pide cada dato), inspirado en el flujo de registro de [enotar.io](https://www.enotar.io). Al terminar, las respuestas se compilan en el mismo campo `detalle` — el resto del formulario (nombre, correo, teléfono, folio, Notion) no cambia.

Hoy existe uno solo, para derechos de autor (`derecho_autor_esencial`, `derecho_autor_software`, `derecho_autor_blindaje`, `derecho_autor_portafolio`):

1. **Tipo de obra** — la rama con la que el INDAUTOR clasifica la obra.
2. **Título de la obra.**
3. **Nombre completo del autor** — quien la creó.
4. **Titularidad** — a quién le pertenecen los derechos (puede no ser el autor: obra por encargo, para un empleador, ya cedida).
5. **Nombre del titular** — *solo si la respuesta anterior no fue "a mí, como autor"* (paso condicional, se salta solo).
6. **Fecha de creación y si ya se divulgó.**
7. **Descripción breve** de la obra, para el expediente.

El archivo o ejemplar de la obra **no se pide aquí** — se sigue solicitando después de confirmar, por correo (no hay almacenamiento de archivos configurado; agregarlo, si algún día hace falta, es un cambio aparte).

**Para agregar un cuestionario a otra familia de producto:** edita el objeto `WIZARDS` en el `<script>` de [`solicitud.html`](solicitud.html) — un nuevo objeto con `ids` (los ids de `precios.js` que lo activan) y `steps` (cada paso con `key`, `tipo` [`'opciones'` | `'texto'` | `'textarea'`], `pregunta`, `info`, y opcionalmente `opciones` o `saltarSi`). No hay que tocar `api/solicitud.js` — el servidor solo recibe el `detalle` ya compilado, como si el cliente lo hubiera escrito de corrido.

## El folio

Se genera como `FF-{año}-{5 caracteres}` (timestamp en base36 + 3 al azar). No es secuencial — no hay una base de datos propia llevando un contador, así que no puedes usarlo para saber "cuántas solicitudes van este mes" contando el número. Si eso llega a importar, hay que mover la generación a un contador real (Vercel KV o una consulta a la propia base de Notion antes de crear la página).

## Pago

Si el servicio ya tiene `pago` configurado en `precios.js` (ver `PAGOS-SETUP.md`), la confirmación muestra un botón "Pagar ahora" con ese link. Si no, solo se le pide al cliente esperar el contacto del despacho — el expediente ya quedó creado de cualquier forma, con etapa "Recibido".

## Dónde quedó WhatsApp (a propósito)

No todo WhatsApp del sitio se quitó — solo el que representaba **elegir un producto**. Lo que sigue apuntando a WhatsApp es contacto general, no selección: el ícono de WhatsApp en la barra inferior de la app, el link del footer, y un par de "tengo una duda antes de decidir" que no tienen un producto detrás.

Quedaron **fuera de este cambio**, sin tocar, por estar deliberadamente fuera de alcance:

- `gracias.html` — es la página de "gracias por tu pago" (post-compra, no selección de producto); ahí pedir el comprobante por WhatsApp sigue teniendo sentido.
- `evaluacion.html` y `marca-diagnostico.html` — dos páginas huérfanas, sin enlace desde ningún menú del sitio desde antes de esta sesión; si están vivas en algún lugar (un anuncio, un link viejo), avísame y las paso también.

## Prueba

1. Entra a `tusitio.com/solicitud.html`, llena el formulario con un correo tuyo.
2. Debe aparecer un folio y (si el servicio elegido ya tiene link de pago) el botón "Pagar ahora".
3. Entra a `seguimiento.html` con ese folio y tu correo — debe aparecer el expediente recién creado, etapa "Recibido".
4. Prueba también con `?servicio=<algún-id>` en la URL — debe llegar con el servicio ya bloqueado.
5. Si algo falla, revisa los **Logs** de la función en Vercel (Deployments → tu deployment → Functions → `api/solicitud`).
