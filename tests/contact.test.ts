// La lógica del formulario de cita (data/contactForm.ts) y el formato de precios (data/format.ts).
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { contactSteps, personalize } from '../src/data/contactForm.ts';
import { mxn } from '../src/data/format.ts';

describe('formulario de cita', () => {
  const steps = contactSteps(200);
  const express = steps.find((step) => step.id === 'express');

  test('las preguntas van en orden y el nombre es obligatorio', () => {
    assert.deepEqual(
      steps.map((step) => step.id),
      ['name', 'service', 'timing', 'express', 'schedule', 'idea'],
    );
    const name = steps[0];
    assert.ok(name.kind === 'text' && name.required);
  });

  test('el arreglo express solo se pregunta para ajustes y lleva el cargo de la hoja', () => {
    assert.ok(express?.when);
    assert.equal(express.when({ service: 'Ajustes' }), true);
    assert.equal(express.when({ service: 'Vestido de novia' }), false);
    assert.match(express.help ?? '', /\$200 MXN/);
  });

  test('personaliza la pregunta con el primer nombre', () => {
    assert.equal(personalize('Mucho gusto, {name}.', { name: '  Ana Teresa García ' }), 'Mucho gusto, Ana.');
    assert.equal(personalize('Hola {name}', {}), 'Hola ');
  });
});

describe('precios', () => {
  test('en pesos, con separador de miles', () => {
    assert.equal(mxn(1500), '$1,500');
    assert.equal(mxn(160), '$160');
  });
});
