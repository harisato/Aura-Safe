import React, { ReactElement, useState, useEffect } from 'react'
import { Breadcrumb, BreadcrumbElement, Menu, Text } from '@aura/safe-react-components'
import Col from 'src/components/layout/Col'
import Block from 'src/components/layout/Block'
import CardStaking from 'src/components/CardStaking'
import Undelegating from './Undelegating'
import Validators from './Validators'
import BoxCard from 'src/components/BoxCard'
import ModalStaking from './ModalStaking/index'
import { useDispatch, useSelector } from 'react-redux'
import {
  getChainDefaultGas,
  getChainDefaultGasPrice,
  getChainInfo,
  getCoinDecimal,
  getCoinMinimalDenom,
  getExplorerInfo,
  getInternalChainId,
} from 'src/config'
import {
  getAllValidator,
  getAllDelegateOfUser,
  getAllUnDelegateOfUser,
  clamRewards,
  createSafeTransaction,
  getAccountOnChain,
  getMChainsConfig,
} from 'src/services/index'
import {
  calculateFee,
  coin,
  GasPrice,
  MsgDelegateEncodeObject,
  SignerData,
  SigningStargateClient,
} from '@cosmjs/stargate'
import SendModal from '../Balances/SendModal'
import { toBase64 } from '@cosmjs/encoding'
import { extractSafeAddress, extractSafeId } from 'src/routes/routes'
import { currentSafeOwners } from 'src/logic/safe/store/selectors'
import { DEFAULT_GAS_LIMIT } from 'src/services/constant/common'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { enhanceSnackbarForAction, ERROR, NOTIFICATIONS } from 'src/logic/notifications'
import { ICreateSafeTransaction } from 'src/types/transaction'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { MESSAGES_CODE } from 'src/services/constant/message'
import { toNumber } from 'lodash'
import { ContactlessOutlined } from '@material-ui/icons'

function calculateGasFee(gas: number, gasPrice: number, decimal: number): number {
  return (+gas * +gasPrice) / Math.pow(10, decimal)
}

function getGasFee(defaultGas, chainDefaultGasPrice, decimal) {
  return (
    Math.ceil(
      +(defaultGas && chainDefaultGasPrice
        ? calculateGasFee(+defaultGas, +chainDefaultGasPrice, decimal)
        : chainDefaultGasPrice) * Math.pow(10, decimal),
    ) / Math.pow(10, decimal)
  )
}

function Staking(props): ReactElement {
  const [isOpenRerawd, setIsOpenRerawd] = useState(false)
  const [isOpenDelagate, setIsOpenDelagate] = useState(false)
  const [isRedelegate, setIsRedelegate] = useState(false)
  const [amount, setAmount] = useState(0)

  const [availableBalance, setAvailableBalance] = useState(0)
  const [totalStake, setTotalStake] = useState(0)
  const [rewardAmount, setRewardAmount] = useState(0)

  const owners = useSelector(currentSafeOwners)
  const internalChainId = getInternalChainId()
  const denom = getCoinMinimalDenom()
  const chainDefaultGasPrice = getChainDefaultGasPrice()
  const chainDefaultGas = getChainDefaultGas()

  const decimal = getCoinDecimal()
  const dispatch = useDispatch()
  const msgSendGas = chainDefaultGas.find((chain) => chain.typeUrl === '/cosmos.staking.v1beta1.MsgDelegate')

  const userWalletAddress = useSelector(userAccountSelector)
  const { multiplier, gasAmount } = msgSendGas || { multiplier: 0, gasAmount: 0 }
  const defaultGas = (Number(gasAmount) * (1 + Number(multiplier) * (owners.length - 1))).toFixed(0)
  const gasFee = getGasFee(defaultGas, chainDefaultGasPrice, decimal)

  const [gasPriceFormatted, setGasPriceFormatted] = useState<string | number>(gasFee)
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>(defaultGas)

  const SafeAddress = extractSafeAddress()
  const chainInfo = getChainInfo()

  const [allValidator, setAllValidator] = useState([])
  const [validatorOfUser, setValidatorOfUser] = useState([])
  const [unValidatorOfUser, setUnValidatorOfUser] = useState([])
  const [listReward, setListReward] = useState([])

  const [itemValidator, setItemValidator] = useState<any>()

  useEffect(() => {
    getAllValidator(internalChainId).then((res) => {
      setAllValidator(res.Data.validators)
    })
    getAllDelegateOfUser(internalChainId, SafeAddress).then((res) => {
      setValidatorOfUser(res.Data.delegations)
      setAvailableBalance(res.Data.availableBalance)
      setTotalStake(res.Data.total.staked)
      setRewardAmount(res.Data.total.reward)
    })
    getAllUnDelegateOfUser(internalChainId, SafeAddress).then((res) => {
      setUnValidatorOfUser(res.Data.undelegations)
    })
    clamRewards(internalChainId, SafeAddress).then((res) => {
      setListReward(res.Data.rewards)
    })
  }, [internalChainId, SafeAddress])

  const handleManageDelegate = (item) => {
    setIsOpenDelagate(true)
    setItemValidator(item)
  }

  const handleAmout = (event) => {
    setAmount(event.target.value)
  }

  const handleReward = (item) => {
    setIsOpenRerawd(true)
  }

  const handleSubmitDelegate = () => {
    signTransactionWithKeplr(SafeAddress)
  }

  const handleSubmitRedelegate = () => {
    console.log('handle submit redelegate')
  }

  ///

  const signTransactionWithKeplr = async (safeAddress: string) => {
    const chainId = chainInfo.chainId

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

      const amountFinal =
        chainInfo.shortName === 'evmos'
          ? Math.floor(Number(amount) * Math.pow(10, 18)).toString() || ''
          : Math.floor(Number(amount) * Math.pow(10, 6)).toString() || ''

      const signingInstruction = await (async () => {
        // get account on chain from API
        const { Data: accountOnChainResult } = await getAccountOnChain(safeAddress, getInternalChainId())
        // const accountOnChain = await client.getAccount(safeAddress)

        return {
          accountNumber: accountOnChainResult?.accountNumber,
          sequence: accountOnChainResult?.sequence,
          memo: '',
        }
      })()

      const msgSend: any = {
        delegatorAddress: safeAddress,
        validatorAddress: itemValidator?.operatorAddress,
        amount: coin(amountFinal, denom),
      }

      const msg: MsgDelegateEncodeObject = {
        typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
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
        dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.SIGN_TX_MSG)))

        const signResult = await client.sign(accounts[0]?.address, [msg], sendFee, '', signerData)

        const signatures = toBase64(signResult.signatures[0])
        const bodyBytes = toBase64(signResult.bodyBytes)
        const authInfoBytes = toBase64(signResult.authInfoBytes)

        // call api to create transaction
        const data: ICreateSafeTransaction = {
          from: safeAddress,
          to: itemValidator?.operatorAddress,
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
      }
    }
  }

  const createTxFromApi = async (data: any) => {
    createSafeTransaction(data)
      .then((e) => {
        const { ErrorCode } = e
        if (ErrorCode === MESSAGES_CODE.SUCCESSFUL.ErrorCode) {
          // setButtonStatus(ButtonStatus.READY)
          // const chainId = chainInfo.chainId
          // dispatch(fetchTransactions(chainId, safeAddress))
          // // navigate to tx details
          // const prefixedSafeAddress = getPrefixedSafeAddressSlug({ shortName: extractShortChainName(), safeAddress })
          // const txRoute = generatePath(SAFE_ROUTES.TRANSACTIONS_QUEUE, {
          //   [SAFE_ADDRESS_SLUG]: prefixedSafeAddress,
          // })
          // history.push(txRoute)
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
      })
      .catch((err) => {
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

  return (
    <>
      <Menu>
        <Col start="sm" sm={12} xs={12}>
          <Breadcrumb>
            <BreadcrumbElement
              color="white"
              iconType="stakingAura"
              text="Staking"
              // counter={addressBook?.length.toString()}
            />
          </Breadcrumb>
        </Col>
      </Menu>
      <Block>
        {' '}
        <Col start="sm" sm={12} xs={12}>
          <CardStaking
            handleModal={handleReward}
            availableBalance={availableBalance}
            totalStake={totalStake}
            rewardAmount={rewardAmount}
            validatorOfUser={validatorOfUser}
          />
        </Col>
      </Block>

      <Block margin="mdTop">
        {' '}
        <Col start="sm" sm={12} xs={12}>
          <Undelegating />
        </Col>
      </Block>

      <Block margin="mdTop" style={{ marginBottom: 10 }}>
        {' '}
        <BoxCard>
          <Col layout="column" sm={12} xs={12}>
            <Validators allValidator={allValidator} dandleManageDelegate={handleManageDelegate} />
          </Col>
        </BoxCard>
      </Block>

      <ModalStaking
        modalIsOpen={isOpenDelagate}
        handleClose={() => {
          setIsOpenDelagate(false)
        }}
        typeValidator="delegate"
        handleSubmit={handleSubmitDelegate}
        handleAmout={handleAmout}
        amount={amount}
      />
      <ModalStaking
        modalIsOpen={isRedelegate}
        handleClose={() => {
          setIsRedelegate(false)
        }}
        typeValidator="redelegate"
        handleSubmit={handleSubmitRedelegate}
      />
      <ModalStaking
        modalIsOpen={isOpenRerawd}
        handleClose={() => {
          setIsOpenRerawd(false)
        }}
        typeValidator="reward"
      />
    </>
  )
}

export default Staking
