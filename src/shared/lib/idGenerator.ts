export function generateRandomId(): string {
  // This will generate a random alphanumeric string
  return Math.random().toString(36).substring(2, 11);
}
