export function getMSISDNFromCCAndSN(cc: string, sn: string) {
  return `${cc}${sn}`
}

export function parseMTNUGSN(sn: string) {
  if (
    /^(77|78)/.test(sn) && // Regex accepts text starting with 77 or 78
    /^[0-9]{9}$/.test(sn) // Regex accepts text, length 9 containing only numbers
  )
    return sn
  throw new Error('Subscriber number not valid')
}

export function formatUGMSISDN(msisdn: string) {
  const cc = CCs[2].value
  if (msisdn.startsWith(cc)) {
    return `${
      msisdn.slice(0, cc.length)
      } ${
      msisdn.slice(cc.length, 6)
      } ${
      msisdn.slice(6)
      }`
  } else if (msisdn.startsWith('0')) {
    return `${
      msisdn.slice(0, 4)
      } ${
      msisdn.slice(4)
      }`
  }
  return msisdn
}

export const CCs = [{
  label: '254', value: '254'
}, {
  label: '255', value: '255'
}, {
  label: '256', value: '256'
}]
