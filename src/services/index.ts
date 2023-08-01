import { SequenceResponse } from '@cosmjs/stargate'
import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import axios from 'axios'
import { getChainInfo } from 'src/config'
import { WalletKey } from 'src/logic/keplr/keplr'
import { CHAIN_THEMES, THEME_DF } from 'src/services/constant/chainThemes'
import { getExplorerUrl, getGatewayUrl } from 'src/services/data/environment'
import { IProposal, IProposalRes } from 'src/types/proposal'
import { ICreateSafeTransaction, ITransactionListItem, ITransactionListQuery } from 'src/types/transaction'
import { IMSafeInfo, IMSafeResponse, OwnedMSafes } from '../types/safe'

let baseUrl = ''
let baseIndexerUrl = 'https://indexer-v2.dev.aurascan.io/api/v1/graphiql'
let baseIndexerUrlv2 = 'https://indexer-v2.dev.aurascan.io/api/v2/graphql'
let githubPageTokenRegistryUrl = ''
let env = 'development'

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
interface IResponse<T> {
  AdditionalData: any[]
  Data: any
  data: any
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
export function setGithubPageTokenRegistryUrl(url: string): void {
  githubPageTokenRegistryUrl = url
}
export function setEnv(e: string): void {
  env = e
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
        rest: string
        coinConfig?: any[]
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
          lcd: e.rest,
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
            proposals: getExplorerUrl(e.chainId, e.explorer, 'proposals'),
            contract: getExplorerUrl(e.chainId, e.explorer, 'contract'),
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
          coinConfig: e?.coinConfig || [],
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

export const getTxDetailById = async (
  safeAddress: string,
  txId?: string,
  auraTxId?: string,
): Promise<IResponse<any>> => {
  let url = `${baseUrl}/transaction/transaction-details?safeAddress=${safeAddress}`
  if (auraTxId) {
    url += `&auraTxId=${auraTxId}`
  }
  if (txId) {
    url += `&multisigTxId=${txId}`
  }
  return axios.get(url).then((res) => res.data)
}

export const deleteTransactionById = async (payload: any): Promise<IResponse<any>> => {
  return axios.delete(`${baseUrl}/transaction/delete`, { data: payload }).then((res) => res.data)
}
export const changeTransactionSequenceById = async (payload: any): Promise<IResponse<any>> => {
  return axios.post(`${baseUrl}/transaction/change-seq`, payload).then((res) => res.data)
}
export const rejectTransactionById = async (payload: any): Promise<IResponse<any>> => {
  return axios.post(`${baseUrl}/transaction/reject`, payload).then((res) => res.data)
}

export async function getAllTx(payload: ITransactionListQuery): Promise<IResponse<Array<ITransactionListItem>>> {
  return axios.post(`${baseUrl}/transaction/get-all-txs`, payload).then((res) => res.data)
}

export function sendSafeTransaction(payload: any): Promise<IResponse<any>> {
  return axios.post(`${baseUrl}/transaction/send`, payload).then((res) => res.data)
}

export function confirmSafeTransaction(payload: any): Promise<IResponse<any>> {
  return axios.post(`${baseUrl}/transaction/confirm`, payload).then((res) => res.data)
}

export async function getAccountOnChain(safeAddress: string, internalChainId): Promise<IResponse<SequenceResponse>> {
  return axios.get(`${baseUrl}/general/get-account-onchain/${safeAddress}/${internalChainId}`).then((res) => res.data)
}

export async function getAddress(safeAddress: string): Promise<IResponse<any>> {
  return axios.get(`${baseUrl}/user/${safeAddress}`).then((res) => res.data)
}

export async function getAllNotifications(): Promise<IResponse<any>> {
  return axios.get(`${baseUrl}/notification`).then((res) => res.data)
}
export async function markNotificationAsRead(payload: string[]): Promise<IResponse<any>> {
  return axios.post(`${baseUrl}/notification`, { notifications: payload }).then((res) => res.data)
}
export function auth(payload: any): Promise<IResponse<any>> {
  return axios.post(`${baseUrl}/auth`, payload).then((res) => res.data)
}
export async function simulate(payload: any): Promise<IResponse<any>> {
  return axios.post(`${baseUrl}/transaction/simulate`, payload).then((res) => res.data)
}

//STAKING

export function getAllValidator(internalChainId: any): Promise<IResponse<any>> {
  return axios.get(`${baseUrl}/distribution/${internalChainId}/validators`).then((res) => res.data)
}

export function getAllDelegateOfUser(internalChainId: any, delegatorAddress: any): Promise<IResponse<any>> {
  return axios.get(`${baseUrl}/distribution/${internalChainId}/${delegatorAddress}/delegations`).then((res) => res.data)
}

export function getAllUnDelegateOfUser(internalChainId: any, delegatorAddress: any): Promise<IResponse<any>> {
  return axios
    .get(`${baseUrl}/distribution/${internalChainId}/${delegatorAddress}/undelegations`)
    .then((res) => res.data)
}

export function getDelegateOfUser(dataSend: any): Promise<IResponse<any>> {
  return axios.get(`${baseUrl}/distribution/delegation?${dataSend}`).then((res) => res.data)
}
export async function getNumberOfDelegator(validatorId: any): Promise<IResponse<any>> {
  const currentChainInfo = getChainInfo() as any
  const { chainInfo } = await getGatewayUrl()
  return axios
    .get(
      `${chainInfo.find((chain) => chain.chainId == currentChainInfo.chainId)?.rest
      }/cosmos/staking/v1beta1/validators/${validatorId}/delegations?pagination.count_total=true`,
    )
    .then((res) => res.data)
}

//VOTING

export const getProposals = async (env: string) => {

  return axios.post(`${baseIndexerUrlv2}`, {
    query: `query GetProposals {\n      ${env} {\n        proposal(order_by: {proposal_id: desc}, limit: 10) {\n          proposer_address\n          content\n          tally\n          proposal_id\n          status\n          submit_time\n          deposit_end_time\n          total_deposit\n          voting_start_time\n          voting_end_time\n        }\n      }\n    }`,
    variables: {},
    operationName: 'GetProposals',
  }).then((res) => res.data)
}

export async function getProposalDetail(
  internalChainId: number | string,
  proposalId: number | string,
): Promise<IResponse<IProposal>> {
  return axios.get(`${baseUrl}/gov/${internalChainId}/proposals/${proposalId}`).then((res) => res.data)
}
export async function getContract(contractAddress: string): Promise<IResponse<any>> {
  const chainInfo = getChainInfo() as any
  return axios
    .post(chainInfo.indexerUrl, {
      query: `query GetContractVerificationStatus($address: String = "") {
        ${chainInfo.environment || ''} {
          smart_contract(where: {address: {_eq: $address}}) {
            code {
              code_id_verifications {
                compiler_version
                verified_at
                verification_status
                execute_msg_schema
              }
            }
          }
        }
      }`,
      variables: {
        address: contractAddress,
      },
      operationName: 'GetContractVerificationStatus',
    })
    .then((res) => res.data)
}

export async function getTokenDetail() {
  return fetch(githubPageTokenRegistryUrl)
}

export async function getDetailToken(address: string): Promise<IResponse<any>> {
  const currentChainInfo = getChainInfo() as any

  return axios
    .get(`${currentChainInfo.lcd}cosmwasm/wasm/v1/contract/${address}/smart/eyAidG9rZW5faW5mbyI6IHt9IH0%3D`)
    .then((res) => res.data)
}
