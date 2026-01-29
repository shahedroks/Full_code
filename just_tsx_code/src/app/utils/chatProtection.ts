// Chat Protection - Detect outside contact attempts

export interface ContactDetectionResult {
  isViolation: boolean;
  violationType?: 'phone' | 'email' | 'phrase';
  detectedContent?: string;
}

const PHONE_PATTERNS = [
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // 123-456-7890, 123.456.7890, 1234567890
  /\b\(\d{3}\)\s?\d{3}[-.]?\d{4}\b/g, // (123) 456-7890
  /\b\d{3}\s\d{3}\s\d{4}\b/g, // 123 456 7890
  /\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}\b/g, // International formats
];

const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

const CONTACT_PHRASES = [
  /\bcall\s+me\b/gi,
  /\btext\s+me\b/gi,
  /\bphone\s+me\b/gi,
  /\bwhatsapp\b/gi,
  /\btelegram\b/gi,
  /\bmy\s+number\b/gi,
  /\byour\s+number\b/gi,
  /\bemail\s+me\b/gi,
  /\bcontact\s+me\s+(at|on)\b/gi,
  /\breach\s+me\s+(at|on)\b/gi,
  /\bget\s+in\s+touch\s+at\b/gi,
];

export function detectContactAttempt(message: string): ContactDetectionResult {
  // Check for phone numbers
  for (const pattern of PHONE_PATTERNS) {
    const matches = message.match(pattern);
    if (matches && matches.length > 0) {
      return {
        isViolation: true,
        violationType: 'phone',
        detectedContent: matches[0],
      };
    }
  }

  // Check for email addresses
  const emailMatches = message.match(EMAIL_PATTERN);
  if (emailMatches && emailMatches.length > 0) {
    return {
      isViolation: true,
      violationType: 'email',
      detectedContent: emailMatches[0],
    };
  }

  // Check for contact phrases
  for (const pattern of CONTACT_PHRASES) {
    const matches = message.match(pattern);
    if (matches && matches.length > 0) {
      return {
        isViolation: true,
        violationType: 'phrase',
        detectedContent: matches[0],
      };
    }
  }

  return {
    isViolation: false,
  };
}
