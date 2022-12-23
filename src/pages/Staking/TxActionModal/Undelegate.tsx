import { toBase64 } from '@cosmjs/encoding'
import { coin, MsgUndelegateEncodeObject } from '@cosmjs/stargate'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddressInfo from 'src/components/AddressInfo'
import { FilledButton, LinkButton, OutlinedButton, OutlinedNeutralButton } from 'src/components/Button'
import Divider from 'src/components/Divider'
import FeeAndSequence from 'src/components/FeeAndSequence'
import Gap from 'src/components/Gap'
import TextField from 'src/components/Input/TextField'
import Footer from 'src/components/Popup/Footer'
import Amount from 'src/components/TxComponents/Amount'
import {
  getChainDefaultGas,
  getChainDefaultGasPrice,
  getChainInfo,
  getCoinDecimal,
  getCoinMinimalDenom,
  getInternalChainId,
  getNativeCurrency,
} from 'src/config'
import { allDelegation } from 'src/logic/delegation/store/selectors'
import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { createMessage } from 'src/logic/providers/signing'
import calculateGasFee from 'src/logic/providers/utils/fee'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { extractSafeAddress } from 'src/routes/routes'
import { DEFAULT_GAS_LIMIT } from 'src/services/constant/common'
import { ICreateSafeTransaction } from 'src/types/transaction'
import { calcFee, formatBigNumber, formatNativeCurrency, formatNativeToken } from 'src/utils'
import { Wrapper } from './style'

export default function Undelegate({ validator, amount, onClose, createTxFromApi, gasUsed }) {
  const safeAddress = extractSafeAddress()
  const dispatch = useDispatch()
  const { ethBalance: balance } = useSelector(currentSafeWithNames)
  const delegations = useSelector(allDelegation)
  const userWalletAddress = useSelector(userAccountSelector)
  const stakedAmount = delegations?.find(
    (delegation: any) => delegation.operatorAddress == validator.safeStaking,
  )?.staked
  const nativeCurrency = getNativeCurrency()
  const denom = getCoinMinimalDenom()
  const chainDefaultGas = getChainDefaultGas()
  const chainDefaultGasPrice = getChainDefaultGasPrice()
  const decimal = getCoinDecimal()
  const defaultGas =
    gasUsed ||
    chainDefaultGas.find((chain) => chain.typeUrl === MsgTypeUrl.Undelegate)?.gasAmount ||
    DEFAULT_GAS_LIMIT.toString()
  const gasFee =
    defaultGas && chainDefaultGasPrice
      ? calculateGasFee(+defaultGas, +chainDefaultGasPrice, decimal)
      : chainDefaultGasPrice
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>(defaultGas)
  const [gasPriceFormatted, setGasPriceFormatted] = useState(gasFee)
  const [openGasInput, setOpenGasInput] = useState<boolean>(false)
  const [isDisabled, setDisabled] = useState(false)
  const chainInfo = getChainInfo()
  const [sequence, setSequence] = useState('0')
  const signTransaction = async () => {
    setDisabled(true)
    const chainId = chainInfo.chainId
    const _sendFee = calcFee(manualGasLimit)
    const Msg: MsgUndelegateEncodeObject['value'] = {
      amount: coin(formatBigNumber(amount, true), denom),
      delegatorAddress: safeAddress,
      validatorAddress: validator.safeStaking,
    }
    try {
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.SIGN_TX_MSG)))
      const signResult = await createMessage(chainId, safeAddress, MsgTypeUrl.Undelegate, Msg, _sendFee, sequence)
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

  return (
    <>
      <Wrapper>
        <AddressInfo address={safeAddress} />
        <div className="balance">
          Balance: <strong>{formatNativeCurrency(balance)}</strong>
        </div>
        <Divider withArrow rotateArrow />
        <p className="label">Validator</p>
        <AddressInfo address={validator.safeStaking} name={validator.name} avatarUrl={validator.avatar} />
        {stakedAmount && (
          <div className="balance">
            Staked Amount: <strong>{formatNativeToken(stakedAmount)}</strong>
          </div>
        )}
        <Gap height={24} />
        <Amount amount={formatNativeCurrency(amount)} />
        <Divider />
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
        <Divider />
        <Amount amount={formatNativeCurrency(gasPriceFormatted)} label="Total Allocation Amount" />
        <div className="notice">
          You’re about to create a transaction and will have to confirm it with your currently connected wallet.
        </div>
      </Wrapper>
      <Footer>
        <OutlinedNeutralButton onClick={onClose} disabled={isDisabled}>
          Close
        </OutlinedNeutralButton>
        <FilledButton onClick={signTransaction} disabled={isDisabled}>
          Submit
        </FilledButton>
      </Footer>
    </>
  )
}
