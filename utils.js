function formattedTime(ts) {
  const DATE_OFFSET = 978307200
  if (ts === 0)  return null

  const unpacked = Math.floor(ts / Math.pow(10, 9))
  if (unpacked !== 0) ts = unpacked

  return new Date((ts + DATE_OFFSET) * 1000)
}

module.exports = {
  formattedTime
}