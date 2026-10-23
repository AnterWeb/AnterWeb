// Sombra suave que el rollo de papel proyecta hacia el corte, más oscura junto al rollo.
uniform float uCurl;
uniform float uSoft;
uniform float uStrength;
uniform vec3 uColor;

varying float vV;

void main() {
  float gap = uCurl - vV;
  float alpha = gap > 0.0 ? uStrength * exp(-gap / uSoft) : 0.0;
  gl_FragColor = vec4(uColor, alpha);
  #include <colorspace_fragment>
}
