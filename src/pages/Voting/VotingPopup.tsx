import { calculateFee, GasPrice, MsgVoteEncodeObject } from '@cosmjs/stargate'
import { useState } from 'react'
import { toBase64 } from '@cosmjs/encoding'
import { useDispatch, useSelector } from 'react-redux'
import { OutlinedButton, OutlinedNeutralButton } from 'src/components/Button'
import { Popup } from 'src/components/Popup'
import RadioButtons from 'src/components/RadioGroup'
import {
  getChainDefaultGas,
  getChainDefaultGasPrice,
  getChainInfo,
  getCoinDecimal,
  getInternalChainId,
} from 'src/config'
import { getChains } from 'src/config/cache/chains'
import { enhanceSnackbarForAction, ERROR, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { createMessage } from 'src/logic/providers/signing'
import calculateGasFee from 'src/logic/providers/utils/fee'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import {
  extractSafeAddress,
  getPrefixedSafeAddressSlug,
  SAFE_ADDRESS_SLUG,
  extractShortChainName,
  SAFE_ROUTES,
  history,
} from 'src/routes/routes'
import { createSafeTransaction, MChainInfo } from 'src/services'
import { DEFAULT_GAS_LIMIT } from 'src/services/constant/common'
import { MESSAGES_CODE } from 'src/services/constant/message'
import { VotingPopupWrapper } from './styledComponents'
import { ICreateSafeTransaction } from 'src/types/transaction'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { generatePath } from 'react-router-dom'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const VotingPopup = ({ isOpen, onClose }: Props): React.ReactElement => {
  const dispatch = useDispatch()
  const userWalletAddress = useSelector(userAccountSelector)

  const chainDefaultGasPrice = getChainDefaultGasPrice()
  const chainDefaultGas = getChainDefaultGas()
  const defaultGas = chainDefaultGas.find((chain) => chain.typeUrl === MsgTypeUrl.Vote)?.gasAmount
  const decimal = getCoinDecimal()
  const gasFee =
    defaultGas && chainDefaultGasPrice
      ? calculateGasFee(+defaultGas, +chainDefaultGasPrice, decimal)
      : chainDefaultGasPrice

  const [selectedOptionValue, setSelectedOptionValue] = useState<string>('yes')
  const [gasPriceFormatted, setGasPriceFormatted] = useState(gasFee)
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>(defaultGas)
  const [votingTx, setVotingTx] = useState({
    option: 1,
    proposalId: 205,
  })

  const safeAddress = extractSafeAddress()
  const chainInfo = getChainInfo()
  const listChain = getChains()

  const votingHandler = async () => {
    const chainId = chainInfo.chainId

    const mChainInfo = listChain.find((x) => x.chainId === chainId) as MChainInfo
    const denom = mChainInfo?.denom || ''
    const _gasPrice = GasPrice.fromString(String(chainDefaultGasPrice || gasPriceFormatted).concat(denom))

    const _sendFee = calculateFee(Number(manualGasLimit || defaultGas || DEFAULT_GAS_LIMIT), _gasPrice)

    if (!(votingTx && safeAddress)) {
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.TX_REJECTED_MSG)))
      return
    }

    const voteData: MsgVoteEncodeObject['value'] = {
      option: votingTx?.option,
      proposalId: votingTx?.proposalId as any,
      voter: safeAddress,
    }
    try {
      console.log(chainId, safeAddress, MsgTypeUrl.Vote, voteData, _sendFee)
      const signResult = await createMessage(chainId, safeAddress, MsgTypeUrl.Vote, voteData, _sendFee)
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
      }

      createTxFromApi(data)
    } catch (error) {
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.TX_REJECTED_MSG)))
      onClose()
    }
  }

  const createTxFromApi = async (data: any) => {
    try {
      const result = await createSafeTransaction(data)
      const { ErrorCode } = result
      if (ErrorCode === MESSAGES_CODE.SUCCESSFUL.ErrorCode) {
        // setButtonStatus(ButtonStatus.READY)

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
    } catch (error) {
      onClose()
      dispatch(
        enqueueSnackbar(
          enhanceSnackbarForAction({
            message: error.message,
            options: { variant: ERROR, persist: false, preventDuplicate: true, autoHideDuration: 5000 },
          }),
        ),
      )
    }
  }

  return (
    <Popup handleClose={onClose} open={isOpen} title="Voting Popup">
      <VotingPopupWrapper>
        <p className="title-h3_20m popup-title">Your vote</p>
        <p className="proposal-name">#169 Match External Incentives for CMDX/OSMO and CMDX/ATOM pairs</p>
        <div className="voting-options">
          <RadioButtons
            name="abc"
            value={selectedOptionValue}
            onChange={(e) => {
              setSelectedOptionValue(e.target.value)
            }}
            options={[
              {
                label: 'Yes',
                value: 'yes',
              },
              {
                label: 'No',
                value: 'no',
              },
              {
                label: 'NoWithVeto',
                value: 'noWithVeto',
              },
              {
                label: 'Abstain',
                value: 'abstain',
              },
            ]}
          />
        </div>
        <div className="buttons">
          <OutlinedNeutralButton size="md" onClick={onClose}>
            Cancel
          </OutlinedNeutralButton>
          <OutlinedButton size="md" onClick={votingHandler}>
            Vote
          </OutlinedButton>
        </div>
      </VotingPopupWrapper>
    </Popup>
  )
}

export default VotingPopup
