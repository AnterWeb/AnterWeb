// Formulario de contacto tipo Typeform: una pregunta a la vez, teclado (Enter, letras A/B/C…),
// transiciones con GSAP y envío como mensaje prellenado de WhatsApp. No guarda datos en ningún servidor.
import { useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { gsap } from 'gsap';
import { contactSteps, type Answers } from '../../../data/contactForm';
import { whatsappLink } from '../../../data/site';
import FormProgress from './FormProgress';
import StepChoice from './StepChoice';
import StepSummary from './StepSummary';
import StepText from './StepText';
import { buildWhatsAppMessage, questionOf } from './message';
import './contact.css';

const AUTO_ADVANCE_MS = 320;

const motionAllowed = () => window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

interface Props {
  /** Cargo del arreglo express (hoja de precios del panel) */
  express: number;
}

export default function ContactForm({ express }: Props) {
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const stage = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const enterDirection = useRef(0);
  const interacted = useRef(false);
  const busy = useRef(false);

  const allSteps = useMemo(() => contactSteps(express), [express]);
  const steps = useMemo(() => allSteps.filter((step) => !step.when || step.when(answers)), [allSteps, answers]);
  const isSummary = index >= steps.length;
  const current = isSummary ? null : steps[index];
  const message = useMemo(() => buildWhatsAppMessage(steps, answers), [steps, answers]);

  /** Sale el paso actual, cambia el estado y (en el layout effect) entra el siguiente. */
  const transition = (update: () => void, direction: 1 | -1) => {
    if (busy.current) return;
    interacted.current = true;
    setError('');

    if (!stage.current || !motionAllowed()) {
      update();
      enterDirection.current = 0;
      return;
    }

    busy.current = true;
    gsap.to(stage.current, {
      y: -24 * direction,
      opacity: 0,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        enterDirection.current = direction;
        update();
      },
    });
  };

  useLayoutEffect(() => {
    const direction = enterDirection.current;
    if (direction && stage.current) {
      gsap.fromTo(
        stage.current,
        { y: 28 * direction, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', onComplete: () => (busy.current = false) },
      );
      enterDirection.current = 0;
    } else {
      busy.current = false;
    }

    // Foco solo después de que la persona interactúa (si no, la página saltaría al formulario al cargar).
    // En texto va al campo; en opciones y resumen, al contenedor (las teclas A/B/C siguen funcionando
    // y ninguna opción parece preseleccionada).
    if (interacted.current) {
      (input.current ?? stage.current)?.focus({ preventScroll: true });
    }
  }, [index, sent]);

  const next = () => {
    if (current?.kind === 'text' && current.required && !answers[current.id]?.trim()) {
      setError('Escribe tu nombre para continuar.');
      return;
    }
    if (!isSummary) transition(() => setIndex((i) => i + 1), 1);
  };

  const back = () => {
    if (index > 0) transition(() => setIndex((i) => i - 1), -1);
  };

  const answer = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    if (error) setError('');
  };

  const choose = (option: string) => {
    if (!current) return;
    answer(current.id, option);
    window.setTimeout(() => transition(() => setIndex((i) => i + 1), 1), AUTO_ADVANCE_MS);
  };

  const restart = () =>
    transition(() => {
      setAnswers({});
      setIndex(0);
      setSent(false);
    }, -1);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

    if (event.key === 'Enter' && !event.shiftKey && current) {
      if (target.tagName === 'BUTTON' || target.tagName === 'A') return; // deja que el botón haga lo suyo
      if (current.kind === 'choice' && !answers[current.id]) return;
      event.preventDefault();
      next();
      return;
    }

    if (!typing && current?.kind === 'choice' && /^[a-z]$/i.test(event.key) && !event.metaKey && !event.ctrlKey) {
      const option = current.options[event.key.toUpperCase().charCodeAt(0) - 65];
      if (option) {
        event.preventDefault();
        choose(option);
      }
    }
  };

  const total = steps.length;
  const progress = sent ? 1 : Math.min(index / total, 1);

  return (
    <div className="cf" onKeyDown={onKeyDown}>
      <FormProgress value={progress} label={isSummary ? 'Listo' : `${index + 1} / ${total}`} />

      <div ref={stage} className="cf__stage" aria-live="polite" tabIndex={-1}>
        {sent ? (
          <div className="cf__step">
            <p className="cf__question display">Gracias, {answers.name?.trim().split(/\s+/)[0]}.</p>
            <p className="cf__help">
              Se abrió WhatsApp con tu mensaje listo. Solo envíalo y te respondemos para agendar tu cita.
            </p>
            <div className="cf__actions">
              <a className="cf__ok" href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">
                Abrir WhatsApp de nuevo
              </a>
              <button type="button" className="cf__link" onClick={restart}>
                Empezar otra vez
              </button>
            </div>
          </div>
        ) : isSummary ? (
          <StepSummary
            steps={steps}
            answers={answers}
            whatsappHref={whatsappLink(message)}
            onEdit={(i) => transition(() => setIndex(i), -1)}
            onSend={() => transition(() => setSent(true), 1)}
          />
        ) : current?.kind === 'choice' ? (
          <StepChoice
            key={current.id}
            step={current}
            number={index + 1}
            question={questionOf(current, answers)}
            value={answers[current.id] ?? ''}
            onChoose={choose}
          />
        ) : current ? (
          <StepText
            key={current.id}
            step={current}
            number={index + 1}
            question={questionOf(current, answers)}
            value={answers[current.id] ?? ''}
            error={error}
            inputRef={input}
            onChange={(value) => answer(current.id, value)}
            onSubmit={next}
          />
        ) : null}
      </div>

      {!sent && (
        <nav className="cf__nav" aria-label="Navegación del formulario">
          <button type="button" onClick={back} disabled={index === 0} aria-label="Pregunta anterior">
            ↑
          </button>
          <button type="button" onClick={next} disabled={isSummary} aria-label="Siguiente pregunta">
            ↓
          </button>
        </nav>
      )}
    </div>
  );
}
