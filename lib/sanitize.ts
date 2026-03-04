export function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

export function sanitizeDecision(text: string): string {
  return stripHtml(text).trim().slice(0, 100);
}

export function sanitizeReason(text: string): string {
  return stripHtml(text).trim().slice(0, 140);
}
