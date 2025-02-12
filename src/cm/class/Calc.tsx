export class Calc {
  static round = (value?: number, decimalPoint = 1, mode: 'ceil' | 'floor' | 'round' = 'round') => {
    if (!value) {
      return 0
    }
    const multiplier = 10 ** decimalPoint
    switch (mode) {
      case 'ceil':
        return Math.ceil(value * multiplier) / multiplier
      case 'floor':
        return Math.floor(value * multiplier) / multiplier
      case 'round':
      default:
        return Math.round(value * multiplier) / multiplier
    }
  }
  static toPercentage = value => {
    return value * 100 + '%'
  }
}
