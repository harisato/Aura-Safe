import { AccordionDetails } from '@aura/safe-react-components'
import { useState } from 'react'
import { formatTimeInWords } from 'src/utils/date'
import TxAmount from '../components/TxAmount'
import TxDetail from '../components/TxDetail'
import TxSequence from '../components/TxSequence'
import TxStatus from '../components/TxStatus'
import TxTime from '../components/TxTime'
import TxType from '../components/TxType'
import { NoPaddingAccordion, StyledAccordionSummary, StyledTransaction } from '../styled'
export default function Transaction({ transaction, notFirstTx, listTokens }) {
  const [txDetailLoaded, setTxDetailLoaded] = useState(false)

  const token = listTokens.find(
    (t) => t.cosmosDenom === transaction.txInfo.denom || t.denom === transaction.txInfo.denom,
  )

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
          <TxType type={transaction.txInfo.displayType ?? transaction.txInfo.typeUrl} />
          <TxAmount amount={transaction.txInfo.amount} token={token} />
          <TxTime time={transaction.timestamp ? formatTimeInWords(transaction.timestamp) : 'Unknown'} />
          <TxStatus transaction={transaction} />
        </StyledTransaction>
      </StyledAccordionSummary>
      <AccordionDetails>
        {txDetailLoaded && <TxDetail transaction={transaction} isHistoryTx token={token} />}
      </AccordionDetails>
    </NoPaddingAccordion>
  )
}
