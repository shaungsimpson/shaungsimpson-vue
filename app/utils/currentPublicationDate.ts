/**
 * Returns the current calendar date for article publishing in Sydney.
 * In dev it returns a far-future date so scheduled articles can be previewed.
 */
export function currentPublicationDate(): string {
  if (import.meta.dev) {
    return '9999-12-31'
  }

  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const values = Object.fromEntries(
    parts
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, value]),
  )

  return `${values.year}-${values.month}-${values.day}`
}
