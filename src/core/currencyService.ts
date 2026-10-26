import { CurrencyCode } from '../types/currency';

/**
 * Serviço de formatação de valores monetários.
 * Inicia configurado para BRL (R$).
 * Projetado para suportar API externa de conversão para USD sem quebrar o front.
 */
class CurrencyService {
  private currentCurrency: CurrencyCode = 'BRL';
  private usdToBrlRate: number = 5.75; // Taxa padrão caso offline

  public setCurrency(code: CurrencyCode) {
    this.currentCurrency = code;
  }

  public getCurrency(): CurrencyCode {
    return this.currentCurrency;
  }

  public setRate(rate: number) {
    this.usdToBrlRate = rate;
  }

  public format(valueInBRL: number, targetCurrency?: CurrencyCode): string {
    const currency = targetCurrency || this.currentCurrency;

    if (currency === 'USD') {
      const valueInUSD = valueInBRL / this.usdToBrlRate;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(valueInUSD);
    }

    // Padrão BRL
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valueInBRL);
  }

  public formatFull(valueInBRL: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valueInBRL);
  }
}

export const currencyService = new CurrencyService();
