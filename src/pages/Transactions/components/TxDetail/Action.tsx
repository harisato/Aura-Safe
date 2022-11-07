import { ReactElement, useContext } from 'react'
import { useSelector } from 'react-redux'
import { OutlinedButton, OutlinedNeutralButton } from 'src/components/Button'

import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import styled from 'styled-components'
import { TxSignModalContext } from '../../Queue'

type TxActionsProps = {
  transaction: any
}

const StyledLabel = styled.span`
  color: #5ee6d0;
`
const RedStyledLabel = styled.span`
  color: #e65e5e; ;
`

export const TxActions = ({ transaction }: TxActionsProps): ReactElement => {
  const currentUser = useSelector(userAccountSelector)

  const { setOpen, setTxId, setAction } = useContext(TxSignModalContext)

  const isRejected = transaction.rejectors?.find((rejector) => rejector.value === currentUser)
  const isConfirmed = transaction.confirmations?.find((confirmation) => confirmation.signer.value === currentUser)
  if (
    typeof transaction?.confirmationsRequired == 'undefined' ||
    typeof transaction?.confirmations?.length == 'undefined'
  ) {
    return <></>
  }
  const confirmationNeeded = transaction?.confirmationsRequired - transaction?.confirmations?.length

  if (isRejected) {
    return <RedStyledLabel>You have rejected this transaction</RedStyledLabel>
  }
  if (confirmationNeeded <= 0) {
    return (
      <OutlinedButton
        size="md"
        onClick={() => {
          setTxId(transaction.txId)
          setAction('execute')
          setOpen(true)
        }}
      >
        Execute
      </OutlinedButton>
    )
  }
  if (isConfirmed) {
    return <StyledLabel>You have confirmed this transaction</StyledLabel>
  } else {
    return (
      <>
        <OutlinedNeutralButton
          size="md"
          onClick={() => {
            setTxId(transaction.txId)
            setAction('reject')
            setOpen(true)
          }}
        >
          Reject
        </OutlinedNeutralButton>
        <OutlinedButton
          style={{ marginLeft: 16 }}
          size="md"
          onClick={() => {
            setTxId(transaction.txId)
            setAction('confirm')
            setOpen(true)
          }}
        >
          Confirm
        </OutlinedButton>
      </>
    )
  }
}
