import { makeStyles } from '@material-ui/core/styles'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Divider from 'src/components/Divider'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { Modal } from 'src/components/Modal'
import { ButtonStatus } from 'src/components/Modal/type'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { ReviewInfoText } from 'src/components/ReviewInfoText'
import { getChainInfo, getExplorerInfo, getInternalChainId } from 'src/config'
import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { SpendingLimit } from 'src/logic/safe/store/models/safe'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'
import { sameString } from 'src/utils/strings'

import { toBase64 } from '@cosmjs/encoding'
import { calculateFee, coins, MsgSendEncodeObject, SignerData, SigningStargateClient } from '@cosmjs/stargate'
import { generatePath } from 'react-router-dom'
import ButtonLink from 'src/components/layout/ButtonLink'
import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { loadLastUsedProvider } from 'src/logic/wallets/store/middlewares/providerWatcher'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import {
  extractSafeAddress,
  extractShortChainName,
  getPrefixedSafeAddressSlug,
  history,
  SAFE_ADDRESS_SLUG,
  SAFE_ROUTES,
} from 'src/routes/routes'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { useTransactionFees } from 'src/routes/safe/container/hooks/useTransactionFee'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { createSafeTransaction, getMChainsConfig } from 'src/services'
import { DEFAULT_GAS, DEFAULT_GAS_LIMIT } from 'src/services/constant/common'
import { ICreateSafeTransaction } from 'src/types/transaction'
import { ModalHeader } from '../ModalHeader'
import { styles } from './style'

const useStyles = makeStyles(styles)

export type ReviewTxProp = {
  recipientAddress: string
  recipientName?: string
  amount: string
  txRecipient: string
  token: string
  txType?: string
  tokenSpendingLimit?: SpendingLimit
}

type ReviewTxProps = {
  onClose: () => void
  onPrev: () => void
  tx: ReviewTxProp
}

const ReviewSendFundsTx = ({ onClose, onPrev, tx }: ReviewTxProps): React.ReactElement => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const safeAddress = extractSafeAddress()
  const tokens: any = useSelector(extendedSafeTokensSelector)
  const txToken = useMemo(() => tokens.find((token) => sameAddress(token.address, tx.token)), [tokens, tx.token])
  // const txRecipient = isSendingNativeToken ? tx.recipientAddress : txToken?.address || ''
  const txRecipient = tx.recipientAddress || ''
  const [manualSafeTxGas, setManualSafeTxGas] = useState<string | undefined>(DEFAULT_GAS)
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>(DEFAULT_GAS)
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>()
  const [isDisabled, setDisabled] = useState(false)
  const [gasPriceFormatted, setGasPriceFormatted] = useState('1')
  const chainInfo = getChainInfo()

  let lastUsedProvider = ''

  loadLastUsedProvider().then((result) => {
    lastUsedProvider = result || ''
    if (result?.toLowerCase() !== 'keplr') setGasPriceFormatted('15000')
  })

  const { gasCostFormatted, txEstimationExecutionStatus, isExecution, isOffChainSignature } = {
    gasCostFormatted: '',
    txEstimationExecutionStatus: EstimationStatus.SUCCESS,
    isExecution: false,
    isOffChainSignature: true,
  }

  const {
    sendFee,
    gasPrice,
    gasEstimation,
    signerData,
    gasPriceFormatted: priceFormatted,
    txEstimationStatus,
  } = useTransactionFees(chainInfo, tx, safeAddress, manualGasPrice, manualGasLimit)

  const [buttonStatus, setButtonStatus] = useEstimationStatus(txEstimationStatus)

  const isSpendingLimit = sameString(tx.txType, 'spendingLimit')
  // const [executionApproved, setExecutionApproved] = useState<boolean>(true)
  const doExecute = isExecution // && executionApproved
  const userWalletAddress = useSelector(userAccountSelector)
  const [openGas, setOpenGas] = useState<boolean>(false)

  const submitTx = async (txParameters: TxParameters) => {
    setDisabled(true)
    if (lastUsedProvider?.toLowerCase() === 'keplr') {
      signTransactionWithKeplr(safeAddress)
    }
  }

  const signTransactionWithKeplr = async (safeAddress: string) => {
    const chainId = chainInfo.chainId
    const listChain = await getMChainsConfig()
    const denom = listChain.find((x) => x.chainId === chainId)?.denom || ''
    if (window.keplr) {
      await window.keplr.enable(chainId)
      window.keplr.defaultOptions = {
        sign: {
          preferNoSetMemo: true,
          preferNoSetFee: true,
          disableBalanceCheck: true,
        },
      }
    }

    if (window.getOfflineSignerOnlyAmino) {
      const offlineSigner = window.getOfflineSignerOnlyAmino(chainId)
      const accounts = await offlineSigner.getAccounts()
      // const tendermintUrl = chainInfo?.rpcUri?.value
      const client = await SigningStargateClient.offline(offlineSigner)
      const amountFinal =
        chainInfo.shortName === 'evmos'
          ? Math.floor(Number(tx?.amount) * Math.pow(10, 18)).toString() || ''
          : Math.floor(Number(tx?.amount) * Math.pow(10, 6)).toString() || ''
      // const signingInstruction = await (async () => {
      //   // get account on chain from API
      //   const {
      //     ErrorCode,
      //     Data: accountOnChainResult,
      //     Message,
      //   } = await getAccountOnChain(safeAddress, getInternalChainId())
      //   // const accountOnChain = await client.getAccount(safeAddress)

      //   return {
      //     accountNumber: accountOnChainResult?.accountNumber,
      //     sequence: accountOnChainResult?.sequence,
      //     memo: '',
      //   }
      // })()

      const msgSend: any = {
        fromAddress: safeAddress,
        toAddress: txRecipient,
        amount: coins(amountFinal, denom),
      }

      const msg: MsgSendEncodeObject = {
        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
        value: msgSend,
      }

      // calculate fee
      // const gasPrice = GasPrice.fromString(String(manualGasPrice || gasPriceFormatted).concat(denom))
      // // const sendFee = calculateFee(Number(manualGasLimit) || Number(gasLimit), gasPrice)
      // const sendFee = {
      //   amount: coins(manualGasPrice || gasPriceFormatted, denom),
      //   gas: manualGasLimit || gasLimit,
      // }

      // const onlineClient = await SigningCosmWasmClient.connectWithSigner('https://rpc.dev.aura.network/', offlineSigner)
      // const gasEstimation = await onlineClient.simulate(accounts[0].address, [msg], signingInstruction.memo)
      // const multiplier = 1.3
      // const defaultGasPrice = '0.0002uaura'
      // const gasPrice = GasPrice.fromString(defaultGasPrice)
      // const gasPrice = GasPrice.fromString(String(manualGasPrice || gasPriceFormatted).concat(denom))
      // const sendFee = calculateFee(Math.round(gasEstimation * multiplier), gasPrice)

      // const signerData: SignerData = {
      //   accountNumber: signingInstruction.accountNumber || 0,
      //   sequence: signingInstruction.sequence || 0,
      //   chainId: chainId,
      // }

      try {
        // Sign On Wallet
        dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.SIGN_TX_MSG)))

        if (!gasPrice || !gasEstimation) {
          return
        }

        const signResult = await client.sign(
          accounts[0]?.address,
          [msg],
          sendFee || calculateFee(gasEstimation, gasPrice),
          '',
          signerData,
        )

        const signatures = toBase64(signResult.signatures[0])
        const bodyBytes = toBase64(signResult.bodyBytes)
        const authInfoBytes = toBase64(signResult.authInfoBytes)

        // call api to create transaction
        const data: ICreateSafeTransaction = {
          from: safeAddress,
          to: txRecipient,
          amount: amountFinal,
          internalChainId: getInternalChainId(),
          creatorAddress: userWalletAddress,
          signature: signatures,
          bodyBytes: bodyBytes,
          authInfoBytes: authInfoBytes,
        }

        createTxFromApi(data)
      } catch (error) {
        dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.TX_REJECTED_MSG)))
        onClose()
      }
    }
  }

  const createTxFromApi = async (data: any) => {
    const { ErrorCode, Data: safeData } = await createSafeTransaction(data)
    if (ErrorCode === 'SUCCESSFUL') {
      setButtonStatus(ButtonStatus.READY)
      onClose()

      // navigate to tx details
      const prefixedSafeAddress = getPrefixedSafeAddressSlug({ shortName: extractShortChainName(), safeAddress })
      const txRoute = generatePath(SAFE_ROUTES.TRANSACTIONS_SINGULAR, {
        [SAFE_ADDRESS_SLUG]: prefixedSafeAddress,
        id: safeData,
      })
      history.push(txRoute)
    } else {
      if (ErrorCode === 'E028') {
        dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CREATE_SAFE_PENDING_EXECUTE_MSG)))
      } else {
        dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.TX_FAILED_MSG)))
      }

      onClose()
    }
  }

  const closeEditModalCallback = (txParameters: TxParameters) => {
    // const oldGasPrice = gasPriceFormatted
    // const newGasPrice = txParameters.ethGasPrice
    // const oldSafeTxGas = gasEstimation?.toString()
    // const newSafeTxGas = txParameters.safeTxGas
    // if (newGasPrice && oldGasPrice !== newGasPrice) {
    //   setManualGasPrice(txParameters.ethGasPrice)
    // }
    // if (txParameters.ethGasLimit && _gasLimit !== txParameters.ethGasLimit) {
    //   setManualGasLimit(txParameters.ethGasLimit)
    // }
    // if (newSafeTxGas && oldSafeTxGas !== newSafeTxGas) {
    //   setManualSafeTxGas(newSafeTxGas)
    // }
  }

  const ShowGasFrom = () => {
    setOpenGas(!openGas)
  }

  const recalculateFee = () => {
    setManualGasPrice(manualSafeTxGas)

    setOpenGas(!openGas)
  }

  const handleManualSafeTxGasChange = (e) => {
    // setManualSafeTxGas(e.target.value)
    setManualGasLimit(e.target.value)
  }

  return (
    <EditableTxParameters
      isOffChainSignature={isOffChainSignature}
      isExecution={doExecute}
      ethGasLimit={sendFee?.gas || '100000'}
      ethGasPrice={priceFormatted}
      safeTxGas={gasEstimation?.toString()}
      closeEditModalCallback={closeEditModalCallback}
    >
      {(txParameters, _) => (
        <>
          {/* Header */}
          <ModalHeader onClose={onClose} subTitle="Step 2 of 2" title="Send funds" />

          <Hairline />

          <Block className={classes.container}>
            {/* SafeInfo */}
            <SafeInfo />
            <Divider withArrow />

            {/* Recipient */}
            <Row margin="xs">
              <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                Recipient
              </Paragraph>
            </Row>
            <Row align="center" margin="md" data-testid="recipient-review-step">
              <Col xs={12}>
                <PrefixedEthHashInfo
                  hash={tx.recipientAddress}
                  name={tx.recipientName}
                  showCopyBtn
                  showAvatar
                  explorerUrl={getExplorerInfo(tx.recipientAddress)}
                />
              </Col>
            </Row>

            <Row margin="xs">
              <Paragraph color="white" noMargin size="xl" style={{ letterSpacing: '-0.5px' }}>
                Transaction fee
              </Paragraph>
            </Row>
            <Row align="center" margin="md">
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex' }}>
                  <Img
                    alt={txToken?.name as string}
                    height={28}
                    onError={setImageToPlaceholder}
                    src={txToken?.logoUri}
                  />
                  <Paragraph
                    className={classes.amount}
                    noMargin
                    size="md"
                    data-testid={`amount-${txToken?.symbol as string}-review-step`}
                  >
                    {/* {manualSafeTxGas} {txToken?.symbol} */}
                    {gasEstimation}
                  </Paragraph>
                </div>
                <div style={{ alignSelf: 'center' }}>
                  <ButtonLink onClick={ShowGasFrom} weight="bold" testId="send-max-btn">
                    Edit gas
                  </ButtonLink>
                </div>
              </div>
            </Row>
            {openGas && (
              <Row margin="md" xs={12}>
                <Col xs={9}>
                  <input
                    className={classes.gasInput}
                    placeholder="Gas Amount"
                    value={manualGasLimit}
                    onChange={handleManualSafeTxGasChange}
                  />
                </Col>
                <Col center="xs" middle="xs" xs={3}>
                  <div className={classes.gasButton} onClick={recalculateFee}>
                    Apply
                  </div>
                </Col>
              </Row>
            )}
            {/* <Row margin="xs">
              <Paragraph color="white" noMargin size="xl" style={{ letterSpacing: '-0.5px' }}>
                Total Allocation Amount
              </Paragraph>
            </Row>

            <Row align="center" margin="md">
              <Img alt={txToken?.name as string} height={28} onError={setImageToPlaceholder} src={txToken?.logoUri} />
              <Paragraph
                className={classes.amount}
                noMargin
                size="md"
                data-testid={`amount-${txToken?.symbol as string}-review-step`}
              >
                {tx.amount} {txToken?.symbol}
              </Paragraph>
            </Row> */}
          </Block>

          {/* Disclaimer */}
          {/* FIXME Estimation should be fixed to be used with spending limits */}
          {!isSpendingLimit && txEstimationExecutionStatus !== EstimationStatus.LOADING && (
            <ReviewInfoText
              gasCostFormatted={gasCostFormatted}
              isCreation={true}
              isExecution={true}
              isOffChainSignature={true}
              safeNonce={txParameters.safeNonce}
              txEstimationExecutionStatus={txEstimationExecutionStatus}
            />
          )}

          {/* Footer */}
          <Modal.Footer withoutBorder={!isSpendingLimit && buttonStatus !== ButtonStatus.LOADING}>
            <Modal.Footer.Buttons
              cancelButtonProps={{ onClick: onPrev, text: 'Back' }}
              confirmButtonProps={{
                onClick: () => submitTx(txParameters),
                status: buttonStatus,
                text: txEstimationExecutionStatus === EstimationStatus.LOADING ? 'Estimating' : undefined,
                testId: 'submit-tx-btn',
                disabled: isDisabled,
              }}
            />
          </Modal.Footer>
        </>
      )}
    </EditableTxParameters>
  )
}

export default ReviewSendFundsTx
