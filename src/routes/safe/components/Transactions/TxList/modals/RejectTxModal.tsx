import { MultisigExecutionInfo } from '@gnosis.pm/safe-react-gateway-sdk'

import { useDispatch } from 'react-redux'
import { useStyles } from './style'
import Modal, { Modal as GenericModal } from 'src/components/Modal'
import { ButtonStatus } from 'src/components/Modal/type'
import Block from 'src/components/layout/Block'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { ParametersStatus } from 'src/routes/safe/components/Transactions/helpers/utils'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { extractSafeAddress } from 'src/routes/routes'
import Col from 'src/components/layout/Col'
import { rejectTransactionById } from 'src/services/index'
import { getInternalChainId } from 'src/config'
type Props = {
  isOpen: boolean
  onClose: () => void
  gwTransaction: Transaction
}

export const RejectTxModal = ({ isOpen, onClose, gwTransaction }: Props): React.ReactElement => {
  const dispatch = useDispatch()
  const safeAddress = extractSafeAddress()
  const classes = useStyles()

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
  const origin = gwTransaction.safeAppInfo
    ? JSON.stringify({ name: gwTransaction.safeAppInfo.name, url: gwTransaction.safeAppInfo.url })
    : ''

  const nonce = (gwTransaction.executionInfo as MultisigExecutionInfo)?.nonce ?? 0
  const internalId = getInternalChainId()
  const sendReplacementTransaction = (txParameters: TxParameters) => {
    const data = {
      transactionId: nonce,
      internalChainId: internalId,
    }
    if (data) {
      rejectTransactionById(data).then((res) => {
        console.log('res', res)
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
                {/* <SafeInfo />
                <Divider withArrow /> */}

                {/* <Row margin="xs">
                  <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                    Recipient
                  </Paragraph>
                </Row> */}
                <Row align="center" margin="md" data-testid="recipient-review-step">
                  <Col xs={12}>
                    {/* <PrefixedEthHashInfo
                      hash={tx.recipientAddress}
                      name={tx.recipientName}
                      showCopyBtn
                      showAvatar
                      explorerUrl={getExplorerInfo(tx.recipientAddress)}
                    /> */}
                  </Col>
                </Row>
                <Row>
                  <Paragraph>
                    This action will reject this transaction. A separate transaction will be performed to submit the
                    rejection.
                  </Paragraph>
                  {/* <Paragraph color="medium" size="sm">
                    Transaction nonce:
                    <br />
                    <Bold className={classes.nonceNumber}>{nonce}</Bold>
                  </Paragraph> */}
                </Row>
                {/* Tx Parameters */}
                {/* <TxParametersDetail
                  txParameters={txParameters}
                  onEdit={toggleEditMode}
                  parametersStatus={getParametersStatus()}
                  isTransactionCreation={isCreation}
                  isTransactionExecution={isExecution}
                  isOffChainSignature={isOffChainSignature}
                /> */}
              </Block>

              {/* {txEstimationExecutionStatus === EstimationStatus.LOADING ? null : (
                <ReviewInfoText
                  gasCostFormatted={gasCostFormatted}
                  isCreation={isCreation}
                  isExecution={isExecution}
                  isOffChainSignature={isOffChainSignature}
                  safeNonce={txParameters.safeNonce}
                  txEstimationExecutionStatus={txEstimationExecutionStatus}
                />
              )} */}
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
