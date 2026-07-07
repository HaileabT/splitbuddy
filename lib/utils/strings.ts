export function capitalize(
  str: string,
  full: boolean = false,
  delimiter: string = " ",
  joiner: string = " ",
): string {
  if (!str) return str;
  const words = str.split(delimiter);
  if (full) {
    return words
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(joiner);
  } else {
    return words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }
}


export function getProperNumberString(val: number, decimalPoint?: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimalPoint ? decimalPoint : 20,
    minimumFractionDigits: decimalPoint ? decimalPoint : 0
  });
  if (!val) return formatter.format(0);

  return formatter.format(val)
}

export function addCommasToNumberString(num: string) {
  
  let decimalDigits: string | undefined = undefined;
  if (num.includes(".")) {
    const parts = num.split('.')
    decimalDigits = parts[1];
    num = parts[0];
    
  }
  const digits = num.length;
  let remainingDigits = digits - 3;


  while (remainingDigits > 0) {
    num = num.slice(0, remainingDigits) + "," + num.slice(remainingDigits);
    remainingDigits -= 3;
  }

  return decimalDigits ? num + "." + decimalDigits : num;
}