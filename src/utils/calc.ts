import BigNumber from 'bignumber.js'

function calcBalance(amount: string, decimals: number): string {
  return new BigNumber(amount).dividedBy(Math.pow(10, decimals)).toString()
}

export { calcBalance }
