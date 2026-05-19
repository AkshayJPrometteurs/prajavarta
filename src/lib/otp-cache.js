const otpMap = new Map()

export function setOtp(email, otp, ttl = 10 * 60 * 1000) {
  const expiresAt = Date.now() + ttl
  otpMap.set(email, { otp, expiresAt })
}

export function getOtp(email) {
  const entry = otpMap.get(email)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    otpMap.delete(email)
    return null
  }
  return entry.otp
}

export function deleteOtp(email) {
  otpMap.delete(email)
}

export default { setOtp, getOtp, deleteOtp }
