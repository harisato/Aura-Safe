import { ChainInfo, TransferDirection } from '@gnosis.pm/safe-react-gateway-sdk'
import axios from 'axios'
import { WalletKey } from 'src/logic/keplr/keplr'
import { CHAIN_THEMES, THEME_DF } from 'src/services/constant/chainThemes'
import { getExplorerUrl } from 'src/services/data/environment'
import { IProposal, IProposalRes } from 'src/types/proposal'
import {
  ICreateSafeTransaction,
  ISignSafeTransaction,
  ITransactionDetail,
  ITransactionListItem,
  ITransactionListQuery,
} from 'src/types/transaction'
import { IMSafeInfo, IMSafeResponse, OwnedMSafes } from '../types/safe'

let baseUrl = ''

export interface ISafeCreate {
  creatorAddress: string
  creatorPubkey: string
  otherOwnersAddress: string[]
  threshold: number
  internalChainId: number
}
export interface ISafeCancel {
  myAddress: string
}
export interface ISafeAllow {
  safeId: string
  myAddress: string
}

export interface IResponse<T> {
  AdditionalData: any[]
  Data: T
  ErrorCode: string
  Message: string
}

type _ChainInfo = {
  internalChainId: number
  denom: string
  symbol: string
  explorer: string
  defaultGasPrice: string
  defaultGas: GasPriceDefault[]
}

type GasPriceDefault = {
  typeUrl: string
  gasAmount: string
  multiplier: number
}

export type MChainInfo = ChainInfo & _ChainInfo

export function setBaseUrl(url: string): void {
  baseUrl = url
}

export function getMChainsConfig(): Promise<MChainInfo[]> {
  return axios.post(`${baseUrl}/general/network-list`).then((response) => {
    const chainList: MChainInfo[] = response.data.Data.map(
      (e: {
        chainId: any
        name: any
        rpc: any
        id: number
        prefix: string
        denom: string
        symbol: string
        explorer: string
        coinDecimals: string
        gasPrice: string
        defaultGas: GasPriceDefault[]
        tokenImg: string
      }) => {
        return {
          transactionService: null,
          internalChainId: e.id,
          denom: e.denom,
          explorer: e.explorer,
          chainId: e.chainId,
          chainName: e.name,
          shortName: e.prefix,
          l2: false,
          description: '',
          rpcUri: {
            authentication: '',
            value: e.rpc,
          },
          safeAppsRpcUri: {
            authentication: '',
            value: e.rpc,
          },
          publicRpcUri: {
            authentication: '',
            value: e.rpc,
          },
          blockExplorerUriTemplate: {
            address: getExplorerUrl(e.chainId, e.explorer, 'address'), //`${e.explorer.endsWith('/') ? e.explorer : e.explorer + '/'}account/{{address}}`,
            txHash: getExplorerUrl(e.chainId, e.explorer, 'txHash'),
            api: getExplorerUrl(e.chainId, e.explorer, 'api'),
          },
          nativeCurrency: {
            name: e.prefix.charAt(0).toUpperCase() + e.prefix.slice(1, e.prefix.length).toLowerCase(),
            symbol: e.symbol,
            decimals: e.coinDecimals,
            logoUri: e.tokenImg,
          },
          theme: CHAIN_THEMES[e.chainId] || THEME_DF,
          ensRegistryAddress: '',
          gasPrice: [],
          defaultGas: e.defaultGas,
          defaultGasPrice: e.gasPrice,
          disabledWallets: [],
          features: [
            // 'CONTRACT_INTERACTION',
            // 'DOMAIN_LOOKUP',
            // 'EIP1559',
            // 'ERC721',
            // 'SAFE_TX_GAS_OPTIONAL',
            // 'SPENDING_LIMIT',
          ],
        }
      },
    )
    return chainList
  })
}

export function fetchMSafesByOwner(addressOwner: string, internalChainId: number): Promise<OwnedMSafes> {
  return axios
    .get(`${baseUrl}/owner/${addressOwner}/safes`, {
      params: {
        internalChainId,
      },
    })
    .then((res) => res.data.Data)
}

export function createMSafe(safes: ISafeCreate): Promise<IResponse<IMSafeResponse>> {
  return axios.post(`${baseUrl}/multisigwallet`, safes).then((res) => res.data)
}

export async function cancelMSafe(safeId: number, payload: ISafeCancel): Promise<IResponse<any>> {
  return axios
    .delete(`${baseUrl}/multisigwallet/${safeId}`, {
      data: payload,
    })
    .then((res) => res.data)
}

export async function getMSafeInfo(safeId: number): Promise<IMSafeInfo> {
  return axios.get(`${baseUrl}/multisigwallet/${safeId}`).then((res) => res.data.Data)
}

export async function getMSafeInfoWithAdress(query: string, internalChainId: number): Promise<IMSafeInfo> {
  return axios
    .get(`${baseUrl}/multisigwallet/${query}`, {
      params: {
        internalChainId,
      },
    })
    .then((res) => res.data.Data)
}

export async function allowMSafe(safeId: number, walletKey: WalletKey): Promise<IResponse<IMSafeResponse>> {
  return axios.post(`${baseUrl}/multisigwallet/${safeId}`, walletKey).then((res) => res.data)
}

export function createSafeTransaction(transactionInfo: ICreateSafeTransaction): Promise<IResponse<number>> {
  return axios.post(`${baseUrl}/transaction/create`, transactionInfo).then((res) => res.data)
}

export function signSafeTransaction(transactionInfo: ISignSafeTransaction): Promise<IResponse<any>> {
  return axios.post(`${baseUrl}/transaction/sign`, transactionInfo).then((res) => res.data)
}

export const fetchSafeTransactionById = async (txId: string, safeAddress: string): Promise<IResponse<any>> => {
  return axios.get(`${baseUrl}/transaction/transaction-details/${txId}/${safeAddress}`).then((res) => res.data)
}

export const rejectTransactionById = async (payload: any): Promise<IResponse<any>> => {
  return axios.post(`${baseUrl}/transaction/reject`, payload).then((res) => res.data)
}

export async function getAllTx(payload: ITransactionListQuery): Promise<IResponse<Array<ITransactionListItem>>> {
  return axios.post(`${baseUrl}/transaction/get-all-txs`, payload).then((res) => res.data)
}

export async function getTxDetailByHash(
  txHash: string,
  safeAddress: string,
  direction: TransferDirection = TransferDirection.OUTGOING,
): Promise<IResponse<ITransactionDetail>> {
  return axios
    .get(`${baseUrl}/transaction/transaction-details/${txHash}/${safeAddress}/?direction=${direction}`)
    .then((res) => res.data)
}

export function sendSafeTransaction(payload: any): Promise<IResponse<any>> {
  return axios.post(`${baseUrl}/transaction/send`, payload).then((res) => res.data)
}

export function confirmSafeTransaction(payload: any): Promise<IResponse<any>> {
  return axios.post(`${baseUrl}/transaction/confirm`, payload).then((res) => res.data)
}

export async function getAccountOnChain(safeAddress: string, internalChainId): Promise<IResponse<any>> {
  return axios.get(`${baseUrl}/general/get-account-onchain/${safeAddress}/${internalChainId}`).then((res) => res.data)
}

export function auth(payload: any): Promise<IResponse<any>> {
  return axios.post(`${baseUrl}/auth`, payload).then((res) => res.data)
}

export async function getProposals(internalChainId: number | string): Promise<IResponse<IProposalRes>> {
  return axios.get(`${baseUrl}/gov/${internalChainId}/proposals`).then((res) => res.data)
}

export async function getProposalDetail(
  internalChainId: number | string,
  proposalId: number | string,
): Promise<IResponse<IProposal>> {
  return axios.get(`${baseUrl}/gov/${internalChainId}/proposals/${proposalId}`).then((res) => res.data)
}
