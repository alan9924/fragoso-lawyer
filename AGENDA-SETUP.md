> **Actualización 2026-09-03:** los botones de consulta ya **no** apuntan a los placeholders `calendly.com/TU-USUARIO/...` (eran links rotos en producción). Hoy crean una solicitud con folio en `solicitud.html?servicio=llamada_filtro | consulta_legal | consulta_particular`, y el despacho agenda al contactar. Cuando tengas los links reales de Calendly, sustituye esos `href` (index.html ×3, plan.html ×1, seguimiento.html ×1) y el resto de esta guía aplica igual.

# Configurar el agendado de consultas (Calendly)

El sitio ya tiene los botones listos para agendar — en `index.html` (sección "Consulta con un abogado") y en `seguimiento.html` ("Agendar llamada con tu abogado"). Solo faltan tus links reales de Calendly. Búscalos con: `grep -rn "AGENDA PENDIENTE" *.html`

## 1. Crea tu cuenta en Calendly

1. Entra a [calendly.com](https://calendly.com) y crea una cuenta gratuita (con tu correo o con Google).
2. Conecta tu **Google Calendar** (o el calendario que uses) desde el primer paso del registro — así Calendly bloquea automáticamente los horarios donde ya tienes algo agendado y nunca se empalman dos citas.
3. En **Disponibilidad**, define tus horarios de atención (ej. lunes a viernes, 9am–6pm) y tu zona horaria — Calendly ajusta automáticamente la hora que ve cada cliente según dónde esté.

## 2. Crea los 3 tipos de evento

Ve a **Tipos de eventos → + Crear** y crea estos tres (los nombres y duración deben coincidir con lo que ya dice el sitio):

| Evento | Duración | Nota |
|---|---|---|
| **Cuéntanos tu caso** | 15 min | Gratis — no requiere configurar cobro. |
| **Consulta legal** | 45 min | $790 MXN. |
| **Análisis legal de tu caso** | 60 min | $1,290 MXN. |

Para cada uno, en **Ubicación** elige cómo van a hablar (Google Meet/Zoom se generan solos, o pon tu número para llamada telefónica).

### Sobre el cobro de $790 y $1,290

El plan gratuito de Calendly no cobra el pago al momento de agendar. Tienes dos caminos, y no necesitas decidir ahora — el sitio funciona igual con cualquiera:

- **Cobrar después, como ya hacen con Mercado Pago** (ver `gracias.html`): el cliente agenda gratis y ustedes le envían el link de cobro por WhatsApp antes de la llamada. Cero configuración adicional.
- **Cobrar al agendar**: sube al plan de pago de Calendly (Standard) y conecta Stripe en el tipo de evento — Calendly no deja agendar sin pagar. Cuesta una suscripción mensual.

## 3. Copia el link de cada evento

En cada tipo de evento → **Compartir** → copia el link (algo como `https://calendly.com/tu-usuario/consulta-legal`). Son links públicos, pensados para compartirse — no son un secreto como una contraseña.

## 4. Pégalos en el sitio

Busca `AGENDA PENDIENTE` en el código y reemplaza el `href="https://calendly.com/TU-USUARIO/..."` de cada botón por tu link real. Son 4 lugares en total:

- `index.html` — 3 botones (Cuéntanos tu caso / Consulta legal / Análisis legal).
- `seguimiento.html` — 1 botón (Agendar llamada con tu abogado).

Si me pasas los 3 links reales, yo hago el reemplazo directo.

## Opcional, más adelante

- **Ventana emergente en vez de nueva pestaña:** Calendly ofrece un widget de "popup" (un script embebido) que abre el calendario sin salir de tu página — mejora un poco la conversión. Si lo quieres, dime y lo agrego.
- **Recordatorios por SMS:** están en el plan de pago de Calendly; el gratuito ya manda recordatorio por correo.
