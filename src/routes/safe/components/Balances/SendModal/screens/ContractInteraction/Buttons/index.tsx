import { useField, useFormState } from 'react-final-form'
import { Modal } from 'src/components/Modal'
import { ButtonStatus } from 'src/components/Modal/type'
import { isReadMethod } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'

interface ButtonProps {
  onClose: () => void
  requiresMethod?: boolean
}

const Buttons = ({ onClose, requiresMethod }: ButtonProps): React.ReactElement => {
  const {
    input: { value: method },
  } = useField('selectedMethod', { subscription: { value: true } })
  const { modifiedSinceLastSubmit, submitError, submitting, valid, validating } = useFormState({
    subscription: {
      modifiedSinceLastSubmit: true,
      submitError: true,
      submitting: true,
      valid: true,
      validating: true,
    },
  })

  return (
    <Modal.Footer>
      <Modal.Footer.Buttons
        cancelButtonProps={{ onClick: onClose }}
        confirmButtonProps={{
          disabled:
            submitting ||
            validating ||
            ((!valid || !!submitError) && !modifiedSinceLastSubmit) ||
            (requiresMethod && !method),
          status: submitting || validating ? ButtonStatus.LOADING : ButtonStatus.READY,
          testId: `${isReadMethod(method) ? 'call' : 'review'}-tx-btn`,
          text: isReadMethod(method) ? 'Call' : 'Review',
        }}
      />
    </Modal.Footer>
  )
}

export default Buttons
