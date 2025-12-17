export function shSingleQuote(s) {
  return `'${s.replace(/'/g, `'\\''`)}'`;
}
