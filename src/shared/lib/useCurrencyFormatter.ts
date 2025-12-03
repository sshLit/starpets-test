export function formatCurrencyAmount(amount: number, currency: string = '$', decimals: number = 2): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `0.${'0'.repeat(decimals)} ${currency}`;
  }

  const fixedAmount = amount.toFixed(decimals);
  const parts = fixedAmount.split('.');
  const integerPart = parts[0] || '0';
  const decimalPart = parts[1] || '0'.repeat(decimals);

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return `${formattedInteger}.${decimalPart} ${currency}`;
}

export function useCurrencyFormatter() {
  return {
    formatCurrencyAmount,
  };
}
