// Preguntas del formulario de contacto (isla components/islands/contact).
// El orden aquí es el orden en pantalla. `when` muestra una pregunta solo si aplica.
// `{name}` se reemplaza por el nombre que la persona escribió en el primer paso.
// El cargo del arreglo express sale de la hoja de precios del panel (lo pasa Appointment.astro).
// Copy en borrador: validar con la clienta.

export type Answers = Record<string, string>;

interface BaseStep {
  id: string;
  question: string;
  help?: string;
  /** Etiqueta en el resumen y en el mensaje de WhatsApp. */
  label: string;
  when?: (answers: Answers) => boolean;
}

export interface TextStep extends BaseStep {
  kind: 'text' | 'textarea';
  placeholder: string;
  required?: boolean;
}

export interface ChoiceStep extends BaseStep {
  kind: 'choice';
  options: string[];
}

export type Step = TextStep | ChoiceStep;

const ALTERATIONS = 'Ajustes';

export const contactSteps = (expressSurcharge: number): Step[] => [
  {
    id: 'name',
    kind: 'text',
    question: '¿Cómo te llamas?',
    placeholder: 'Escribe tu nombre',
    label: 'Nombre',
    required: true,
  },
  {
    id: 'service',
    kind: 'choice',
    question: 'Mucho gusto, {name}. ¿Qué te gustaría hacer?',
    label: 'Busco',
    options: ['Vestido de novia', 'Vestido de cocktail o fiesta', ALTERATIONS, 'Otra cosa'],
  },
  {
    id: 'timing',
    kind: 'choice',
    question: '¿Para cuándo lo necesitas?',
    help: 'Los vestidos a la medida llevan varias pruebas; entre más tiempo, mejor.',
    label: 'Para cuándo',
    options: ['Lo antes posible', 'En 1 a 3 meses', 'En 3 a 6 meses', 'En más de 6 meses', 'Aún no tengo fecha'],
  },
  {
    id: 'express',
    kind: 'choice',
    question: '¿Te interesa el arreglo express?',
    help: `Tiene un costo adicional de $${expressSurcharge} MXN.`,
    label: 'Arreglo express',
    options: ['Sí, lo necesito pronto', 'No, sin prisa'],
    when: (answers) => answers.service === ALTERATIONS,
  },
  {
    id: 'schedule',
    kind: 'choice',
    question: '¿Qué horario te acomoda para visitarnos?',
    label: 'Horario',
    options: ['Mañanas', 'Tardes', 'Me adapto'],
  },
  {
    id: 'idea',
    kind: 'textarea',
    question: 'Cuéntanos tu idea',
    help: 'Colores, telas, inspiración o la prenda que quieres ajustar. Es opcional.',
    placeholder: 'Escribe aquí…',
    label: 'Idea',
  },
];

/** Reemplaza {name} en el texto de la pregunta. */
export const personalize = (text: string, answers: Answers) =>
  text.replace('{name}', answers.name?.trim().split(/\s+/)[0] ?? '');
