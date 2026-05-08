/**
 * Formats a date from various formats (string, ISO, Excel serial number) to a readable local date string.
 */
export const formatDate = (dateInput: any): string => {
  if (!dateInput) return '---';
  
  // 1. Handle Excel Serial Numbers (e.g. 46150)
  // We check if it's a number AND doesn't look like a year (too small) or a JS timestamp (too big)
  const num = Number(dateInput);
  if (!isNaN(num) && num > 30000 && num < 60000) {
    // Excel serial dates: days since 1900-01-01
    // Offset for Unix Epoch (1970-01-01) is 25569
    const jsDate = new Date((num - 25569) * 86400 * 1000);
    return jsDate.toLocaleDateString();
  }
  
  // 2. Handle standard Date strings (ISO, YYYY-MM-DD, etc)
  const date = new Date(dateInput);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString();
  }
  
  // 3. Fallback
  return dateInput.toString();
};

/**
 * Formats a timestamp to a readable time string
 */
export const formatTime = (dateInput: any): string => {
  if (!dateInput) return '---';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '---';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
