import decrypt from 'libs/jwt'
import { getSessionToken } from 'session'

export function getUserRole() {
  try {
    return decrypt(getSessionToken()).role
  } catch (error) { }
}

export function userIsClientUser() {
  return getUserRole() === 1
}

export function userIsCourier() {
  return getUserRole() === 2
}

export function userIsPharmacyOperator() {
  return getUserRole() === 3
}

export function userIsAdmin() {
  return getUserRole() === 4
}
