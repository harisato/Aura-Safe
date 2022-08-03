import { Icon } from '@aura/safe-react-components'
import { default as MuiIconButton } from '@material-ui/core/IconButton'
import { ReactElement } from 'react'
import styled from 'styled-components'

import useLocalTxStatus from 'src/logic/hooks/useLocalTxStatus'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { useActionButtonsHandlers } from './hooks/useActionButtonsHandlers'
import { isAwaitingExecution } from './utils'

const IconButton = styled(MuiIconButton)`
  padding: 8px !important;

  &.Mui-disabled {
    opacity: 0.4;
  }
`

type TxCollapsedActionsProps = {
  transaction: Transaction
}

export const TxCollapsedActions = ({ transaction }: TxCollapsedActionsProps): ReactElement => {
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

  // const getTitle = () => {
  //   if (isAwaitingEx) {
  //     return (transaction.executionInfo as MultisigExecutionInfo)?.nonce === nonce ? 'Execute' : ''
  //   }
  //   return 'Confirm'
  // }

  if (!isOwner) {
    return <></>
  }

  return (
    <>
      {((!disabledActions && !isRejected) || isAwaitingEx) && (
        <>
          {/* <Tooltip title={getTitle()} placement="top"> */}
          <span>
            <IconButton
              size="small"
              type="button"
              onClick={handleConfirmButtonClick}
              disabled={disabledActions}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            >
              <Icon type={isAwaitingEx ? 'rocket' : 'check'} color="primary" size="sm" />
            </IconButton>
          </span>
          {/* </Tooltip> */}
          {!isAwaitingEx && canCancel && (
            // <Tooltip title="Reject" placement="top">
            <span>
              <IconButton size="small" type="button" onClick={handleCancelButtonClick} disabled={isPending}>
                <Icon type="circleCross" color="error" size="sm" />
              </IconButton>
            </span>
            // </Tooltip>
          )}
        </>
      )}
    </>
  )
}
