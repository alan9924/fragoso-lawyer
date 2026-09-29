# Configurar el seguimiento de trámites (conexión con Notion)

Esto conecta dos páginas con tu base de Notion de expedientes:

- [`seguimiento.html`](seguimiento.html) → [`api/seguimiento.js`](api/seguimiento.js): el cliente **consulta** su expediente.
- [`solicitud.html`](solicitud.html) → [`api/solicitud.js`](api/solicitud.js): el cliente **crea** un expediente nuevo (autoservicio, ver `SOLICITUD-SETUP.md` para el detalle de ese flujo).

Ambas usan la misma base y las mismas variables de entorno — configura esto una sola vez. El token de Notion nunca viaja al navegador, solo vive en el servidor (Vercel).

## 1. Crea la integración de Notion

1. Entra a [notion.so/my-integrations](https://www.notion.so/my-integrations) con tu cuenta.
2. **+ New integration** → nómbrala, por ejemplo, "Ferro Fragoso — Seguimiento".
3. Copia el **Internal Integration Secret** (empieza con `ntn_` o `secret_`). Es una contraseña: no la compartas por correo/chat sin cifrar ni la pegues en el código.

## 2. Comparte tu base de datos con la integración

1. Abre en Notion la base donde llevas tus expedientes.
2. Arriba a la derecha: **···** → **Conexiones** (Connections) → busca y agrega la integración que creaste.
3. Sin este paso, la API responde "objeto no encontrado" aunque el token esté bien.

## 3. Revisa que tu base tenga estas columnas

El archivo `api/seguimiento.js` espera, por defecto, estas columnas (puedes cambiar los nombres editando el objeto `PROPS` al inicio de ese archivo si las tuyas se llaman distinto):

| Columna Notion | Tipo | Para qué |
|---|---|---|
| `Folio` | Título (title) | El folio que le das al cliente, ej. `FF-2026-00123` |
| `Correo` | Correo electrónico (email) | Verifica identidad del cliente |
| `Teléfono` | Teléfono (phone_number) | Verifica identidad si no usa correo |
| `Servicio` | Selección o texto | Ej. "Registro de marca" |
| `Etapa` | Selección (select) | Debe ser uno de: `Recibido`, `En revisión`, `En proceso`, `Esperando información del cliente`, `Completado` |
| `Próximo paso` | Texto | Ej. "Esperando respuesta del IMPI" |
| `Nota para el cliente` | Texto | Opcional — algo que quieras decirle directo |
| `Última actualización` | Fecha | Opcional — si la dejas vacía, se usa la fecha de última edición de la página en Notion |

**Importante — qué NO poner ahí:** cualquier otra columna que tengas (honorarios internos, notas del abogado, datos de la contraparte, etc.) nunca se envía al cliente — la función solo lee y regresa estas columnas de la lista de arriba. Aun así, no captures en estas columnas nada que no quieras que el cliente vea.

`api/solicitud.js` (el formulario de autoservicio) además **escribe** estas dos columnas al crear un expediente nuevo — agrégalas también:

| Columna Notion | Tipo | Para qué |
|---|---|---|
| `Nombre` | Texto (rich_text) | Quién solicitó el servicio |
| `Detalle del cliente` | Texto (rich_text) | Lo que escribió en el formulario. Interna: `api/seguimiento.js` nunca la incluye en su respuesta al público. |

## 4. Obtén el ID de la base de datos

En la URL de tu base de Notion:
`https://www.notion.so/tuworkspace/`**`a1b2c3d4e5f6...`**`?v=...`

El bloque de 32 caracteres (con o sin guiones) es el `NOTION_DATABASE_ID`.

## 5. Configura las variables de entorno en Vercel

En tu proyecto de Vercel: **Settings → Environment Variables**, agrega:

- `NOTION_TOKEN` → el secreto que copiaste en el paso 1.
- `NOTION_DATABASE_ID` → el ID del paso 4.

Vuelve a desplegar (Vercel lo hace solo en el próximo `git push`, o puedes forzar un "Redeploy" desde el dashboard).

## 6. Prueba

1. Crea una fila de prueba en tu base de Notion con un folio inventado, tu propio correo y una etapa.
2. Entra a `tusitio.com/seguimiento.html` y consúltala con ese folio y correo.
3. Si algo falla, revisa los **Logs** de la función en Vercel (Deployments → tu deployment → Functions → `api/seguimiento`) — ahí se ve si Notion respondió con error (token mal puesto, base no compartida, nombre de columna distinto, etc.).

## Sobre la seguridad de este formulario

- El folio por sí solo **no** es suficiente para ver un expediente: siempre se exige además el correo o teléfono exacto, para que nadie pueda "adivinar" folios ajenos.
- Hay un límite simple de intentos por IP (8 cada 10 minutos) para frenar scripts automatizados. No es infalible — si en algún momento ven tráfico sospechoso, avísenme y lo reforzamos con un límite compartido (Vercel KV / Upstash) en vez del actual, que es por instancia.
- La página nunca muestra el objeto completo de Notion, solo los campos de la tabla de arriba.
