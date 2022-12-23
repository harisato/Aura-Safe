import { toBase64 } from '@cosmjs/encoding'
import { MsgVoteEncodeObject } from '@cosmjs/stargate'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generatePath } from 'react-router-dom'

import { FilledButton, LinkButton, OutlinedButton, OutlinedNeutralButton } from 'src/components/Button'
import FeeAndSequence from 'src/components/FeeAndSequence'
import Gap from 'src/components/Gap'
import TextField from 'src/components/Input/TextField'
import { Popup } from 'src/components/Popup'
import Footer from 'src/components/Popup/Footer'
import Header from 'src/components/Popup/Header'
import {
  getChainDefaultGas,
  getChainDefaultGasPrice,
  getChainInfo,
  getCoinDecimal,
  getInternalChainId,
  getNativeCurrency,
} from 'src/config'
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
import { createSafeTransaction } from 'src/services'
import { DEFAULT_GAS_LIMIT } from 'src/services/constant/common'
import { MESSAGES_CODE } from 'src/services/constant/message'
import { IProposal } from 'src/types/proposal'
import { ICreateSafeTransaction } from 'src/types/transaction'
import { calcFee } from 'src/utils'
import { formatWithSchema } from 'src/utils/date'
import { ReviewTxPopupWrapper } from './styledComponents'

const voteMapping = {
  ['YES']: 1,
  ['ABSTAIN']: 2,
  ['NO']: 3,
  ['NOWITHVETO']: 4,
}
export type VotingTx = {
  option: number
  proposalId: number
}

type ReviewVotingTxProps = {
  open: boolean
  onClose: () => void
  onBack: () => void
  proposal?: IProposal
  vote: string
  gasUsed: string
}

const ReviewTxPopup = ({ open, onClose, proposal, vote, onBack, gasUsed }: ReviewVotingTxProps): React.ReactElement => {
  const dispatch = useDispatch()
  const safeAddress = extractSafeAddress()
  const nativeCurrency = getNativeCurrency()
  const chainDefaultGas = getChainDefaultGas()
  const chainDefaultGasPrice = getChainDefaultGasPrice()
  const decimal = getCoinDecimal()
  const [defaultGas, setDefaultGas] = useState(
    chainDefaultGas.find((chain) => chain.typeUrl === MsgTypeUrl.Vote)?.gasAmount || DEFAULT_GAS_LIMIT.toString(),
  )
  const gasFee =
    defaultGas && chainDefaultGasPrice
      ? calculateGasFee(+defaultGas, +chainDefaultGasPrice, decimal)
      : chainDefaultGasPrice
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>(defaultGas)
  const [isDisabled, setDisabled] = useState(false)
  const [gasPriceFormatted, setGasPriceFormatted] = useState(gasFee)
  const chainInfo = getChainInfo()
  const userWalletAddress = useSelector(userAccountSelector)
  const [openGasInput, setOpenGasInput] = useState<boolean>(false)
  const [sequence, setSequence] = useState('0')
  useEffect(() => {
    if (gasUsed != '0') {
      setDefaultGas(gasUsed)
      setManualGasLimit(gasUsed)
      const gasFee =
        gasUsed && chainDefaultGasPrice
          ? calculateGasFee(+gasUsed, +chainDefaultGasPrice, decimal)
          : chainDefaultGasPrice
      setGasPriceFormatted(gasFee)
    }
  }, [gasUsed])
  const signTransaction = async (safeAddress: string) => {
    setDisabled(true)
    const chainId = chainInfo.chainId
    const _sendFee = calcFee(manualGasLimit)
    const votingTxParam = {
      option: voteMapping[vote.toUpperCase()],
      proposalId: proposal?.id,
    }
    const voteData: MsgVoteEncodeObject['value'] = {
      option: votingTxParam?.option,
      proposalId: votingTxParam?.proposalId as any,
      voter: safeAddress,
    }
    try {
      const signResult = await createMessage(chainId, safeAddress, MsgTypeUrl.Vote, voteData, _sendFee, sequence)
      if (!signResult) throw new Error()
      const signatures = toBase64(signResult.signatures[0])
      const bodyBytes = toBase64(signResult.bodyBytes)
      const authInfoBytes = toBase64(signResult.authInfoBytes)
      const data: ICreateSafeTransaction = {
        internalChainId: getInternalChainId(),
        creatorAddress: userWalletAddress,
        signature: signatures,
        bodyBytes: bodyBytes,
        authInfoBytes: authInfoBytes,
        from: safeAddress,
        accountNumber: signResult.accountNumber,
        sequence: signResult.sequence,
      }
      createTxFromApi(data)
    } catch (error) {
      setDisabled(false)
      console.error(error)
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.TX_REJECTED_MSG)))
      onClose()
    }
  }

  const createTxFromApi = async (data: any) => {
    try {
      const result = await createSafeTransaction(data)
      const { ErrorCode } = result
      if (ErrorCode === MESSAGES_CODE.SUCCESSFUL.ErrorCode) {
        const chainId = chainInfo.chainId
        dispatch(fetchTransactions(chainId, safeAddress))
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

      setDisabled(false)
      onClose()
    } catch (error) {
      console.error(error)
      onClose()
      setDisabled(false)
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
    <Popup handleClose={onClose} open={open} title="Voting Popup">
      <Header onClose={onClose} title="Vote" />
      <ReviewTxPopupWrapper>
        <div className="tx-detail">
          <p className="proposal-title">{`Proposal #${proposal?.id} ${proposal?.title}`}</p>
          <div className="voting-detail">
            <p>Vote value</p>
            <p>{vote}</p>
          </div>
          <div className="voting-detail">
            <p>Execute before</p>
            <p>{proposal && formatWithSchema(new Date(proposal.votingEnd).getTime(), 'dd/MM/yyyy')}</p>
          </div>
        </div>

        <FeeAndSequence
          open={openGasInput}
          setOpen={setOpenGasInput}
          manualGasLimit={manualGasLimit}
          setManualGasLimit={setManualGasLimit}
          gasPriceFormatted={gasPriceFormatted}
          setGasPriceFormatted={setGasPriceFormatted}
          sequence={sequence}
          setSequence={setSequence}
        />
        <Gap height={24} />
        <div className="total-amount">
          <p className="title">Total Allocation Amount</p>
          <div className="amount">
            <img alt={'nativeCurrencyLogoUri'} height={25} src={nativeCurrency.logoUri} />
            <p>{`${gasPriceFormatted} ${nativeCurrency.symbol}`}</p>
          </div>
        </div>
        <div className="notice">
          You’re about to create a transaction and will have to confirm it with your currently connected wallet.
        </div>
      </ReviewTxPopupWrapper>
      <Footer>
        <OutlinedNeutralButton onClick={onBack}>Back</OutlinedNeutralButton>
        <FilledButton
          onClick={() => {
            signTransaction(safeAddress)
          }}
          disabled={isDisabled}
        >
          Submit
        </FilledButton>
      </Footer>
    </Popup>
  )
}

export default ReviewTxPopup
