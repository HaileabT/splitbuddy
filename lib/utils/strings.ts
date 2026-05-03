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
