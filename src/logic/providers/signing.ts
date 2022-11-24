import { SequenceResponse, SignerData, SigningStargateClient, StdFee } from '@cosmjs/stargate'
import { KeplrIntereactionOptions } from '@keplr-wallet/types'
import _ from 'lodash'
import { getChainInfo, getInternalChainId } from 'src/config'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { Vote } from 'src/logic/providers/utils/message'
import { getProvider } from 'src/logic/providers/utils/wallets'
import { WALLETS_NAME } from 'src/logic/wallets/constant/wallets'
import { loadLastUsedProvider } from 'src/logic/wallets/store/middlewares/providerWatcher'
import { getAccountOnChain } from 'src/services'

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
  messages: any,
  fee: StdFee,
  memo?: string,
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
    // const onlineData = await onlineClient.getSequence(safeAddress)
    const onlineData: SequenceResponse = (await getAccountOnChain(safeAddress, getInternalChainId())).Data
    const signerData: SignerData = {
      accountNumber: onlineData.accountNumber,
      sequence: onlineData.sequence,
      chainId,
    }
    const signerAddress = _.get(account, '[0].address')
    if (!(signerAddress && messages && fee && signerData)) {
      return undefined
    }
    ;(window as any).signObject = messages?.[0]?.typeUrl
      ? { signerAddress, messages, fee, memo, signerData }
      : { signerAddress, messages: [{ typeUrl, value: messages }], fee, memo, signerData }
    const respone = messages?.[0]?.typeUrl
      ? await client.sign(signerAddress, messages, fee, memo || '', signerData)
      : await client.sign(signerAddress, [{ typeUrl, value: messages }], fee, memo || '', signerData)
    return { ...respone, accountNumber: onlineData.accountNumber, sequence: onlineData.sequence }
  }
  return undefined
}
export { signMessage as createMessage }
