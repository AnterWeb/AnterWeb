// Papel de la solapa: al frente, la hoja impresa (textura del DOM); al reverso, lino liso un poco más oscuro.
// La luz solo cambia lo que se curva: en plano el color es exactamente el de la hoja HTML.
uniform sampler2D uMap;
uniform vec3 uBack;
uniform vec3 uLight;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vec3 n = normalize(vNormal);
  vec3 color = texture2D(uMap, vUv).rgb;
  if (!gl_FrontFacing) {
    n = -n;
    color = uBack;
  }
  float shade = 1.0 + (dot(n, uLight) - uLight.z) * 0.6;
  gl_FragColor = vec4(color * shade, 1.0);
  #include <colorspace_fragment>
}
