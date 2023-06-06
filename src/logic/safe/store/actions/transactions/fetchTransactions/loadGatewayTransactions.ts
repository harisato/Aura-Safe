import { getTransactionHistory, TransactionListItem } from '@gnosis.pm/safe-react-gateway-sdk'
import isEqual from 'lodash/isEqual'
import { _getChainId, getInternalChainId } from 'src/config'
import { CodedException, Errors } from 'src/logic/exceptions/CodedException'
import { HistoryGatewayResponse, QueuedGatewayResponse } from 'src/logic/safe/store/models/types/gateway.d'
import { getAllTx } from 'src/services'
import { DEFAULT_PAGE_FIRST, DEFAULT_PAGE_SIZE, QUEUED_PAGE_SIZE } from 'src/services/constant/common'
import { ITransactionListQuery } from 'src/types/transaction'
import { checksumAddress } from 'src/utils/checksumAddress'
import { GATEWAY_URL } from 'src/utils/constants'
import { makeHistoryTransactionsFromService, makeQueueTransactionsFromService } from 'src/utils/transactionUtils'

/*************/
/*  HISTORY  */
/*************/
const historyPointers: { [chainId: string]: { [safeAddress: string]: { next?: string; previous?: string } } } = {}
const historyTransactions: { [chainId: string]: { [safeAddress: string]: { txs?: TransactionListItem[] } } } = {}

/**
 * Fetch next page if there is a next pointer for the safeAddress.
 * If the fetch was success, updates the pointers.
 * @param {string} safeAddress
 */
export const loadPagedHistoryTransactions = async (
  safeAddress: string,
): Promise<{ values: HistoryGatewayResponse['results']; next?: string } | undefined> => {
  const chainId = _getChainId()
  // if `historyPointers[safeAddress] is `undefined` it means `loadHistoryTransactions` wasn't called
  // if `historyPointers[safeAddress].next is `null`, it means it reached the last page in gateway-client
  if (!historyPointers[chainId][safeAddress]?.next) {
    throw new CodedException(Errors._608)
  }

  try {
    const { results, next, previous } = await getTransactionHistory(
      GATEWAY_URL,
      chainId,
      checksumAddress(safeAddress),
      historyPointers[chainId][safeAddress].next,
    )

    historyPointers[chainId][safeAddress] = { next, previous }

    return { values: results, next: historyPointers[chainId][safeAddress].next }
  } catch (e) {
    throw new CodedException(Errors._602, e.message)
  }
}

export const loadHistoryTransactionsFromAuraApi = async (
  safeAddress: string,
): Promise<HistoryGatewayResponse['results']> => {
  const chainId = _getChainId()
  const internalChainId = getInternalChainId()
  try {
    const { Data: list } = await getAllTx({
      safeAddress,
      pageIndex: DEFAULT_PAGE_FIRST,
      pageSize: DEFAULT_PAGE_SIZE,
      isHistory: true,
      internalChainId: internalChainId,
    })
    const { results, next, previous } = makeHistoryTransactionsFromService(list)
    if (!historyPointers[chainId]) {
      historyPointers[chainId] = {}
    }
    let ret: HistoryGatewayResponse['results'] | null = results
    if (!historyPointers[chainId][safeAddress]) {
      historyPointers[chainId][safeAddress] = { next, previous }
    }

    if (!historyTransactions[chainId]) {
      historyTransactions[chainId] = {}
    }

    if (historyTransactions[chainId][safeAddress]) {
      const history = historyTransactions[chainId][safeAddress]?.txs || []
      if (isEqual(results, history)) {
        ret = null
      } else {
        historyTransactions[chainId][safeAddress] = { txs: results }
      }
    } else {
      historyTransactions[chainId][safeAddress] = { txs: results }
    }

    return results
  } catch (e) {
    throw new CodedException(Errors._602, e.message)
  }
}

export const loadPageHistoryTransactionsFromAuraApi = async (
  safeAddress: string,
): Promise<{ values: HistoryGatewayResponse['results']; next?: string } | undefined> => {
  const chainId = _getChainId()
  const internalChainId = getInternalChainId()
  try {
    // const { results, next, previous } = await getTransactionHistory(GATEWAY_URL, chainId, checksumAddress(safeAddress))

    const history = historyPointers[chainId][safeAddress]
    if (!history?.next) {
      return
    }

    const _next = JSON.parse(history.next || '')

    if (!_next) {
      return
    }
    const pageNext = _next.pageIndex

    const payload: ITransactionListQuery = {
      safeAddress,
      pageIndex: pageNext,
      pageSize: DEFAULT_PAGE_SIZE,
      isHistory: true,
      internalChainId: internalChainId,
    }

    const { Data: list } = await getAllTx(payload)

    const { results, next, previous } = makeHistoryTransactionsFromService(list, payload)

    historyPointers[chainId][safeAddress] = { next, previous }

    return { values: results, next: historyPointers[chainId][safeAddress].next }
  } catch (e) {
    throw new CodedException(Errors._602, e.message)
  }
}
/************/
/*  QUEUED  */
/************/
const queuedPointers: {
  [chainId: string]: { [safeAddress: string]: { next?: string; previous?: string; current?: TransactionListItem[] } }
} = {}
const queuedTransactions: { [chainId: string]: { [safeAddress: string]: { txs?: TransactionListItem[] } } } = {}

/**
 * Fetch next page if there is a next pointer for the safeAddress.
 * If the fetch was success, updates the pointers.
 * @param {string} safeAddress
 */

export const loadQueuedTransactionsFromAuraApi = async (
  safeAddress: string,
  isNext = false,
): Promise<QueuedGatewayResponse['results'] | null> => {
  const chainId = _getChainId()
  const internalChainId = getInternalChainId()

  try {
    const { Data: list } = await getAllTx({
      safeAddress,
      isHistory: false,
      pageIndex: DEFAULT_PAGE_FIRST,
      pageSize: QUEUED_PAGE_SIZE,
      internalChainId: internalChainId,
    })
    const { results, next, previous } = makeQueueTransactionsFromService(list)

    const ret: QueuedGatewayResponse['results'] | null = results
    if (!queuedPointers[chainId]) {
      queuedPointers[chainId] = {}
    }

    if (!queuedPointers[chainId][safeAddress] || queuedPointers[chainId][safeAddress].next === null) {
      queuedPointers[chainId][safeAddress] = { next, previous }
    }

    if (!queuedTransactions[chainId]) {
      queuedTransactions[chainId] = {}
    }

    // if (queuedTransactions[chainId][safeAddress]) {
    //   const queuedPointerValue = queuedTransactions[chainId][safeAddress]?.txs || []
    //   if (isEqual(results, queuedPointerValue)) {
    //     ret = null
    //   } else {
    //     queuedTransactions[chainId][safeAddress] = { txs: results }
    //   queuedTransactions[chainId][safeAddress] = { txs: results }
    //   // }
    // } else {
    queuedTransactions[chainId][safeAddress] = { txs: results }
    // }

    return ret
  } catch (e) {
    throw new CodedException(Errors._602, e.message)
  }
}

export const loadPageQueuedTransactionsFromAuraApi = async (
  safeAddress: string,
  isNext = false,
): Promise<{ values: HistoryGatewayResponse['results']; next?: string } | undefined> => {
  const chainId = _getChainId()
  const internalChainId = getInternalChainId()

  try {
    const queued = queuedPointers[chainId][safeAddress]
    if (!queued?.next) {
      return
    }

    const parseNext = JSON.parse(queued.next || '')
    const pageNext = parseNext.pageIndex

    const payload: ITransactionListQuery = {
      safeAddress,
      pageIndex: pageNext,
      pageSize: DEFAULT_PAGE_SIZE,
      isHistory: false,
      internalChainId: internalChainId,
    }

    const { Data: list } = await getAllTx(payload)

    const { results, next, previous } = makeQueueTransactionsFromService(list, payload)

    queuedPointers[chainId][safeAddress] = { next, previous }

    return { values: results, next: queuedPointers[chainId][safeAddress].next }
  } catch (e) {
    throw new CodedException(Errors._602, e.message)
  }
}
