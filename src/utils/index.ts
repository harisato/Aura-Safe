import { getChains } from 'src/config/cache/chains'
import { getChainDefaultGasPrice, getChainInfo, getCoinDecimal, getNativeCurrency } from 'src/config'
import { MChainInfo } from 'src/services'
import { calculateFee, GasPrice } from '@cosmjs/stargate'
import BigNumber from 'bignumber.js'
import calculateGasFee from 'src/logic/providers/utils/fee'
import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'

export const validateFloatNumber = (value: any): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(value)
}
export const formatNumber = (value: any): string => {
  const nativeCurrency = getNativeCurrency()

  if (value == '' || value == 0) return value
  const valueString = String(value)
  const [integer, fractional] = valueString.split('.')
  if (!fractional) return value
  const parsedNumber = [integer, '.', fractional.slice(0, nativeCurrency.decimals || 6)].join('')
  return parsedNumber
  // return value == '' || value == 0 ? value : parseFloat((+value).toFixed(6)).toString()
}
export const shortAddress = (address: string): string => {
  return address.slice(0, 6) + '...' + address.slice(address.length - 4, address.length)
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
export const roundGasAmount = (amount) => {
  const decimal = getCoinDecimal()
  const chainDefaultGasPrice = getChainDefaultGasPrice()
  const fee = calculateGasFee(+amount, +chainDefaultGasPrice, decimal)
  return amount
}
export const formatBigNumber = (amount, isMulti = false) => {
  const nativeCurrency = getNativeCurrency()
  if (isNaN(amount)) return '0'
  return isMulti
    ? new BigNumber(amount).times(new BigNumber(10).pow(nativeCurrency.decimals)).toFixed()
    : new BigNumber(
        new BigNumber(amount).div(new BigNumber(10).pow(nativeCurrency.decimals)).toFixed(nativeCurrency.decimals),
      ).toFixed()
}
export const formatNativeToken = (amount) => {
  const nativeCurrency = getNativeCurrency()
  return `${new BigNumber(
    new BigNumber(amount).div(new BigNumber(10).pow(nativeCurrency.decimals)).toFixed(+nativeCurrency.decimals),
  ).toFixed()} ${nativeCurrency.symbol}`
}
export const formatNativeCurrency = (amount) => {
  const nativeCurrency = getNativeCurrency()
  return `${new BigNumber(new BigNumber(+amount).toFixed(+nativeCurrency.decimals, 2)).toFixed()} ${
    nativeCurrency.symbol
  }`
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

export const useQuery = () => {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}
