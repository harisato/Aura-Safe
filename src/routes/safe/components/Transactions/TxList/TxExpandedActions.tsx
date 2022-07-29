import { Button, Tooltip } from '@aura/safe-react-components'
import { ReactElement } from 'react'

import useLocalTxStatus from 'src/logic/hooks/useLocalTxStatus'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { useActionButtonsHandlers } from 'src/routes/safe/components/Transactions/TxList/hooks/useActionButtonsHandlers'
import styled from 'styled-components'
import { isAwaitingExecution } from './utils'

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

const StyledLabel = styled.span`
  color: rgba(94, 230, 157, 1);
`

export const TxExpandedActions = ({ transaction }: TxExpandedActionsProps): ReactElement => {
  const {
    canCancel,
    handleConfirmButtonClick,
    handleCancelButtonClick,
    handleOnMouseEnter,
    handleOnMouseLeave,
    isPending,
    isRejected,
    disabledActions,
    isOwner,
  } = useActionButtonsHandlers(transaction)

  // const nonce = useSelector(currentSafeNonce)
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

  if (!isOwner) {
    return <></>
  }

  // There is a problem in chrome that produces onMouseLeave event not being triggered properly.
  // https://github.com/facebook/react/issues/4492
  return (
    <>
      {(disabledActions || isRejected) && !isAwaitingEx ? (
        isRejected ? (
          <StyledLabel>You have rejected this transaction</StyledLabel>
        ) : (
          <StyledLabel>You have confirmed this transaction</StyledLabel>
        )
      ) : (
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
          {!isAwaitingEx && canCancel && (
            <StyledButtonReject size="md" onClick={handleCancelButtonClick} className="error" disabled={isPending}>
              Reject
            </StyledButtonReject>
          )}
        </>
      )}
    </>
  )
}
