import { Dot, Loader } from '@aura/safe-react-components'
import { ThemeColors } from '@aura/safe-react-components/dist/theme'
import styled from 'styled-components'
import { useTransactionStatus } from '../hooks/useTransactionStatus'

const SmallDot = styled(Dot)`
  height: 8px;
  width: 8px;
  background-color: #e65e5e !important;
`

const CircularProgressPainter = styled.div<{ color: ThemeColors }>`
  color: ${({ theme, color }) => theme.colors[color]};
`

export default function TxStatus({ transaction, shouldDisplayDot = false }) {
  const status = useTransactionStatus(transaction)
  return (
    <CircularProgressPainter color={status.color} className="tx-status">
      {transaction.txStatus == 'PENDING' ? (
        <div>
          <Loader size="xs" color="pending" />
        </div>
      ) : (
        shouldDisplayDot && <SmallDot color={status.color} />
      )}
      <p style={{ color: status.color }}>{status.text}</p>
    </CircularProgressPainter>
  )
}
