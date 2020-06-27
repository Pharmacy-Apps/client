import jwt from 'jsonwebtoken'

const secret = process.env.REACT_APP_JWT_SECRET

export default function (token) {
  return jwt.verify(token, secret)
}
