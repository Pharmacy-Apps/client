import jwt from 'jsonwebtoken'

const secret: string = process.env.REACT_APP_JWT_SECRET || ''

export default function (token: string | null) {
  const result: any = jwt.verify(token || '', secret)
  return result
}
