import React from 'react';

interface CurrencyTextProps {
  value: number;
  currency?: string;
  className?: string;
  showSymbol?: boolean;
}

export const CurrencyText: React.FC<CurrencyTextProps> = ({ 
  value: rawValue, 
  currency = 'USD', 
  className,
  showSymbol = true 
}) => {
  const value = typeof rawValue === 'string' ? parseFloat(rawValue) : rawValue;
  const numValue = isNaN(value) ? 0 : value;

  const formatted = new Intl.NumberFormat('en-US', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);

  const isNegative = numValue < 0;

  return (
    <span className={className} style={{ 
      fontFamily: 'var(--ui-font-mono, monospace)',
      fontWeight: 600,
      color: isNegative ? 'var(--ui-error)' : 'inherit'
    }}>
      {formatted}
    </span>
  );
};
