import BigNumber from 'bignumber.js'

const calculateGasFee = (gas: number, gasPrice: number, decimal: number): number => {
  return +new BigNumber(+gas)
    .times(new BigNumber(+gasPrice))
    .div(new BigNumber(10).pow(6))
    .toFixed(6)
}

export default calculateGasFee
