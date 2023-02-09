import { Loader, Title } from '@aura/safe-react-components'
import { ReactElement, Fragment, useState, useEffect } from 'react'

import { InfiniteScroll, INFINITE_SCROLL_CONTAINER } from 'src/components/InfiniteScroll'
import Img from 'src/components/layout/Img'
import { formatWithSchema } from 'src/utils/date'
import NoTransactionsImage from 'src/assets/icons/no-transactions.svg'
import {
  AccordionWrapper,
  Centered,
  HorizontallyCentered,
  NoTransactions,
  ScrollableTransactionsContainer,
  SubTitle,
} from '../styled'
import Transaction from './Transaction'
import { usePagedHistoryTransactions } from '../hooks/usePagedHistoryTransactions'
import { useQuery } from 'src/utils'
export default function HistoryTransactions(): ReactElement {
  const { count, isLoading, hasMore, next, transactions: historyTx } = usePagedHistoryTransactions()

  const queryParams = useQuery()
  const transactionId = queryParams.get('transactionId')

  const expandTx = () => {
    const elem = document.getElementById(`tx-${transactionId}`) as any
    if (!elem) {
      setTimeout(() => expandTx(), 500)
    } else {
      if (elem?.childNodes.length == 1) {
        elem?.childNodes[0]?.click()
      }
      elem?.scrollIntoView(true)
    }
  }

  useEffect(() => {
    expandTx()
  }, [transactionId])

  useEffect(() => {
    if (transactionId) {
      const elem = document.getElementById(`tx-${transactionId}`) as any
      elem?.scrollIntoView(true)
    }
  })

  if (count === 0 && isLoading) {
    return (
      <Centered>
        <Loader size="md" />
      </Centered>
    )
  }
  if (count === 0 || !historyTx) {
    return (
      <NoTransactions>
        <Img alt="No Transactions yet" src={NoTransactionsImage} />
        <Title size="xs">Queue transactions will appear here </Title>
      </NoTransactions>
    )
  }

  return (
    <ScrollableTransactionsContainer>
      {historyTx &&
        count !== 0 &&
        historyTx.map(([nonce, txs], index) => {
          return (
            <Fragment key={nonce}>
              <SubTitle>{formatWithSchema(Number(nonce), 'MMM d, yyyy')}</SubTitle>
              {txs.map((tx, index, txs) => {
                return (
                  <AccordionWrapper
                    key={index}
                    hasSameSeqTxAfter={txs[index].txSequence == txs[index + 1]?.txSequence}
                    hasSameSeqTxBefore={txs[index].txSequence == txs[index - 1]?.txSequence}
                    className="history-tx"
                  >
                    <Transaction
                      transaction={tx}
                      notFirstTx={index == 0 ? false : txs[index].txSequence == txs[index - 1].txSequence}
                    />
                  </AccordionWrapper>
                )
              })}
            </Fragment>
          )
        })}
      <HorizontallyCentered isVisible={isLoading}>
        <Loader size="md" />
      </HorizontallyCentered>
    </ScrollableTransactionsContainer>
  )
}
