import { getShortName } from 'src/config'

export const isValidAddress = (address?: string): boolean => {
  const shortName = getShortName()

  if (shortName && address) {
    return address.startsWith(shortName) && address.length > 40
  }

  return false
  // if (address) {
  //   // `isAddress` do not require the string to start with `0x`
  //   // `isHexStrict` ensures the address to start with `0x` aside from being a valid hex string
  //   return isHexStrict(address) && isAddress(address)
  // }
}
