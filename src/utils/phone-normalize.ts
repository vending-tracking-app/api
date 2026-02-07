import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const DEFAULT_PHONE_REGION = 'KZ' as const;

export function normalizePhoneNumber(
  input: string,
  defaultRegion = DEFAULT_PHONE_REGION,
): string {
  const phone = parsePhoneNumberFromString(input, defaultRegion);

  if (!phone || !phone.isValid()) {
    throw new Error('Invalid phone number format');
  }

  return phone.format('E.164');
}
