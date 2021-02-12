const currency = 'UGX'

/*
 * Note - Function fails with big ints
 * Though those are unnecessary for our cases
 * */
function numberWithCommas(number: number) {
  return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
}

export const formatMoney = (amount: number) => {
  return `${currency} ${numberWithCommas(amount)}`
}