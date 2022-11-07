import { SignerData, SigningStargateClient, StdFee } from '@cosmjs/stargate'
import { KeplrIntereactionOptions } from '@keplr-wallet/types'
import _ from 'lodash'
import { getChainInfo } from 'src/config'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { Vote } from 'src/logic/providers/utils/message'
import { getProvider } from 'src/logic/providers/utils/wallets'
import { WALLETS_NAME } from 'src/logic/wallets/constant/wallets'
import { loadLastUsedProvider } from 'src/logic/wallets/store/middlewares/providerWatcher'

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
  const loadLastUsedProviderResult = await loadLastUsedProvider()
  const provider = loadLastUsedProviderResult
    ? await getProvider(loadLastUsedProviderResult as WALLETS_NAME)
    : undefined
  if (!provider) return
  provider.defaultOptions = getDefaultOptions()
  const offlineSignerOnlyAmino = window.getOfflineSignerOnlyAmino
  if (offlineSignerOnlyAmino) {
    const signer = await offlineSignerOnlyAmino(chainId)
    const chainInfo = getChainInfo()
    if (!signer) return
    const account = await signer.getAccounts()
    const client = await SigningStargateClient.offline(signer)
    const onlineClient = await SigningStargateClient.connectWithSigner(chainInfo.rpcUri.value, signer)
    const onlineData = await onlineClient.getSequence(safeAddress)
    const signerData: SignerData = {
      accountNumber: onlineData.accountNumber,
      sequence: onlineData.sequence,
      chainId,
    }
    const signerAddress = _.get(account, '[0].address')
    if (!(signerAddress && value && fee && signerData)) {
      return undefined
    }
    const respone = await client.sign(signerAddress, [{ typeUrl, value }], fee, '', signerData)
    return { ...respone, accountNumber: onlineData.accountNumber, sequence: onlineData.sequence }
  }
  return undefined
}
export { signMessage as createMessage }
