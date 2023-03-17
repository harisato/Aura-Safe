import { AccordionDetails } from '@aura/safe-react-components'
import { useEffect, useMemo, useRef, useState } from 'react'
import { formatTimeInWords } from 'src/utils/date'
import TxAmount from '../components/TxAmount'
import TxDetail from '../components/TxDetail'
import TxExecutionInfo from '../components/TxExecutionInfo'
import TxQuickAction from '../components/TxQuickAction'
import TxSequence from '../components/TxSequence'
import TxStatus from '../components/TxStatus'
import TxTime from '../components/TxTime'
import TxType from '../components/TxType'
import { NoPaddingAccordion, StyledAccordionSummary, StyledTransaction } from '../styled'
export default function Transaction({
  transaction,
  hideSeq,
  curSeq,
}: {
  transaction: any
  hideSeq?: boolean
  curSeq: string
}) {
  const [txDetailLoaded, setTxDetailLoaded] = useState(false)

  if (!transaction) {
    return null
  }

  return (
    <NoPaddingAccordion
      id={`tx-${transaction.id}`}
      onChange={() => setTxDetailLoaded(true)}
      TransitionProps={{
        mountOnEnter: false,
        unmountOnExit: true,
        appear: true,
      }}
    >
      <StyledAccordionSummary>
        <StyledTransaction>
          {hideSeq ? (
            <TxSequence style={{ visibility: 'hidden' }} sequence={transaction.txSequence} />
          ) : (
            <TxSequence sequence={transaction.txSequence} />
          )}
          <TxType type={transaction.txInfo.typeUrl} />
          <TxAmount amount={transaction.txInfo.amount} />
          <TxTime time={transaction.timestamp ? formatTimeInWords(transaction.timestamp) : 'Unknown'} />
          <TxExecutionInfo
            required={transaction.executionInfo.confirmationsRequired}
            submitted={transaction.executionInfo.confirmationsSubmitted}
            rejected={transaction.executionInfo.rejections}
          />
          <TxQuickAction transaction={transaction} curSeq={curSeq} />
          <TxStatus shouldDisplayDot transaction={transaction} />
        </StyledTransaction>
      </StyledAccordionSummary>
      <AccordionDetails>
        {txDetailLoaded && <TxDetail transaction={transaction} isHistoryTx={false} />}
      </AccordionDetails>
    </NoPaddingAccordion>
  )
}
