export function generateRandomValue(min: number, max: number, numAfterDigit = 0): number {
  if (min > max) {
    throw new Error('Minimum value cannot be greater than maximum value.');
  }

  // Добавляем 1 к разнице между max и min, чтобы включить верхнюю границу
  const randomValue = Math.random() * (max - min + 1) + min;

  // Если требуются числа с плавающей точкой
  if (numAfterDigit > 0) {
    return parseFloat(randomValue.toFixed(numAfterDigit));
  }

  // Если требуются целые числа
  return Math.floor(randomValue);
}

export function getRandomItems<T>(items: T[]): T[] {
  const startPosition = Math.floor(generateRandomValue(0, items.length - 1)); // Целое число для startPosition
  const endPosition = Math.floor(generateRandomValue(startPosition + 1, items.length)); // Гарантируем, что endPosition >= startPosition
  return items.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: T[]): T {
  const index = Math.floor(generateRandomValue(0, items.length - 1));
  return items[index];
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}
