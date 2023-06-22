import { Loader, Title } from '@aura/safe-react-components'
import { Fragment, ReactElement, createContext, useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import NoTransactionsImage from 'src/assets/icons/no-transactions.svg'
import Img from 'src/components/layout/Img'
import { fetchMSafe } from 'src/logic/safe/store/actions/fetchSafe'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { extractSafeAddress, extractSafeId } from 'src/routes/routes'
import { useQuery } from 'src/utils'
import { usePagedQueuedTransactions } from '../../../utils/hooks/usePagedQueuedTransactions'
import TxActionModal from '../TxActionModal'
import {
  AccordionWrapper,
  Centered,
  HorizontallyCentered,
  NoTransactions,
  ScrollableTransactionsContainer,
} from '../styled'
import Transaction from './Transaction'

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
  const { sequence: currentSequence, coinConfig } = useSelector(currentSafeWithNames)
  const { count, isLoading, transactions } = usePagedQueuedTransactions()
  const [txId, setTxId] = useState<string>('')
  const [action, setAction] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [curSeq, setCurSeq] = useState<string>(currentSequence)
  const dispatch = useDispatch()
  const safeAddress = extractSafeAddress()
  const safeId = extractSafeId() as number
  const queryParams = useQuery()
  const transactionId = queryParams.get('transactionId')

  useEffect(() => {
    setCurSeq(currentSequence)
  }, [transactions.length])

  useEffect(() => {
    dispatch(fetchMSafe(safeAddress, safeId))
  }, [count])

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
      <ScrollableTransactionsContainer>
        <div className="gap-div"></div>
        {transactions &&
          count !== 0 &&
          transactions.map(([nonce, txs], index) => {
            return txs.length == 1 ? (
              <Fragment key={nonce}>
                {+nonce == +curSeq && index == 0 ? (
                  <p className="section-title">Next</p>
                ) : index <= 1 ? (
                  <p className="section-title">{`Queued - Transaction with sequence ${curSeq} needs to be executed first`}</p>
                ) : null}
                <AccordionWrapper>
                  <Transaction transaction={txs[0]} curSeq={curSeq} listTokens={coinConfig} />
                </AccordionWrapper>
              </Fragment>
            ) : (
              <Fragment key={nonce}>
                {+nonce == +curSeq && index == 0 ? (
                  <p className="section-title">Next</p>
                ) : index <= 1 ? (
                  <p className="section-title">{`Queued - Transaction with sequence ${curSeq} needs to be executed first`}</p>
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
                    <Transaction hideSeq={true} key={tx.id} transaction={tx} curSeq={curSeq} listTokens={coinConfig} />
                  ))}
                </AccordionWrapper>
              </Fragment>
            )
          })}
        <HorizontallyCentered isVisible={isLoading}>
          <Loader size="md" />
        </HorizontallyCentered>
      </ScrollableTransactionsContainer>
      <TxActionModal />
    </TxSignModalContext.Provider>
  )
}
