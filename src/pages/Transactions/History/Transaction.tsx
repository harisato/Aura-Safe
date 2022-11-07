import { AccordionDetails } from '@aura/safe-react-components'
import { formatTimeInWords } from 'src/utils/date'
import TxAmount from '../components/TxAmount'
import TxStatus from '../components/TxStatus'
import TxTime from '../components/TxTime'
import TxType from '../components/TxType'
import { NoPaddingAccordion, StyledAccordionSummary, StyledTransaction } from '../styled'
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
          <TxStatus transaction={transaction} />
        </StyledTransaction>
      </StyledAccordionSummary>
      <AccordionDetails>{txDetailLoaded && <TxDetail transaction={transaction} />}</AccordionDetails>
    </NoPaddingAccordion>
  )
}
