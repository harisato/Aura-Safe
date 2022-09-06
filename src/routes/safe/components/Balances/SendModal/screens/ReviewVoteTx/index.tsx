import { makeStyles } from '@material-ui/core/styles'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { Modal } from 'src/components/Modal'
import { ButtonStatus } from 'src/components/Modal/type'
import {
  getChainDefaultGas,
  getChainDefaultGasPrice,
  getChainInfo,
  getCoinDecimal,
  getInternalChainId,
} from 'src/config'
import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'

import { toBase64 } from '@cosmjs/encoding'
import { calculateFee, coins, GasPrice, MsgSendEncodeObject, SignerData, SigningStargateClient } from '@cosmjs/stargate'
import { generatePath } from 'react-router-dom'
import ButtonLink from 'src/components/layout/ButtonLink'
import { enhanceSnackbarForAction, ERROR, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
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
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { createSafeTransaction, getAccountOnChain, getMChainsConfig } from 'src/services'
import { DEFAULT_GAS_LIMIT } from 'src/services/constant/common'
import { MESSAGES_CODE } from 'src/services/constant/message'
import { ICreateSafeTransaction } from 'src/types/transaction'
import { ModalHeader } from '../ModalHeader'
import { styles } from './style'

const useStyles = makeStyles(styles)

export type ReviewTxProp = {
  amount: string
  token: string
  txType?: string
}
export type VotingTx = {
  amount: string
  token: string
  txType?: string
}

type ReviewVotingTxProps = {
  onClose: () => void
  onPrev: () => void
  votingTx?: VotingTx
}

const ReviewVoteTx = ({ onClose, onPrev, votingTx }: ReviewVotingTxProps): React.ReactElement => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const safeAddress = extractSafeAddress()
  // const tokens: any = useSelector(extendedSafeTokensSelector)
  // const txToken = useMemo(() => tokens.find((token) => sameAddress(token.address, tx.token)), [tokens, tx.token])

  const chainDefaultGas = getChainDefaultGas()
  const chainDefaultGasPrice = getChainDefaultGasPrice()
  const decimal = getCoinDecimal()

  const defaultGas = chainDefaultGas.find((chain) => chain.typeUrl === '/cosmos.bank.v1beta1.MsgSend')?.gasAmount

  const gasFee =
    defaultGas && chainDefaultGasPrice
      ? calculateGasFee(+defaultGas, +chainDefaultGasPrice, decimal)
      : chainDefaultGasPrice

  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>(defaultGas)
  const [isDisabled, setDisabled] = useState(false)
  const [gasPriceFormatted, setGasPriceFormatted] = useState(gasFee)
  const chainInfo = getChainInfo()

  const { txEstimationExecutionStatus, isExecution, isOffChainSignature } = {
    txEstimationExecutionStatus: EstimationStatus.SUCCESS,
    isExecution: false,
    isOffChainSignature: true,
  }

  const [buttonStatus, setButtonStatus] = useEstimationStatus()

  const userWalletAddress = useSelector(userAccountSelector)
  const [openGas, setOpenGas] = useState<boolean>(false)

  const submitTx = async (txParameters: TxParameters) => {
    setDisabled(true)
    signTransactionWithKeplr(safeAddress)
  }

  const signTransactionWithKeplr = async (safeAddress: string) => {
    const chainId = chainInfo.chainId

    const listChain = await getMChainsConfig()

    const mChainInfo = listChain.find((x) => x.chainId === chainId)
    const denom = mChainInfo?.denom || ''

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

      const client = await SigningStargateClient.offline(offlineSigner)

      const amountFinal = ''

      const signingInstruction = await (async () => {
        // get account on chain from API
        const { Data: accountOnChainResult } = await getAccountOnChain(safeAddress, getInternalChainId())

        return {
          accountNumber: accountOnChainResult?.accountNumber,
          sequence: accountOnChainResult?.sequence,
          memo: '',
        }
      })()

      const msgSend: any = {
        fromAddress: safeAddress,
        amount: coins(amountFinal, denom),
      }

      const msg: MsgSendEncodeObject = {
        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
        value: msgSend,
      }

      const gasPrice = GasPrice.fromString(String(chainDefaultGasPrice || gasPriceFormatted).concat(denom))

      const sendFee = calculateFee(Number(manualGasLimit || defaultGas || DEFAULT_GAS_LIMIT), gasPrice)

      const signerData: SignerData = {
        accountNumber: signingInstruction.accountNumber || 0,
        sequence: signingInstruction.sequence || 0,
        chainId: chainId,
      }

      try {
        // Sign On Wallet
        dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.SIGN_TX_MSG)))

        const signResult = await client.sign(accounts[0]?.address, [msg], sendFee, '', signerData)

        const signatures = toBase64(signResult.signatures[0])
        const bodyBytes = toBase64(signResult.bodyBytes)
        const authInfoBytes = toBase64(signResult.authInfoBytes)

        // call api to create transaction
        const data: ICreateSafeTransaction = {
          from: safeAddress,
          to: '',
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
    createSafeTransaction(data)
      .then((e) => {
        const { ErrorCode } = e
        if (ErrorCode === MESSAGES_CODE.SUCCESSFUL.ErrorCode) {
          setButtonStatus(ButtonStatus.READY)

          const chainId = chainInfo.chainId
          dispatch(fetchTransactions(chainId, safeAddress))

          // navigate to tx details
          const prefixedSafeAddress = getPrefixedSafeAddressSlug({ shortName: extractShortChainName(), safeAddress })
          const txRoute = generatePath(SAFE_ROUTES.TRANSACTIONS_QUEUE, {
            [SAFE_ADDRESS_SLUG]: prefixedSafeAddress,
          })
          history.push(txRoute)
        } else {
          switch (ErrorCode) {
            case MESSAGES_CODE.E029.ErrorCode:
              dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CREATE_SAFE_PENDING_EXECUTE_MSG)))
              break
            default:
              dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.TX_FAILED_MSG)))
              break
          }
        }

        onClose()
      })
      .catch((err) => {
        onClose()
        dispatch(
          enqueueSnackbar(
            enhanceSnackbarForAction({
              message: err.message,
              options: { variant: ERROR, persist: false, preventDuplicate: true, autoHideDuration: 5000 },
            }),
          ),
        )
      })
  }

  const ShowGasFrom = () => {
    setOpenGas(!openGas)
  }

  const recalculateFee = () => {
    const gasFee =
      manualGasLimit && chainDefaultGasPrice
        ? calculateGasFee(+manualGasLimit, +chainDefaultGasPrice, decimal)
        : chainDefaultGasPrice
    setGasPriceFormatted(gasFee)
    setOpenGas(!openGas)
  }

  const handleManualSafeTxGasChange = (e) => {
    setManualGasLimit(e.target.value)
  }

  return (
    <EditableTxParameters
      isOffChainSignature={isOffChainSignature}
      isExecution={isExecution}
      ethGasLimit={defaultGas || '100000'}
      ethGasPrice={chainDefaultGasPrice.toString()}
      safeTxGas={defaultGas}
    >
      {(txParameters, _) => (
        <>
          {/* Header */}
          <ModalHeader onClose={onClose} title="Vote" />

          <Hairline />

          <Block className={classes.container}>
            {/* SafeInfo */}
            {/* <SafeInfo /> */}
            {/* <Divider withArrow /> */}
            <Col margin="lg">
              <Paragraph color="white" size="lg" weight="bold">
                Proposal #23 Lorem Ipsum
              </Paragraph>
              <Row className={classes.flexBetween}>
                <Paragraph color="textaura" noMargin size="md" weight="regular">
                  Vote value
                </Paragraph>
                <Paragraph color="textaura" noMargin size="md" weight="regular">
                  Yes
                </Paragraph>
              </Row>

              <Row className={classes.flexBetween}>
                <Paragraph color="textaura" noMargin size="md" weight="regular">
                  Execute before
                </Paragraph>
                <Paragraph color="textaura" noMargin size="md" weight="regular">
                  30/08/2022
                </Paragraph>
              </Row>
            </Col>

            <Row margin="xs">
              <Paragraph color="white" noMargin size="lg" weight="bold" style={{ letterSpacing: '-0.5px' }}>
                Transaction fee
              </Paragraph>
            </Row>

            <Row align="center" margin="md">
              <div className={classes.flexBetween}>
                <div style={{ display: 'flex' }}>
                  {/* <Img
                    alt={txToken?.name as string}
                    height={28}
                    onError={setImageToPlaceholder}
                    src={txToken?.logoUri}
                  /> */}
                  <Paragraph className={classes.amount} noMargin size="md">
                    {gasPriceFormatted}
                    {/* {manualGasLimit || defaultGas} */}
                  </Paragraph>
                </div>
                <div style={{ alignSelf: 'center' }}>
                  <ButtonLink onClick={ShowGasFrom} weight="regular" color="green" testId="send-max-btn">
                    Edit gas
                  </ButtonLink>
                </div>
              </div>
            </Row>
            {openGas && (
              <Row margin="md" xs={12}>
                <Col xs={9}>
                  <div className={classes.gasInput}>
                    <div className={classes.titleGasInput}>Gas Amount</div>
                    <input value={manualGasLimit} onChange={handleManualSafeTxGasChange} className={classes.inputGas} />
                  </div>
                </Col>
                <Col center="xs" middle="xs" xs={3}>
                  <div className={classes.gasButton} onClick={recalculateFee}>
                    Apply
                  </div>
                </Col>
              </Row>
            )}
          </Block>

          {/* Footer */}
          <Modal.Footer withoutBorder={buttonStatus !== ButtonStatus.LOADING} justifyContent="flex-end">
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

function calculateGasFee(gas: number, gasPrice: number, decimal: number): number {
  return (+gas * +gasPrice) / Math.pow(10, decimal)
}

export default ReviewVoteTx
