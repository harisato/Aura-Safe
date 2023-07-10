import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { currentChainId } from 'src/logic/config/store/selectors'
import { Errors } from 'src/logic/exceptions/CodedException'
import { loadPageQueuedTransactionsFromAuraApi } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadGatewayTransactions'
import { addQueuedTransactions } from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { extractSafeAddress } from 'src/routes/routes'
import { Await } from 'src/types/helpers'
import { useEffect } from 'react'
import { TransactionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import {
  nextTransactions,
  queuedTransactions,
  txTransactions as txsTransactions,
} from 'src/logic/safe/store/selectors/gatewayTransactions'

type PagedQueuedTransactions = {
  count: number
  isLoading: boolean
  transactions: TransactionDetails['transactions']
  hasMore: boolean
  next: () => Promise<void>
}

export const usePagedQueuedTransactions = (): PagedQueuedTransactions => {
  const { count, transactions } = useQueueTransactions()

  const chainId = useSelector(currentChainId)

  const dispatch = useDispatch()
  const safeAddress = extractSafeAddress()
  const [hasMore, setHasMore] = useState(true)

  const nextPage = async () => {
    let results: Await<ReturnType<typeof loadPageQueuedTransactionsFromAuraApi>>
    try {
      // results = await loadPagedQueuedTransactions(safeAddress)
      results = await loadPageQueuedTransactionsFromAuraApi(safeAddress)
    } catch (e) {
      // No next page
      if (e.content !== Errors._608) {
        e.log()
      }
    }

    if (!results) {
      setHasMore(false)
      return
    }

    const { values, next } = results

    if (next === null) {
      setHasMore(false)
    }

    if (values) {
      dispatch(addQueuedTransactions({ chainId, safeAddress, values }))
    } else {
      setHasMore(false)
    }
  }

  const isLoading = typeof transactions === 'undefined' || typeof count === 'undefined'

  transactions.sort((a, b) => {
    if (typeof a[1][0].txSequence == 'undefined' || typeof b[1][0].txSequence == 'undefined') return 0
    return +a[1][0].txSequence - +b[1][0].txSequence
  })
  return { count, isLoading, transactions, hasMore, next: nextPage }
}

/**
 * Get transactions (next and queue) from nextTransactions and queuedTransactions selectors
 */
const useQueueTransactions = (): TransactionDetails => {
  const nextTxs = useSelector(nextTransactions)
  const queuedTxs = useSelector(queuedTransactions)
  const allTxs = useSelector(txsTransactions)
  const dispatch = useDispatch()
  const [txsCount, setTxsCount] = useState<{ next: number; queued: number; txs: number }>({
    next: 0,
    queued: 0,
    txs: 0,
  })

  useEffect(() => {
    const next = nextTxs
      ? Object.entries(nextTxs).reduce((acc, [, transactions]) => (acc += transactions.length), 0)
      : 0
    const queued = queuedTxs
      ? Object.entries(queuedTxs).reduce((acc, [, transactions]) => (acc += transactions.length), 0)
      : 0

    const txs = allTxs ? Object.entries(allTxs).reduce((acc, [, transactions]) => (acc += transactions.length), 0) : 0

    setTxsCount({ next, queued, txs })
  }, [dispatch, nextTxs, queuedTxs])

  return {
    count: txsCount.txs,
    transactions: allTxs ? Object.entries(allTxs) : [],
  }
}
