// Solapa de papel de la pantalla de carga: se enrolla desde el corte (y = 0) hacia afuera.
// El papel ya enrollado da vueltas sobre un cilindro de radio uRadius cuyo eje está en v = uCurl
// (v = distancia al corte). Lo que falta por enrollar queda plano, idéntico a la hoja HTML.
uniform float uCurl;
uniform float uRadius;
uniform float uSide; // 1 solapa de arriba, -1 la de abajo

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vec3 p = position;
  vec3 n = vec3(0.0, 0.0, 1.0);
  float v = abs(position.y);
  float rolled = uCurl - v;

  if (rolled > 0.0) {
    float angle = rolled / uRadius;
    p.y = uSide * (uCurl - uRadius * sin(angle));
    p.z = position.z + uRadius * (1.0 - cos(angle));
    n = vec3(0.0, uSide * sin(angle), cos(angle));
  }

  vNormal = n;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
