import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AUTH_COOKIE_NAME } from './auth-cookie'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
export { AUTH_COOKIE_NAME }

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId, email, role) {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}
