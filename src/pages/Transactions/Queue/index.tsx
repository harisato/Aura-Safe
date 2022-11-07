import { Loader, Title } from '@aura/safe-react-components'
import { ReactElement, createContext, useState } from 'react'

import { InfiniteScroll, INFINITE_SCROLL_CONTAINER } from 'src/components/InfiniteScroll'
import Img from 'src/components/layout/Img'
import { usePagedQueuedTransactions } from '../hooks/usePagedQueuedTransactions'
import { Centered, HorizontallyCentered, NoTransactions, ScrollableTransactionsContainer } from '../styled'
import NoTransactionsImage from 'src/assets/icons/no-transactions.svg'
import Transaction from './Transaction'
import TxActionModal from '../TxActionModal'

export const TxSignModalContext = createContext<{
  txId: string
  action: string
  open: boolean
  setTxId: (c: string) => void
  setAction: (c: string) => void
  setOpen: (b: boolean) => void
}>({
  txId: '',
  action: '',
  open: false,
  setTxId: () => {},
  setAction: () => {},
  setOpen: () => {},
})
export default function QueueTransactions(): ReactElement {
  const { count, isLoading, hasMore, next, transactions } = usePagedQueuedTransactions()
  const [txId, setTxId] = useState<string>('')
  const [action, setAction] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  if (count === 0 && isLoading) {
    return (
      <Centered>
        <Loader size="md" />
      </Centered>
    )
  }
  if (count === 0 || !transactions) {
    return (
      <NoTransactions>
        <Img alt="No Transactions yet" src={NoTransactionsImage} />
        <Title size="xs">Queue transactions will appear here </Title>
      </NoTransactions>
    )
  }

  return (
    <TxSignModalContext.Provider value={{ txId, setTxId, open, setOpen, action, setAction }}>
      <InfiniteScroll next={next} hasMore={hasMore}>
        <ScrollableTransactionsContainer id={INFINITE_SCROLL_CONTAINER}>
          <div className="gap-div"></div>
          {transactions &&
            count !== 0 &&
            transactions.map(([nonce, txs]) => <Transaction key={nonce} transaction={txs[0]} />)}
          <HorizontallyCentered isVisible={isLoading}>
            <Loader size="md" />
          </HorizontallyCentered>
        </ScrollableTransactionsContainer>
      </InfiniteScroll>
      <TxActionModal />
    </TxSignModalContext.Provider>
  )
}
