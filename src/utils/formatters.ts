
/**
 * Format a number as a price in Kwanza (KZ)
 */
export const formatPrice = (price: number | string): string => {
  const value = typeof price === 'string' ? parseFloat(price) : price;
  
  // Format with dot as thousand separator and no decimal places, with Kz suffix
  return new Intl.NumberFormat('pt-AO', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + 'Kz';
};

/**
 * Format a date string to a human readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-AO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Format bytes to human readable format
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Format a number as percentage
 */
export const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(0)}%`;
};
