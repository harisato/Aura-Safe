import { useCallback, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { currentChainId } from 'src/logic/config/store/selectors'
import {
  loadPagedHistoryTransactions,
  loadPageHistoryTransactionsFromAuraApi,
} from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadGatewayTransactions'
import { addHistoryTransactions } from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { TransactionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { extractSafeAddress } from 'src/routes/routes'
import { Await } from 'src/types/helpers'

import { useEffect } from 'react'

import { historyTransactions } from 'src/logic/safe/store/selectors/gatewayTransactions'

type PagedTransactions = {
  count: number
  transactions: TransactionDetails['transactions']
  hasMore: boolean
  next: () => Promise<void>
  isLoading: boolean
}

export const usePagedHistoryTransactions = (): PagedTransactions => {
  const { count, transactions } = useHistoryTransactions()
  const chainId = useSelector(currentChainId)

  const dispatch = useRef(useDispatch())
  const safeAddress = useRef(extractSafeAddress())
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const next = useCallback(async () => {
    setIsLoading(true)

    let results: Await<ReturnType<typeof loadPagedHistoryTransactions>>
    try {
      // results = await loadPagedHistoryTransactions(safeAddress.current)
      results = await loadPageHistoryTransactionsFromAuraApi(safeAddress.current)
    } catch (e) {
      // No next page
      console.error(e)

      // if (e.content !== Errors._608) {
      //   e.log()
      // }
    }

    if (!results) {
      setHasMore(false)
      setIsLoading(false)
      return
    }

    const { values, next } = results

    if (next === null) {
      setHasMore(false)
    }

    if (values) {
      dispatch.current(addHistoryTransactions({ chainId, safeAddress: safeAddress.current, values }))
    } else {
      setHasMore(false)
    }
    setIsLoading(false)
  }, [chainId])

  return { count, transactions, hasMore, next, isLoading }
}

const useHistoryTransactions = (): TransactionDetails => {
  const historyTxs = useSelector(historyTransactions)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const history = historyTxs
      ? Object.entries(historyTxs).reduce((acc, [, transactions]) => (acc += transactions.length), 0)
      : 0
    setCount(history)
  }, [historyTxs])

  return {
    count,
    transactions: historyTxs ? Object.entries(historyTxs) : [],
  }
}
