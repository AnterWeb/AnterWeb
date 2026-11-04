// El contenido que la clienta edita en el panel (src/content/*.json) cumple lo que la página espera.
// Keystatic ya valida al guardar; esto cuida además los cambios hechos a mano y los que lleguen por git.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import { FRAMING, SIZE_STATES, SIZES } from '../src/cms/values.ts';

const root = new URL('../', import.meta.url);
const read = (name: string) => JSON.parse(readFileSync(new URL(`src/content/${name}.json`, root), 'utf8'));

interface Photo {
  imagen: string;
  descripcion: string;
  encuadre: string;
}

/** Todas las fotos guardadas en un JSON del panel, estén donde estén */
function photosIn(value: unknown, found: Photo[] = []): Photo[] {
  if (Array.isArray(value)) for (const item of value) photosIn(item, found);
  else if (value && typeof value === 'object') {
    if ('imagen' in value) found.push(value as Photo);
    else for (const item of Object.values(value)) photosIn(item, found);
  }
  return found;
}

const isPrice = (value: unknown) => Number.isInteger(value) && (value as number) >= 0;

describe('contenido del panel', () => {
  test('cada foto existe, tiene descripción y un encuadre válido', () => {
    const photos = ['coleccion', 'disenos', 'proceso'].flatMap((name) => photosIn(read(name)));
    assert.ok(photos.length > 0);
    for (const photo of photos) {
      assert.ok(existsSync(new URL(`.${photo.imagen}`, root)), `falta el archivo ${photo.imagen}`);
      assert.ok(photo.descripcion?.trim(), `la foto ${photo.imagen} no tiene descripción`);
      assert.ok(photo.encuadre in FRAMING, `encuadre desconocido en ${photo.imagen}: ${photo.encuadre}`);
    }
  });

  test('colección: cada prenda tiene colores con muestra, precio, tallas y fotos', () => {
    const { temporada, prendas } = read('coleccion');
    assert.ok(temporada?.trim(), 'falta la temporada');
    assert.ok(prendas.length > 0, 'la colección no tiene prendas');
    for (const prenda of prendas) {
      assert.ok(prenda.modelo?.trim(), 'una prenda no tiene modelo');
      assert.ok(prenda.opciones.length > 0, `${prenda.modelo} no tiene colores`);
      for (const opcion of prenda.opciones) {
        const name = `${prenda.modelo} ${opcion.color}`;
        assert.ok(opcion.color?.trim(), `${prenda.modelo} tiene un color sin nombre`);
        assert.match(opcion.muestra, /^#[0-9a-f]{6}$/i, `${name}: muestra inválida`);
        assert.ok(isPrice(opcion.precio), `${name}: precio inválido`);
        const tallas = Object.entries(opcion.tallas);
        assert.ok(tallas.length > 0, `${name}: sin tallas`);
        for (const [size, state] of tallas) {
          assert.ok((SIZES as readonly string[]).includes(size), `${name}: talla desconocida ${size}`);
          assert.ok((SIZE_STATES as readonly string[]).includes(state as string), `${name}: estado desconocido ${state}`);
        }
        assert.ok(opcion.fotos.length > 0, `${name}: sin fotos`);
      }
    }
  });

  test('diseños: cada vestido de Novias y Fiesta tiene nombre y fotos', () => {
    const disenos = read('disenos');
    for (const row of ['novias', 'fiesta']) {
      assert.ok(disenos[row].length > 0, `${row} está vacío`);
      for (const pieza of disenos[row]) {
        assert.ok(pieza.nombre?.trim(), `una pieza de ${row} no tiene nombre`);
        assert.ok(pieza.fotos.length > 0, `${pieza.nombre} no tiene fotos`);
      }
    }
  });

  test('servicios: la hoja de precios tiene conceptos con precio', () => {
    const { servicios, hoja } = read('servicios');
    assert.ok(servicios.length > 0, 'no hay servicios');
    assert.ok(isPrice(hoja.express), 'cargo express inválido');
    for (const grupo of hoja.grupos) {
      assert.ok(grupo.precios.length > 0, `${grupo.nombre} no tiene precios`);
      for (const { concepto, precio } of grupo.precios) {
        assert.ok(concepto?.trim(), `${grupo.nombre}: concepto vacío`);
        assert.ok(isPrice(precio), `${grupo.nombre} ${concepto}: precio inválido`);
      }
    }
  });
});
