import { Loader, Title } from '@aura/safe-react-components'
import { ReactElement, createContext, useState, Fragment, useEffect } from 'react'

import { InfiniteScroll, INFINITE_SCROLL_CONTAINER } from 'src/components/InfiniteScroll'
import Img from 'src/components/layout/Img'
import { usePagedQueuedTransactions } from '../hooks/usePagedQueuedTransactions'
import {
  AccordionWrapper,
  Centered,
  HorizontallyCentered,
  NoTransactions,
  ScrollableTransactionsContainer,
} from '../styled'
import NoTransactionsImage from 'src/assets/icons/no-transactions.svg'
import Transaction from './Transaction'
import TxActionModal from '../TxActionModal'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMSafe } from 'src/logic/safe/store/actions/fetchSafe'
import { extractSafeAddress, extractSafeId } from 'src/routes/routes'

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
  const { nextQueueSeq, sequence: currentSequence } = useSelector(currentSafeWithNames)
  const { count, isLoading, hasMore, next, transactions } = usePagedQueuedTransactions()
  const [txId, setTxId] = useState<string>('')
  const [action, setAction] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const dispatch = useDispatch()
  const safeAddress = extractSafeAddress()
  const safeId = extractSafeId() as number
  useEffect(() => {
    dispatch(fetchMSafe(safeAddress, safeId))
  }, [count])

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
            transactions.map(([nonce, txs], index) => {
              return txs.length == 1 ? (
                <Fragment key={nonce}>
                  {+nonce == +currentSequence && index == 0 ? (
                    <p className="section-title">Next</p>
                  ) : index <= 1 ? (
                    <p className="section-title">Sequence</p>
                  ) : null}
                  <AccordionWrapper>
                    <Transaction transaction={txs[0]} />
                  </AccordionWrapper>
                </Fragment>
              ) : (
                <Fragment key={nonce}>
                  {+nonce == +currentSequence && index == 0 ? (
                    <p className="section-title">Next</p>
                  ) : index <= 1 ? (
                    <p className="section-title">Sequence</p>
                  ) : null}
                  <AccordionWrapper className="merged-tx">
                    <div className="notice">
                      <div>{nonce}</div>
                      <p>
                        These transactions conflict as they use the same sequence. Excecuting one will automatically
                        replace the other(s)
                      </p>
                    </div>
                    {txs.map((tx, index) => (
                      <Transaction hideSeq={true} key={tx.id} transaction={tx} />
                    ))}
                  </AccordionWrapper>
                </Fragment>
              )
            })}
          <HorizontallyCentered isVisible={isLoading}>
            <Loader size="md" />
          </HorizontallyCentered>
        </ScrollableTransactionsContainer>
      </InfiniteScroll>
      <TxActionModal />
    </TxSignModalContext.Provider>
  )
}
