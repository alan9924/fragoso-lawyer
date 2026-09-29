# Configurar el cobro en línea (Mercado Pago)

## Cómo quedó armado

[`precios.js`](precios.js) ya era la única fuente de verdad de precios; le faltaba la pieza que conecta un botón con su línea de cobro. Ya está:

- Cada servicio/membresía tiene un campo `pago` (y `pagoAnual` en membresías). Mientras esté vacío (`''`), **no pasa nada** — el botón conserva el link de WhatsApp que ya tiene.
- Un botón se marca con `data-servicio="id_del_catalogo"` en el HTML.
- `ffConectarCTAs()`, que corre solo al cargar la página, busca esos botones y si el servicio ya tiene `pago`, reemplaza el `href` por el link de cobro (y lo abre en pestaña nueva).

**Para activar el cobro de un servicio: pegas el link en `precios.js`, guardas, listo.** No hay que tocar el HTML de nuevo.

## Ya marqué las 5 membresías con precio fijo

En [`plan.html`](plan.html): `tranquilidad`, `familia`, `patrimonio`, `contratos_esenciales`, `direccion_ligera`. Dejé fuera **Dirección Externa** a propósito — su precio es "desde $6,990" (variable), su botón dice "Agendar diagnóstico" y necesita ese diagnóstico antes de poder cobrar un monto cerrado.

### Lo que hay que crear en Mercado Pago para esas 5

Usa **"Suscripciones"** (no "Link de pago" simple) porque son cobros recurrentes mensuales. En tu cuenta de Mercado Pago: **Tu negocio → Suscripciones → Crear plan de suscripción.**

| id en precios.js | Nombre | Cobro mensual | Cobro anual (10x, "2 meses gratis") |
|---|---|---|---|
| `tranquilidad` | Tranquilidad | $199 MXN | $1,990 MXN |
| `familia` | Familia | $399 MXN | $3,990 MXN |
| `patrimonio` | Patrimonio | $699 MXN | $6,990 MXN |
| `contratos_esenciales` | Contratos Esenciales | $1,990 MXN | $19,900 MXN |
| `direccion_ligera` | Dirección Ligera | $3,990 MXN | $39,900 MXN |

Por cada una puedes crear un plan mensual y, si quieres ofrecer el anual con descuento, un segundo plan de suscripción anual. Copia el link de cobro de cada plan y pégalo en `precios.js`:

```js
tranquilidad: { ..., pago: 'https://link-de-suscripcion-mensual', pagoAnual: 'https://link-de-suscripcion-anual' },
```

Si por ahora solo quieres ofrecer el mensual, deja `pagoAnual: ''` — el botón de "o $X/año" en `plan.html` es solo informativo, no tiene su propio CTA todavía.

## El resto del catálogo — por qué no lo conecté todavía

Revisé los demás botones de compra del sitio (marcas.html, derechos-autor.html, reclamación, etc.) y **la mayoría no son un "pagar y ya"**: antes de cobrar, piden datos que determinan el trabajo — nombre de la marca y clase, RFC, evidencia del caso, tipo de contrato. Poner un link de pago directo ahí saltaría ese paso y podría cobrar antes de saber exactamente qué se va a hacer.

Para esos, lo que recomiendo (y lo que ya hacen hoy) es mantener el WhatsApp como filtro de intake, y una vez que ustedes ya saben qué se va a cobrar, mandar el link de pago **en la conversación** — igual que ahora, solo que con un link fijo lo pueden reutilizar en vez de generarlo cada vez.

Los candidatos limpios para conectar directo, cuando quieras seguir con la siguiente tanda:
- `consulta_particular` ($1,290) y las filas de `consulta.html` — se paga y se agenda, sin intake previo.
- `busqueda_fonetica`, `marca_vigilancia`, `envio_certificado` — precio fijo, sin variables.
- `revision_simple` — el cliente paga y sube el contrato después.

Dime cuándo quieres seguir con esa tanda y seguimos el mismo patrón: tú generas el link en Mercado Pago, yo lo conecto.

## Factura fiscal (CFDI)

Mercado Pago no emite CFDI. Si tienes o vas a tener clientes empresa que necesiten deducir el gasto (memberships de negocio, constitución de empresa, etc.), van a pedir factura. Si ya la manejan aparte (contador, otro sistema), no hay nada que hacer aquí; si no, es un pendiente real antes de que crezca el lado de negocios.
