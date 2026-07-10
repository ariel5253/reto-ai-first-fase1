export function formatMillionsCOP(amountCents: number): string {
  const amountPesos = amountCents / 100;
  return `${(amountPesos / 1_000_000).toFixed(1)} M COP`;
}

export function formatDate(value: string | null): string {
  if (!value) {
    return 'Sin fecha';
  }
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(new Date(value));
}
