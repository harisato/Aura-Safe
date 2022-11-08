import { toBase64 } from '@cosmjs/encoding'
import { coin, MsgUndelegateEncodeObject } from '@cosmjs/stargate'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddressInfo from 'src/components/AddressInfo'
import { LinkButton, OutlinedButton, OutlinedNeutralButton } from 'src/components/Button'
import Divider from 'src/components/Divider'
import Gap from 'src/components/Gap'
import TextField from 'src/components/Input/TextField'
import Footer from 'src/components/Popup/Footer'
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
import { calcFee, formatNativeCurrency, formatNativeToken } from 'src/utils'
import Amount from './components/Amount'
import TotalAllocationAmount from './components/TotalAllocationAmount'
import { Wrapper } from './style'

export default function Undelegate({ validator, amount, onClose, createTxFromApi }) {
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
    chainDefaultGas.find((chain) => chain.typeUrl === MsgTypeUrl.Undelegate)?.gasAmount || DEFAULT_GAS_LIMIT.toString()
  const gasFee =
    defaultGas && chainDefaultGasPrice
      ? calculateGasFee(+defaultGas, +chainDefaultGasPrice, decimal)
      : chainDefaultGasPrice
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>(defaultGas)
  const [gasPriceFormatted, setGasPriceFormatted] = useState(gasFee)
  const [openGasInput, setOpenGasInput] = useState<boolean>(false)
  const [isDisabled, setDisabled] = useState(false)
  const chainInfo = getChainInfo()

  const recalculateFee = () => {
    const gasFee =
      manualGasLimit && chainDefaultGasPrice
        ? calculateGasFee(+manualGasLimit, +chainDefaultGasPrice, decimal)
        : chainDefaultGasPrice
    setGasPriceFormatted(gasFee)
    setOpenGasInput(!openGasInput)
  }

  const signTransaction = async () => {
    setDisabled(true)
    const chainId = chainInfo.chainId
    const _sendFee = calcFee(manualGasLimit)
    const Msg: MsgUndelegateEncodeObject['value'] = {
      amount: coin(amount * 10 ** nativeCurrency.decimals, denom),
      delegatorAddress: safeAddress,
      validatorAddress: validator.safeStaking,
    }
    try {
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.SIGN_TX_MSG)))
      const signResult = await createMessage(chainId, safeAddress, MsgTypeUrl.Undelegate, Msg, _sendFee)
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
        <div className="balance">
          Staked Amount: <strong>{formatNativeToken(stakedAmount)}</strong>
        </div>
        <Gap height={24} />
        <Amount amount={amount} />
        <Divider />
        <div className="tx-fee">
          <p className="title">Transaction fee</p>
          <div className="fee">
            <div className="fee-amount">
              <img alt={'nativeCurrencyLogoUri'} height={25} src={nativeCurrency.logoUri} />
              <p>{`${gasPriceFormatted} ${nativeCurrency.symbol}`}</p>
            </div>
            <LinkButton onClick={() => setOpenGasInput(!openGasInput)}>Edit gas</LinkButton>
          </div>
          {openGasInput && (
            <div className="edit-fee-section">
              <TextField type="number" label="Gas Amount" value={manualGasLimit} onChange={setManualGasLimit} />
              <OutlinedButton disabled={!manualGasLimit || +manualGasLimit < 1} size="md" onClick={recalculateFee}>
                Apply
              </OutlinedButton>
            </div>
          )}
        </div>
        <TotalAllocationAmount amount={+amount + +gasPriceFormatted} />
        <div className="notice">
          You’re about to create a transaction and will have to confirm it with your currently connected wallet.
        </div>
      </Wrapper>
      <Footer>
        <OutlinedNeutralButton size="md" onClick={onClose} disabled={isDisabled}>
          Back
        </OutlinedNeutralButton>
        <OutlinedButton size="md" onClick={signTransaction} disabled={isDisabled}>
          Submit
        </OutlinedButton>
      </Footer>
    </>
  )
}
