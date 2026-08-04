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

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const passwordCriteria = {
  minLength: "Password must be at least 8 characters long",
  special: "Password must contain at least one special character",
  uppercase: "Password must contain at least one uppercase letter",
  lowercase: "Password must contain at least one lowercase letter",
  number: "Password must contain at least one number",
}

export function validatePassword(password: string): { pass: (keyof typeof passwordCriteria)[]; fail: (keyof typeof passwordCriteria)[] } {
  const hasLower = /[a-z]+/;
  const hasUpper = /[A-Z]+/;
  const hasNumber = /[0-9]+/;
  const hasSpecial = /[^a-zA-Z0-9]+/;

  const fail = [] as (keyof typeof passwordCriteria)[];
  const pass = [] as (keyof typeof passwordCriteria)[];

  if (password.length < 8) {
    fail.push("minLength");
  } else {
    pass.push("minLength");
  }

  if (!hasSpecial.test(password)) {
    fail.push("special");
  } else {
    pass.push("special");
  }

  if (!hasUpper.test(password)) {
    fail.push("uppercase");
  } else {
    pass.push("uppercase");
  }

  if (!hasLower.test(password)) {
    fail.push("lowercase");
  } else {
    pass.push("lowercase");
  }

  if (!hasNumber.test(password)) {
    fail.push("number");
  } else {
    pass.push("number");
  }

  return { pass, fail };
}