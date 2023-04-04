import { toBase64 } from '@cosmjs/encoding'
import { calculateFee, GasPrice, MsgVoteEncodeObject } from '@cosmjs/stargate'
import { makeStyles } from '@material-ui/core/styles'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generatePath } from 'react-router-dom'

import Block from 'src/components/layout/Block'
import ButtonLink from 'src/components/layout/ButtonLink'
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
  getNativeCurrencyLogoUri,
} from 'src/config'
import { getChains } from 'src/config/cache/chains'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { enhanceSnackbarForAction, ERROR, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { createMessage } from 'src/logic/providers/signing'
import calculateGasFee from 'src/logic/providers/utils/fee'
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
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { createSafeTransaction, MChainInfo } from 'src/services'
import { DEFAULT_GAS_LIMIT } from 'src/services/constant/common'
import { MESSAGES_CODE } from 'src/services/constant/message'
import { ICreateSafeTransaction } from 'src/types/transaction'
import { ModalHeader } from '../ModalHeader'
import { styles } from './style'

const useStyles = makeStyles(styles)

export type VotingTx = {
  option: number
  proposalId: number
}

type ReviewVotingTxProps = {
  onClose: () => void
  votingTx?: VotingTx
}

const ReviewVoteTx = ({ onClose, votingTx }: ReviewVotingTxProps): React.ReactElement => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const safeAddress = extractSafeAddress()

  const nativeCurrencyLogoUri = getNativeCurrencyLogoUri()

  const chainDefaultGas = getChainDefaultGas()
  const chainDefaultGasPrice = getChainDefaultGasPrice()
  const decimal = getCoinDecimal()

  const defaultGas = chainDefaultGas.find((chain) => chain.typeUrl === MsgTypeUrl.Vote)?.gasAmount

  const gasFee =
    defaultGas && chainDefaultGasPrice
      ? calculateGasFee(+defaultGas, +chainDefaultGasPrice, decimal)
      : chainDefaultGasPrice

  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>(defaultGas)
  const [isDisabled, setDisabled] = useState(false)
  const [gasPriceFormatted, setGasPriceFormatted] = useState(gasFee)
  const chainInfo = getChainInfo()

  const [buttonStatus, setButtonStatus] = useEstimationStatus()

  const userWalletAddress = useSelector(userAccountSelector)
  const [openGas, setOpenGas] = useState<boolean>(false)

  const submitTx = async () => {
    setDisabled(true)
    signTransaction(safeAddress)
  }

  const signTransaction = async (safeAddress: string) => {
    const chainId = chainInfo.chainId
    const listChain = getChains()

    const mChainInfo = listChain.find((x) => x.chainId === chainId) as MChainInfo
    const denom = mChainInfo?.denom || ''

    const _gasPrice = GasPrice.fromString(String(chainDefaultGasPrice || gasPriceFormatted).concat(denom))

    const _sendFee = calculateFee(Number(manualGasLimit || defaultGas || DEFAULT_GAS_LIMIT), _gasPrice)

    if (!(votingTx && safeAddress)) {
      dispatch(
        enqueueSnackbar(
          enhanceSnackbarForAction({
            message: 'Missing voting transaction or safe address',
            options: { variant: 'error', persist: false, autoHideDuration: 5000, preventDuplicate: true },
          }),
        ),
      )
      return
    }

    const voteData: MsgVoteEncodeObject['value'] = {
      option: votingTx?.option,
      proposalId: votingTx?.proposalId as any,
      voter: safeAddress,
    }

    createMessage(chainId, safeAddress, MsgTypeUrl.Vote, voteData, _sendFee)
      .then((signResult) => {
        if (!signResult) return

        const signatures = toBase64(signResult.signatures[0])
        const bodyBytes = toBase64(signResult.bodyBytes)
        const authInfoBytes = toBase64(signResult.authInfoBytes)

        const data: ICreateSafeTransaction = {
          internalChainId: getInternalChainId(),
          creatorAddress: userWalletAddress,
          signature: signatures,
          bodyBytes: bodyBytes,
          authInfoBytes: authInfoBytes,
          accountNumber: signResult.accountNumber,
          sequence: signResult.sequence,
        }

        createTxFromApi(data)
      })
      .catch((error) => {
        console.log('error', error)

        dispatch(
          enqueueSnackbar(
            enhanceSnackbarForAction(
              error?.message
                ? {
                    message: error?.message,
                    options: { variant: 'error', persist: false, autoHideDuration: 5000, preventDuplicate: true },
                  }
                : NOTIFICATIONS.TX_REJECTED_MSG,
            ),
          ),
        )
        onClose()
      })
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
              dispatch(
                enqueueSnackbar(
                  enhanceSnackbarForAction(
                    e?.Message
                      ? {
                          message: e?.Message,
                          options: { variant: 'error', persist: false, autoHideDuration: 5000, preventDuplicate: true },
                        }
                      : NOTIFICATIONS.TX_FAILED_MSG,
                  ),
                ),
              )
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
              <Img
                alt={'nativeCurrencyLogoUri'}
                height={28}
                onError={setImageToPlaceholder}
                src={nativeCurrencyLogoUri}
              />
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
          cancelButtonProps={{ onClick: onClose, text: 'Cancel' }}
          confirmButtonProps={{
            onClick: () => submitTx(),
            status: buttonStatus,
            text: undefined,
            disabled: isDisabled,
          }}
        />
      </Modal.Footer>
    </>
  )
}

export default ReviewVoteTx
