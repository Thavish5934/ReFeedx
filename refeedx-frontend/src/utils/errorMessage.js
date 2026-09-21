export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data
  if (data?.details?.length) return data.details.join(' ')
  if (data?.message) return data.message
  return fallback
}
