/** Precio en pesos con separador de miles: 1500 → "$1,500". */
export const mxn = (value: number) => `$${value.toLocaleString('es-MX')}`;
