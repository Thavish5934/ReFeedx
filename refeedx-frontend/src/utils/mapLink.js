/** Builds a Google Maps search/directions link from a free-text address or lat/lng pair. */
export function buildMapLink(location, latitude, longitude) {
  if (latitude != null && longitude != null) {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location || '')}`
}
