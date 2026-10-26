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
    const hasCents = !Number.isInteger(valueInBRL);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: hasCents ? 2 : 0,
      maximumFractionDigits: 2
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

  /**
   * Formata em tempo real enquanto o usuário digita (ex: "15000000" -> "150.000,00")
   */
  public maskInput(rawValue: string): string {
    const digits = rawValue.replace(/\D/g, '');
    if (!digits) return '';
    const numericValue = parseInt(digits, 10) / 100;
    return numericValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  /**
   * Converte uma string formatada ("150.000,00") de volta para número (150000)
   */
  public parseInput(maskedValue: string): number {
    const digits = maskedValue.replace(/\D/g, '');
    if (!digits) return 0;
    return parseInt(digits, 10) / 100;
  }
}

export const currencyService = new CurrencyService();
