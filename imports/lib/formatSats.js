const formatSats = function (sats) {
  if (sats > 1000000000) {
    return `${Math.round(sats / 1000000) / 1000}b sats`
  }
  if (sats > 1000000) {
    return `${Math.round(sats / 1000) / 1000}m sats`
  }
  if (sats > 1000) {
    return `${Math.round(sats) / 1000}k sats`
  }
  return `${Math.round(sats)} sats`
}

export default formatSats
