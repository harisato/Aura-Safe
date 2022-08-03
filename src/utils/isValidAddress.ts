import { bech32 } from 'bech32'
import { getShortName } from 'src/config'

export const isValidAddress = (address?: string, prefix?: string): boolean => {
  const shortName = getShortName()

  if (!address) {
    return false
  }

  try {
    validate(address, prefix ? prefix : shortName)
    return true
  } catch {
    return false
  }
}

const validate = (bech32Address: string, prefix?: string) => {
  const { prefix: decodedPrefix } = bech32.decode(bech32Address)
  if (prefix && prefix !== decodedPrefix) {
    throw new Error(`Unexpected prefix (expected: ${prefix}, actual: ${decodedPrefix})`)
  }
}
