import { Button, Tooltip } from '@gnosis.pm/safe-react-components'
import { MultisigExecutionInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { currentSafeNonce } from 'src/logic/safe/store/selectors'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { useActionButtonsHandlers } from 'src/routes/safe/components/Transactions/TxList/hooks/useActionButtonsHandlers'
import useLocalTxStatus from 'src/logic/hooks/useLocalTxStatus'
import { isAwaitingExecution } from './utils'
import styled from 'styled-components'

type TxExpandedActionsProps = {
  transaction: Transaction
}

const StyledButtonConfirm = styled(Button)`
  background-color: transparent !important;
  border: 1px solid rgba(94, 230, 157, 1) !important;
  border-radius: 50px !important;
`
const StyledButtonReject = styled(Button)`
  background-color: transparent !important;
  border: 1px solid rgba(230, 94, 94, 1) !important;
  border-radius: 50px !important;
`
export const TxExpandedActions = ({ transaction }: TxExpandedActionsProps): ReactElement => {
  const {
    canCancel,
    handleConfirmButtonClick,
    handleCancelButtonClick,
    handleOnMouseEnter,
    handleOnMouseLeave,
    isPending,
    disabledActions,
  } = useActionButtonsHandlers(transaction)
  const nonce = useSelector(currentSafeNonce)
  const txStatus = useLocalTxStatus(transaction)
  const isAwaitingEx = isAwaitingExecution(txStatus)

  const onExecuteOrConfirm = (event) => {
    handleOnMouseLeave()
    handleConfirmButtonClick(event)
  }

  const getConfirmTooltipTitle = () => {
    if (isAwaitingEx) {
      // return (transaction.executionInfo as MultisigExecutionInfo)?.nonce === nonce
      //   ? 'Execute'
      //   : `Transaction with nonce ${nonce} needs to be executed first`
      return 'Execute'
    }
    return 'Confirm'
  }

  // There is a problem in chrome that produces onMouseLeave event not being triggered properly.
  // https://github.com/facebook/react/issues/4492
  return (
    <>
      <Tooltip title={getConfirmTooltipTitle()} placement="top">
        <span>
          <StyledButtonConfirm
            size="md"
            disabled={disabledActions}
            onClick={onExecuteOrConfirm}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
            className="primary"
          >
            {isAwaitingEx ? 'Execute' : 'Confirm'}
          </StyledButtonConfirm>
        </span>
      </Tooltip>
      {canCancel && (
        <StyledButtonReject size="md" onClick={handleCancelButtonClick} className="error" disabled={isPending}>
          Reject
        </StyledButtonReject>
      )}
    </>
  )
}
