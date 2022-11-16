import { getChains } from 'src/config/cache/chains'
import { getChainDefaultGasPrice, getChainInfo, getNativeCurrency } from 'src/config'
import { MChainInfo } from 'src/services'
import { calculateFee, GasPrice } from '@cosmjs/stargate'

const nativeCurrency = getNativeCurrency()

export const validateFloatNumber = (value: any): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(value)
}
export const formatNumber = (value: any): string => {
  if (value == '' || value == 0) return value
  const valueString = String(value)
  const [integer, fractional] = valueString.split('.')
  if (!fractional) return value
  const parsedNumber = [integer, '.', fractional.slice(0, nativeCurrency.decimals || 6)].join('')
  return String(+parsedNumber)
  // return value == '' || value == 0 ? value : parseFloat((+value).toFixed(6)).toString()
}
export const isNumberKeyPress = (event): boolean => {
  if (event.key == '.') {
    return true
  }
  if (!isFinite(event.key) || event.key === ' ') {
    event.preventDefault()
    return false
  }
  return true
}

export const formatNativeToken = (amount) => {
  const nativeCurrency = getNativeCurrency()
  return `${parseFloat((+amount / 10 ** +nativeCurrency.decimals).toFixed(+nativeCurrency.decimals))} ${
    nativeCurrency.symbol
  }`
}
export const formatNativeCurrency = (amount) => {
  const nativeCurrency = getNativeCurrency()
  return `${parseFloat((+amount).toFixed(+nativeCurrency.decimals))} ${nativeCurrency.symbol}`
}
export const calcFee = (gasAmount) => {
  const chainInfo = getChainInfo()
  const listChain = getChains()
  const chainDefaultGasPrice = getChainDefaultGasPrice()
  const mChainInfo = listChain.find((x) => x.chainId === chainInfo.chainId) as MChainInfo
  const denom = mChainInfo?.denom || ''
  const _gasPrice = GasPrice.fromString(String(chainDefaultGasPrice).concat(denom))
  const _sendFee = calculateFee(Number(gasAmount), _gasPrice)
  return _sendFee
}
