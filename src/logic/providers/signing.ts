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

function createMessage(chainId: string, safeAddress: string, typeUrl: MsgTypeUrl, value: unknown, fee: StdFee): void {
  try {
    loadLastUsedProvider()
      .then((loadLastUsedProvider) =>
        loadLastUsedProvider ? getProvider(loadLastUsedProvider as WALLETS_NAME) : undefined,
      )
      .then((provider) => {
        console.log('PROVIDER: ', provider)

        if (!provider) return
        provider.defaultOptions = getDefaultOptions()

        const offlineSignerOnlyAmino = window.getOfflineSignerOnlyAmino

        if (offlineSignerOnlyAmino) {
          return offlineSignerOnlyAmino(chainId)
        }

        return undefined
      })
      .then((signer) => {
        console.log('signer: ', signer)
        if (!signer) return

        return Promise.all([
          signer.getAccounts(),
          SigningStargateClient.offline(signer),
          getAccountOnChain(safeAddress, getInternalChainId()),
        ])
      })
      .then((data) => {
        console.log('data: ', data)
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
        debugger
        return Promise.all([client.sign(account[0]?.address, [msg], fee, '', signerData), Promise.resolve(account)])
      })
      .then((result) => {
        console.log('result: ', result)
        if (!result) return

        const [signResult, account] = result

        const signatures = toBase64(signResult.signatures[0])
        const bodyBytes = toBase64(signResult.bodyBytes)
        const authInfoBytes = toBase64(signResult.authInfoBytes)

        const data: ICreateSafeTransaction = {
          internalChainId: getInternalChainId(),
          creatorAddress: _.get(account, '[0].address'),
          signature: signatures,
          bodyBytes: bodyBytes,
          authInfoBytes: authInfoBytes,
        }

        console.log(data)
      })
      .catch((e) => {
        console.log({ e })
      })
  } catch (error) {
    console.log(error)
  }
}

export { createMessage }
