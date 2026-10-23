// Sombra del rollo sobre la página que se descubre: solo pasa la distancia al corte.
varying float vV;

void main() {
  vV = abs(position.y);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
