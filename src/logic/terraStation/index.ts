import { LCDClient } from '@terra-money/terra.js'

export function connectToTerra(chainId: string) {
  const terra = new LCDClient({
    URL: 'http://localhost:3000',
    chainID: 'columbusadfasds-5',
  })



  console.log(terra.auth.accountInfo)
}
