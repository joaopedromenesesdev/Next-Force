/**
 * Utilitários para máscara e conversão monetária padrão BRL (pt-BR).
 * Utiliza ponto (.) como separador de milhar e vírgula (,) como separador decimal.
 */

/**
 * Converte um valor (número ou string) em string formatada em moeda brasileira.
 * Exemplo: 150000 -> "150.000,00"
 * Exemplo de digitação: dígitos "150" -> "1,50"
 */
export function maskCurrency(value: string | number): string {
  if (value === '' || value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'number') {
    if (isNaN(value)) return '';
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  // Remove tudo que não for dígito
  const cleanDigits = value.replace(/\D/g, '');
  if (!cleanDigits) {
    return '';
  }

  // Padrão centavos (preenchimento da direita para a esquerda)
  const numericValue = Number(cleanDigits) / 100;
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericValue);
}

/**
 * Extrai o valor numérico (float) a partir de uma string formatada ou número.
 * Exemplo: "150.000,00" -> 150000
 * Exemplo: "1.500,50" -> 1500.5
 */
export function parseCurrencyToNumber(value: string | number): number {
  if (typeof value === 'number') {
    return isNaN(value) ? 0 : value;
  }

  if (!value) return 0;

  const cleanDigits = value.replace(/\D/g, '');
  if (!cleanDigits) return 0;

  return Number(cleanDigits) / 100;
}

