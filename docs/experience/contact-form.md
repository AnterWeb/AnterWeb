# Formulario de contacto (tipo Typeform)

Archivos: isla `src/components/islands/contact/` + preguntas en `src/data/contactForm.ts`. Se monta en `sections/Appointment.astro` con `client:visible`.

## Qué hace

Una pregunta a la vez. Al final arma un mensaje y abre WhatsApp (`wa.me`) ya escrito. **No guarda ni envía datos a ningún servidor.**

| Paso | Tipo | Notas |
|---|---|---|
| Nombre | texto | Obligatorio. El primer nombre se usa en la siguiente pregunta ("Mucho gusto, {name}") |
| Qué busca | opción | Novia / noche o evento / confección y ajustes / otra cosa |
| Para cuándo | opción | Ayuda a priorizar; los vestidos a la medida necesitan pruebas |
| Arreglo express | opción | **Solo si eligió "Confección y ajustes"** (`when`); muestra el costo de la hoja de precios del panel (prop `express`) |
| Horario | opción | Mañanas / tardes / me adapto (no promete días de apertura) |
| Idea | textarea | Opcional |

Después viene un resumen editable, el botón "Enviar por WhatsApp" y una pantalla de gracias con "Abrir WhatsApp de nuevo" / "Empezar otra vez".

## Interacción

- **Teclado:** Enter avanza (en textarea, Shift + Enter hace salto de línea); A/B/C… eligen opción; flechas ↑/↓ en pantalla.
- **Avance automático:** al elegir una opción avanza solo después de 320 ms.
- **Transiciones:** GSAP (sale hacia arriba, entra desde abajo; al revés si regresas). Sin animación con reduced motion.
- **Foco:** solo después de la primera interacción, así la página no salta al cargar. En texto va al campo; en opciones y resumen, al contenedor.

## Mensaje

`message.ts → buildWhatsAppMessage` recorre solo los pasos visibles y respondidos:

```
Hola Anter House, me gustaría agendar una cita.

*Nombre:* …
*Busco:* …
```

## Cambiar preguntas

Edita `contactSteps` en `data/contactForm.ts`. El tipo es `text`, `textarea` o `choice`. `label` es lo que aparece en el resumen y en el mensaje, y `when` define si la pregunta aplica. No hace falta tocar la isla.
