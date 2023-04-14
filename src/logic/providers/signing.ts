import { encodeSecp256k1Pubkey, makeSignDoc as makeSignDocAmino } from '@cosmjs/amino'
import { SigningCosmWasmClient, createWasmAminoConverters } from '@cosmjs/cosmwasm-stargate'
import { fromBase64 } from '@cosmjs/encoding'
import { Int53 } from '@cosmjs/math'
import { Registry, TxBodyEncodeObject, encodePubkey, makeAuthInfoBytes } from '@cosmjs/proto-signing'
import {
  AminoTypes,
  SequenceResponse,
  SignerData,
  SigningStargateClient,
  StdFee,
  createAuthzAminoConverters,
  createBankAminoConverters,
  createDistributionAminoConverters,
  createFreegrantAminoConverters,
  createGovAminoConverters,
  createIbcAminoConverters,
  createStakingAminoConverters,
} from '@cosmjs/stargate'
import { KeplrIntereactionOptions } from '@keplr-wallet/types'
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import _ from 'lodash'
import { getChainInfo, getInternalChainId } from 'src/config'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { Vote } from 'src/logic/providers/utils/message'
import { getProvider } from 'src/logic/providers/utils/wallets'
import { WALLETS_NAME } from 'src/logic/wallets/constant/wallets'
import { loadLastUsedProvider } from 'src/logic/wallets/store/middlewares/providerWatcher'
import { getAccountOnChain } from 'src/services'
import { TxTypes } from './txTypes'
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

const signCosmosMessage = async (
  chainId: string,
  safeAddress: string,
  typeUrl: MsgTypeUrl,
  messages: any,
  fee: StdFee,
  sequence?: string | undefined,
  memo?: string,
): Promise<any> => {
  try {
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
      // const onlineData = await onlineClient.getSequence(safeAddress)
      const onlineData: SequenceResponse = (await getAccountOnChain(safeAddress, getInternalChainId())).Data
      const signerData: SignerData = {
        accountNumber: onlineData.accountNumber,
        sequence: sequence ? +sequence : onlineData?.sequence,
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
      return {
        ...respone,
        accountNumber: onlineData.accountNumber,
        sequence: sequence ? +sequence : onlineData?.sequence,
      }
    }
    return undefined
  } catch (error) {
    throw new Error(error)
  }
}

export const signCosWasmMessage = async (
  chainId: string,
  safeAddress: string,
  typeUrl: MsgTypeUrl,
  messages: any,
  fee: StdFee,
  sequence?: string | undefined,
  memo?: string,
): Promise<any> => {
  try {
    const loadLastUsedProviderResult = await loadLastUsedProvider()
    const provider = loadLastUsedProviderResult
      ? await getProvider(loadLastUsedProviderResult as WALLETS_NAME)
      : undefined
    if (!provider) return
    provider.defaultOptions = getDefaultOptions()
    const offlineSignerOnlyAmino = window.getOfflineSignerOnlyAmino
    if (offlineSignerOnlyAmino) {
      const signer = await offlineSignerOnlyAmino(chainId)
      if (!signer) return
      const account = await signer.getAccounts()
      const client = await SigningCosmWasmClient.offline(signer)
      const onlineData: SequenceResponse = (await getAccountOnChain(safeAddress, getInternalChainId())).Data
      const signerData: SignerData = {
        accountNumber: onlineData.accountNumber,
        sequence: sequence ? +sequence : onlineData?.sequence,
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
      return {
        ...respone,
        accountNumber: onlineData.accountNumber,
        sequence: sequence ? +sequence : onlineData?.sequence,
      }
    }
    return undefined
  } catch (error) {
    throw new Error(error)
  }
}

export const signMessage = async (
  chainId: string,
  safeAddress: string,
  typeUrl: MsgTypeUrl,
  messages: any,
  fee: StdFee,
  sequence?: string | undefined,
  memo?: string,
): Promise<any> => {
  try {
    const loadLastUsedProviderResult = await loadLastUsedProvider()
    const provider = loadLastUsedProviderResult
      ? await getProvider(loadLastUsedProviderResult as WALLETS_NAME)
      : undefined
    if (!provider) return
    provider.defaultOptions = getDefaultOptions()
    const offlineSignerOnlyAmino = window.getOfflineSignerOnlyAmino
    if (offlineSignerOnlyAmino) {
      const signer = await offlineSignerOnlyAmino(chainId)
      if (!signer) return
      const account = await signer.getAccounts()
      const client = await SigningCosmWasmClient.offline(signer)
      const onlineData: SequenceResponse = (await getAccountOnChain(safeAddress, getInternalChainId())).Data
      const signerData: SignerData = {
        accountNumber: onlineData.accountNumber,
        sequence: sequence ? +sequence : onlineData?.sequence,
        chainId,
      }
      const signerAddress = _.get(account, '[0].address')
      if (!(signerAddress && messages && fee && signerData)) {
        return undefined
      }
      ;(window as any).signObject = { signerAddress, messages, fee, memo, signerData }

      const registry = new Registry(TxTypes)
      const aminoTypes = new AminoTypes({
        ...createBankAminoConverters(),
        ...createStakingAminoConverters(getChainInfo().shortName),
        ...createDistributionAminoConverters(),
        ...createGovAminoConverters(),
        ...createWasmAminoConverters(),
        ...createAuthzAminoConverters(),
        ...createFreegrantAminoConverters(),
        ...createIbcAminoConverters(),
      })

      const pubkey = encodePubkey(encodeSecp256k1Pubkey(account[0].pubkey))

      const signMode = SignMode.SIGN_MODE_LEGACY_AMINO_JSON

      const msgs = messages.map((msg) => {
        return aminoTypes.toAmino(msg)
      })
      const signDoc = makeSignDocAmino(msgs, fee, chainId, memo, signerData.accountNumber, signerData.sequence)
      const { signature, signed } = await signer.signAmino(signerAddress, signDoc)
      const signedTxBody = {
        messages: signed.msgs.map((msg) => aminoTypes.fromAmino(msg)),
        memo: signed.memo,
      }
      const signedTxBodyEncodeObject: TxBodyEncodeObject = {
        typeUrl: '/cosmos.tx.v1beta1.TxBody',
        value: signedTxBody,
      }
      const signedTxBodyBytes = registry.encode(signedTxBodyEncodeObject)
      const signedGasLimit = Int53.fromString(signed.fee.gas).toNumber()
      const signedSequence = Int53.fromString(signed.sequence).toNumber()
      const signedAuthInfoBytes = makeAuthInfoBytes(
        [{ pubkey, sequence: signedSequence }],
        signed.fee.amount,
        signedGasLimit,
        signMode,
      )
      const respone = TxRaw.fromPartial({
        bodyBytes: signedTxBodyBytes,
        authInfoBytes: signedAuthInfoBytes,
        signatures: [fromBase64(signature.signature)],
      })
      return {
        ...respone,
        accountNumber: onlineData.accountNumber,
        sequence: sequence ? +sequence : onlineData?.sequence,
      }
    }
    return undefined
  } catch (error) {
    throw new Error(error)
  }
}

export { signCosmosMessage as createMessage }
