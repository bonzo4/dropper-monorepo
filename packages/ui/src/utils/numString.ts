export function numString(num: number) {
  // Helper function to determine if a number is an integer
  const isInteger = (x: number) => Math.floor(x) === x;

  // Return the number as a string if less than 1000
  if (num < 1000) {
    return num.toFixed(2);
  }
  // Process numbers in thousands
  if (num < 1000000) {
    let result = num / 1000;
    return isInteger(result) ? result + "K" : result.toFixed(1) + "K";
  }
  // Process numbers in millions
  if (num < 1000000000) {
    let result = num / 1000000;
    return isInteger(result) ? result + "M" : result.toFixed(1) + "M";
  }
  // Process numbers in billions
  let result = num / 1000000000;
  return isInteger(result) ? result + "B" : result.toFixed(1) + "B";
}
