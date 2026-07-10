export function formatMillionsCOP(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) {
    return 'Sin presupuesto';
  }
  return `$${(cents / 100 / 1_000_000).toLocaleString('es-CO', {
    maximumFractionDigits: 1,
  })} M COP`;
}

export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) {
    return 'Sin fecha';
  }
  return new Date(isoString).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
