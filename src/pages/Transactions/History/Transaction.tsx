import { AccordionDetails } from '@aura/safe-react-components'
import { formatTimeInWords } from 'src/utils/date'
import TxAmount from '../components/TxAmount'
import TxStatus from '../components/TxStatus'
import TxTime from '../components/TxTime'
import TxType from '../components/TxType'
import { NoPaddingAccordion, StyledAccordionSummary, StyledTransaction } from '../styled'
import { useEffect, useState } from 'react'
import TxDetail from '../components/TxDetail'
import TxSequence from '../components/TxSequence'
export default function Transaction({ transaction, notFirstTx }) {
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
        <StyledTransaction shouldBlur={transaction.txStatus == 'REPLACED'}>
          {notFirstTx ? (
            <TxSequence style={{ visibility: 'hidden' }} sequence={transaction.txSequence} />
          ) : (
            <TxSequence sequence={transaction.txSequence} />
          )}
          <TxType type={transaction.txInfo.typeUrl} />
          <TxAmount amount={transaction.txInfo.amount} />
          <TxTime time={transaction.timestamp ? formatTimeInWords(transaction.timestamp) : 'Unknown'} />
          <TxStatus transaction={transaction} />
        </StyledTransaction>
      </StyledAccordionSummary>
      <AccordionDetails>{txDetailLoaded && <TxDetail transaction={transaction} isHistoryTx />}</AccordionDetails>
    </NoPaddingAccordion>
  )
}
