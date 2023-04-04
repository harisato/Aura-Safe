import { toBase64 } from '@cosmjs/encoding'
import { MsgWithdrawDelegatorRewardEncodeObject } from '@cosmjs/stargate'
import { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddressInfo from 'src/components/AddressInfo'
import { FilledButton, LinkButton, OutlinedNeutralButton } from 'src/components/Button'
import FeeAndSequence from 'src/components/FeeAndSequence'
import Gap from 'src/components/Gap'
import Footer from 'src/components/Popup/Footer'
import Amount from 'src/components/TxComponents/Amount'
import {
  getChainDefaultGas,
  getChainDefaultGasPrice,
  getChainInfo,
  getCoinDecimal,
  getInternalChainId,
  getNativeCurrency,
} from 'src/config'
import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { createMessage } from 'src/logic/providers/signing'
import calculateGasFee from 'src/logic/providers/utils/fee'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { extractSafeAddress } from 'src/routes/routes'
import { ICreateSafeTransaction } from 'src/types/transaction'
import { calcFee, formatNativeCurrency } from 'src/utils'
import { Wrapper } from './style'

export default function ClaimReward({ listReward, onClose, createTxFromApi, gasUsed }) {
  const safeAddress = extractSafeAddress()
  const dispatch = useDispatch()
  const userWalletAddress = useSelector(userAccountSelector)

  const nativeCurrency = getNativeCurrency()
  const chainDefaultGasPrice = getChainDefaultGasPrice()
  const decimal = getCoinDecimal()
  const defaultGas = gasUsed || String(400000 * listReward.length)
  const gasFee =
    defaultGas && chainDefaultGasPrice
      ? calculateGasFee(+defaultGas, +chainDefaultGasPrice, decimal)
      : chainDefaultGasPrice
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>(defaultGas)
  const [gasPriceFormatted, setGasPriceFormatted] = useState(gasFee)
  const [openGasInput, setOpenGasInput] = useState<boolean>(false)
  const [isDisabled, setDisabled] = useState(false)
  const [sequence, setSequence] = useState('0')
  const chainInfo = getChainInfo()

  const signTransaction = async () => {
    setDisabled(true)
    const chainId = chainInfo.chainId
    const _sendFee = calcFee(manualGasLimit)
    const Msg: MsgWithdrawDelegatorRewardEncodeObject = listReward.map((item) => ({
      typeUrl: MsgTypeUrl.GetReward,
      value: {
        delegatorAddress: item.delegatorAddress,
        validatorAddress: item.validatorAddress,
      },
    }))
    try {
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.SIGN_TX_MSG)))
      const signResult = await createMessage(chainId, safeAddress, MsgTypeUrl.GetReward, Msg, _sendFee, sequence)
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
    }
  }

  return (
    <>
      <Wrapper>
        <p className="label">Claim from:</p>
        {listReward.map((item, index) => {
          return (
            <Fragment key={index}>
              {index != 0 && <Gap height={6} />}
              <AddressInfo address={item.validatorAddress} />
            </Fragment>
          )
        })}
        <Gap height={16} />
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
        <Gap height={16} />
        <Amount amount={formatNativeCurrency(+gasPriceFormatted)} label="Total Allocation Amount" />
        <div className="notice">
          You’re about to create a transaction and will have to confirm it with your currently connected wallet.
        </div>
      </Wrapper>
      <Footer>
        <OutlinedNeutralButton onClick={onClose} disabled={isDisabled}>
          Close
        </OutlinedNeutralButton>
        <FilledButton onClick={signTransaction} disabled={isDisabled || openGasInput}>
          Submit
        </FilledButton>
      </Footer>
    </>
  )
}
