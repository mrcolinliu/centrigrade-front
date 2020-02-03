export class Currency {
  factor: number;
  symbol: string;

  constructor(factor: number, symbol: string) {
    this.factor = factor;
    this.symbol = symbol;
  }
}
