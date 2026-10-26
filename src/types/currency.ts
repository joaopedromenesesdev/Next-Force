export type CurrencyCode = 'BRL' | 'USD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateToBRL: number; // 1 USD = X BRL
}
