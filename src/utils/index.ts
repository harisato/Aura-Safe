import { getChains } from 'src/config/cache/chains'
import { getChainDefaultGasPrice, getChainInfo, getNativeCurrency } from 'src/config'
import { MChainInfo } from 'src/services'
import { calculateFee, GasPrice } from '@cosmjs/stargate'

export const validateFloatNumber = (value: any): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(value)
}
export const formatNumber = (value: any): string => {
  return value == '' || value == 0 ? value : (+value).toString()
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
  return `${parseFloat((+amount / 10 ** +nativeCurrency.decimals).toString())} ${nativeCurrency.symbol}`
}
export const formatNativeCurrency = (amount) => {
  const nativeCurrency = getNativeCurrency()
  return `${parseFloat((+amount).toString())} ${nativeCurrency.symbol}`
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
