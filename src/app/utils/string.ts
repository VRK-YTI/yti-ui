
function isNotWordCharacter(s: string): boolean {
  return !!s.match(/[\s,\.]+/);
}

function rangeOrNull(s: string, start: number|null, end: number): { start: number, end: number }|null {

  if (start === null) {
    return null;
  }

  if (s.substring(start, end).trim() !== '') {
    return { start, end };
  } else {
    return null;
  }
}

export function wordAtOffset(s: string, offset: number): { start: number, end: number }|null {

  let startOfWord: number|null = null;

  for (let i = 0; i < s.length; i++) {

    const lookingAt = s.charAt(i);

    if (isNotWordCharacter(lookingAt)) {

      if (i >= offset) {
        return rangeOrNull(s, startOfWord, i);
      }

      startOfWord = null;

    } else if (startOfWord === null) {
      startOfWord = i;
    }
  }

  return rangeOrNull(s, startOfWord, s.length);
}
