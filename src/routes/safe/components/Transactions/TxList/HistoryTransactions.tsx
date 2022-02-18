import { Loader, Title } from '@gnosis.pm/safe-react-components'
import { ReactElement, useEffect, useState } from 'react'

import { usePagedHistoryTransactions } from './hooks/usePagedHistoryTransactions'
import { Centered, NoTransactions } from './styled'
import { HistoryTxList } from './HistoryTxList'
import { TxsInfiniteScroll } from './TxsInfiniteScroll'
import Img from 'src/components/layout/Img'
import NoTransactionsImage from './assets/no-transactions.svg'
import { ITransactionListItem, ITransactionListQuery } from 'src/types/transaction'
import { getAllTx } from 'src/services'

export const HistoryTransactions = (): ReactElement => {
  const { count, hasMore, next, transactions, isLoading } = usePagedHistoryTransactions()

  const [historyList, setHistoryList] = useState<ITransactionListItem[]>([])

  useEffect(() => {
    const payload: ITransactionListQuery = {
      safeAddress: 'aura14g36ajgngkmw2jp26zvc4388ecxmppmxqgz5kx',
      pageIndex: 1,
      pageSize: 10,
    }

    const getTx = async (payload) => {
      const res = await getAllTx(payload)

      console.log(res)
    }

    getTx(payload)
  }, [historyList])

  if (count === 0 && isLoading) {
    return (
      <Centered>
        <Loader size="md" />
      </Centered>
    )
  }

  if (count === 0 || !transactions.length) {
    return (
      <NoTransactions>
        <Img alt="No Transactions yet" src={NoTransactionsImage} />
        <Title size="xs">History transactions will appear here </Title>
      </NoTransactions>
    )
  }

  return (
    <TxsInfiniteScroll next={next} hasMore={hasMore} isLoading={isLoading}>
      <HistoryTxList transactions={transactions} />
    </TxsInfiniteScroll>
  )
}
