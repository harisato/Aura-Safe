import BigNumber from 'bignumber.js'

const calculateGasFee = (gas: number, gasPrice: number, decimal: number): number => {
  return +new BigNumber(+gas)
    .times(new BigNumber(+gasPrice))
    .div(new BigNumber(10).pow(decimal))
    .toFixed(6)
}

export default calculateGasFee
