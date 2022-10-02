import { toBase64 } from '@cosmjs/encoding'
import { SignerData, SigningStargateClient, StdFee } from '@cosmjs/stargate'
import { KeplrIntereactionOptions } from '@keplr-wallet/types'
import _ from 'lodash'
import { getInternalChainId } from 'src/config'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { Vote } from 'src/logic/providers/utils/message'
import { getProvider } from 'src/logic/providers/utils/wallets'
import { WALLETS_NAME } from 'src/logic/wallets/constant/wallets'
import { loadLastUsedProvider } from 'src/logic/wallets/store/middlewares/providerWatcher'
import { getAccountOnChain } from 'src/services'
import { ICreateSafeTransaction } from 'src/types/transaction'

const getDefaultOptions = (): KeplrIntereactionOptions => ({
  sign: {
    preferNoSetMemo: true,
    preferNoSetFee: true,
    disableBalanceCheck: true,
  },
})

const getMessage: {
  [key in MsgTypeUrl]?: any
} = {
  [MsgTypeUrl.Vote]: Vote,
}

const signMessage = async (
  chainId: string,
  safeAddress: string,
  typeUrl: MsgTypeUrl,
  value: unknown,
  fee: StdFee,
): Promise<any> => {
  return loadLastUsedProvider()
    .then((loadLastUsedProvider) =>
      loadLastUsedProvider ? getProvider(loadLastUsedProvider as WALLETS_NAME) : undefined,
    )
    .then((provider) => {
      if (!provider) return
      provider.defaultOptions = getDefaultOptions()

      const offlineSignerOnlyAmino = window.getOfflineSignerOnlyAmino

      if (offlineSignerOnlyAmino) {
        return offlineSignerOnlyAmino(chainId)
      }

      return undefined
    })
    .then((signer) => {
      if (!signer) return

      return Promise.all([
        signer.getAccounts(),
        SigningStargateClient.offline(signer),
        getAccountOnChain(safeAddress, getInternalChainId()),
      ])
    })
    .then((data) => {
      if (!data) {
        return
      }

      const [account, client, accountOnChain] = data

      const msg = getMessage[typeUrl](value)

      const signerData: SignerData = {
        accountNumber: (accountOnChain.Data as any).accountNumber,
        sequence: (accountOnChain.Data as any).sequence,
        chainId,
      }

      const signerAddress = _.get(account, '[0].address')
      debugger
      if (!(signerAddress && msg && fee && signerData)) {
        return undefined
      }
      return client.sign(signerAddress, [msg], fee, '', signerData)
    })
}

export { signMessage as createMessage }
