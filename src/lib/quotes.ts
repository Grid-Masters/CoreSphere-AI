// Curated banking-professional motivational quotes. Used in dashboard greeting.
export const quotes: string[] = [
  "Excellence is not an act, but a habit.",
  "Consistency builds trust.",
  "Operational excellence starts with discipline.",
  "Every customer interaction shapes the brand.",
  "Small improvements create lasting impact.",
  "Precision today is reputation tomorrow.",
  "Service is the silent strategy of leadership.",
  "Clarity in process is confidence at scale.",
  "Compliance is not a limit — it is the foundation of trust.",
  "Speed without accuracy is a risk; accuracy without speed is a cost.",
  "Great operations are invisible to the customer and unmissable to the business.",
  "Coaching converts capability into performance.",
  "Quality is a daily decision, not a quarterly review.",
  "The customer hears your tone before your words.",
  "Document the rule. Defend the exception.",
  "Knowledge unused is risk accepted.",
  "Listen with intent. Respond with care. Resolve with rigor.",
  "A disciplined team delivers a confident bank.",
  "Lead the call. Own the outcome.",
  "Standards repeated become culture.",
];

/**
 * Deterministically pick a quote based on the current time bucket so the
 * value is stable across renders within the same bucket but rotates often.
 * Pass a Date for tests. Bucket = ~15 minutes.
 */
export function pickQuote(now: Date = new Date()): string {
  const bucket = Math.floor(now.getTime() / (1000 * 60 * 15));
  return quotes[bucket % quotes.length];
}

export function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/**
 * Return a fresh motivational quote on each new login/day. We rotate the quote
 * once per calendar day per browser session and persist the chosen index so it
 * stays stable across renders within the day but feels new each login.
 */
const QUOTE_KEY = "coresphere.dailyquote";
export function freshQuote(now: Date = new Date()): string {
  const today = now.toISOString().slice(0, 10);
  if (typeof window === "undefined") {
    return quotes[Math.floor(now.getTime() / 86400000) % quotes.length];
  }
  try {
    const raw = window.localStorage.getItem(QUOTE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { day: string; index: number };
      if (parsed.day === today) return quotes[parsed.index % quotes.length];
    }
    const index = Math.floor(Math.random() * quotes.length);
    window.localStorage.setItem(QUOTE_KEY, JSON.stringify({ day: today, index }));
    return quotes[index];
  } catch {
    return quotes[Math.floor(now.getTime() / 86400000) % quotes.length];
  }
}