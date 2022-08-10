import { MultisigExecutionInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { createBrowserHistory } from 'history'
import { useDispatch } from 'react-redux'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import Modal, { Modal as GenericModal } from 'src/components/Modal'
import { ButtonStatus } from 'src/components/Modal/type'
import { getInternalChainId, getShortName, _getChainId } from 'src/config'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { extractSafeAddress, generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { ParametersStatus } from 'src/routes/safe/components/Transactions/helpers/utils'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { rejectTransactionById } from 'src/services/index'
import { PUBLIC_URL } from 'src/utils/constants'
import { useStyles } from './style'
type Props = {
  isOpen: boolean
  onClose: () => void
  gwTransaction: Transaction
}

const history = createBrowserHistory({
  basename: PUBLIC_URL,
})

export const RejectTxModal = ({ isOpen, onClose, gwTransaction }: Props): React.ReactElement => {
  // const dispatch = useDispatch()
  const safeAddress = extractSafeAddress()
  const classes = useStyles()

  const dispatch = useDispatch()

  const {
    gasCostFormatted,
    txEstimationExecutionStatus,
    isExecution,
    isOffChainSignature,
    isCreation,
    gasLimit,
    gasPriceFormatted,
  } = useEstimateTransactionGas({
    txData: EMPTY_DATA,
    txRecipient: safeAddress,
  })

  const nonce = (gwTransaction.executionInfo as MultisigExecutionInfo)?.nonce ?? 0
  const internalId = getInternalChainId()
  const chainId = _getChainId()

  const sendReplacementTransaction = (txParameters: TxParameters) => {
    const data = {
      transactionId: nonce,
      internalChainId: internalId,
    }
    if (data) {
      rejectTransactionById(data).then((res) => {
        const { ErrorCode } = res
        dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.TX_REJECTED_MSG_SUCCESS)))

        if (ErrorCode === 'SUCCESSFUL') {
          history.push(
            generateSafeRoute(SAFE_ROUTES.TRANSACTIONS_QUEUE, {
              shortName: getShortName(),
              safeAddress,
            }),
          )

          dispatch(fetchTransactions(chainId, safeAddress, true))
          // setTimeout(() => {
          //   window.location.reload()
          // }, 500)
        } else {
          dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.TX_FAILED_MSG)))
        }
      })
    }
    onClose()
  }

  const getParametersStatus = (): ParametersStatus => {
    return 'CANCEL_TRANSACTION'
  }

  let confirmButtonStatus: ButtonStatus = ButtonStatus.READY
  let confirmButtonText = 'Reject transaction'
  if (txEstimationExecutionStatus === EstimationStatus.LOADING) {
    confirmButtonStatus = ButtonStatus.LOADING
    confirmButtonText = 'Estimating'
  }

  return (
    <Modal description="Reject transaction" handleClose={onClose} open={isOpen} title="Reject Transaction">
      <EditableTxParameters
        isOffChainSignature={isOffChainSignature}
        isExecution={isExecution}
        ethGasLimit={gasLimit}
        ethGasPrice={gasPriceFormatted}
        safeTxGas={'0'}
        safeNonce={nonce.toString()}
        parametersStatus={getParametersStatus()}
      >
        {(txParameters, toggleEditMode) => {
          return (
            <>
              <ModalHeader onClose={onClose} title="Reject transaction" />
              <Hairline />
              <Block className={classes.container}>
                <Row align="center" margin="md" data-testid="recipient-review-step">
                  <Col xs={12}></Col>
                </Row>
                <Row align="center" margin="smd">
                  <Col xs={12}>
                    <Paragraph>
                      You’re about to reject a transaction. This action cannot be undone. Please make sure before
                      proceeding.
                    </Paragraph>
                  </Col>
                </Row>
              </Block>

              <GenericModal.Footer withoutBorder={confirmButtonStatus !== ButtonStatus.LOADING}>
                <GenericModal.Footer.Buttons
                  cancelButtonProps={{ onClick: onClose, text: 'Close' }}
                  confirmButtonProps={{
                    onClick: () => sendReplacementTransaction(txParameters),
                    color: 'error',
                    type: 'submit',
                    status: confirmButtonStatus,
                    text: confirmButtonText,
                  }}
                />
              </GenericModal.Footer>
            </>
          )
        }}
      </EditableTxParameters>
    </Modal>
  )
}
