enum KeplrErrors {
  Success = 'OK',
  Failed = 'FAILED',
  NoChainInfo = 'THERE IS NO CHAIN INFO FOR',
  SameChain = 'SAME CHAIN IS ALREADY REGISTERED',
  NotRegistered = 'CHAIN IS NOT REGISTERED',
  RequestRejected = 'REQUEST REJECTED',
  NotInstall = 'NOT INSTALL',
}

enum WalletProviders {
  Keplr = 'keplr',
  Coin98 = 'coin98',
}

export { KeplrErrors, WalletProviders }
