import { NoPaddingAccordion, StyledAccordionSummary, StyledTransaction } from '../styled'
import { AccordionDetails } from '@aura/safe-react-components'
import TxType from '../components/TxType'
import TxAmount from '../components/TxAmount'
import TxTime from '../components/TxTime'
import { formatTimeInWords } from 'src/utils/date'
import TxExecutionInfo from '../components/TxExecutionInfo'
import TxStatus from '../components/TxStatus'
import { useState } from 'react'
import TxDetail from '../components/TxDetail'
export default function Transaction({ transaction }) {
  const [txDetailLoaded, setTxDetailLoaded] = useState(false)
  if (!transaction) {
    return null
  }
  return (
    <NoPaddingAccordion
      onChange={() => setTxDetailLoaded(true)}
      TransitionProps={{
        mountOnEnter: false,
        unmountOnExit: true,
        appear: true,
      }}
    >
      <StyledAccordionSummary>
        <StyledTransaction>
          <TxType type={transaction.txInfo.typeUrl} />
          <TxAmount amount={transaction.txInfo.amount} />
          <TxTime time={transaction.timestamp ? formatTimeInWords(transaction.timestamp) : 'Unknown'} />
          <TxExecutionInfo
            required={transaction.executionInfo.confirmationsRequired}
            submitted={transaction.executionInfo.confirmationsSubmitted}
          />
          <TxStatus shouldDisplayDot transaction={transaction} />
        </StyledTransaction>
      </StyledAccordionSummary>
      <AccordionDetails>{txDetailLoaded && <TxDetail transaction={transaction} />}</AccordionDetails>
    </NoPaddingAccordion>
  )
}
