import { Loader, Title } from '@aura/safe-react-components'
import { ReactElement, Fragment } from 'react'

import { InfiniteScroll, INFINITE_SCROLL_CONTAINER } from 'src/components/InfiniteScroll'
import Img from 'src/components/layout/Img'
import { formatWithSchema } from 'src/utils/date'
import NoTransactionsImage from 'src/assets/icons/no-transactions.svg'
import { Centered, HorizontallyCentered, NoTransactions, ScrollableTransactionsContainer, SubTitle } from '../styled'
import Transaction from './Transaction'
import { usePagedHistoryTransactions } from '../hooks/usePagedHistoryTransactions'
export default function HistoryTransactions(): ReactElement {
  const { count, isLoading, hasMore, next, transactions } = usePagedHistoryTransactions()
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
    <InfiniteScroll next={next} hasMore={hasMore}>
      <ScrollableTransactionsContainer id={INFINITE_SCROLL_CONTAINER}>
        {transactions &&
          count !== 0 &&
          transactions.map(([nonce, txs]) => {
            return (
              <Fragment key={nonce}>
                <div className="gap-div"></div>
                <SubTitle size="lg">{formatWithSchema(Number(nonce), 'MMM d, yyyy')}</SubTitle>
                {txs.map((tx, index) => {
                  return <Transaction key={index} transaction={tx} />
                })}
              </Fragment>
            )
          })}
        <HorizontallyCentered isVisible={isLoading}>
          <Loader size="md" />
        </HorizontallyCentered>
      </ScrollableTransactionsContainer>
    </InfiniteScroll>
  )
}
