import React, { ReactElement, useEffect, useState } from 'react'
import ActionModal from './ActionModal/index'
import Undelegating from './Undelegating'
import Validators from './Validators'

import { getCoinMinimalDenom, getInternalChainId, getNativeCurrency } from 'src/config'
import {
  getAllDelegateOfUser,
  getAllUnDelegateOfUser,
  getAllValidator,
  getDelegateOfUser,
  getNumberOfDelegator,
  simulate,
} from 'src/services/index'

import queryString from 'query-string'
import { extractPrefixedSafeAddress, extractSafeAddress } from 'src/routes/routes'

import { coin } from '@cosmjs/stargate'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/assets/icons/Stack.svg'
import Breadcrumb from 'src/components/Breadcrumb'
import { ConnectWalletModal } from 'src/components/ConnectWalletModal'
import useConnectWallet from 'src/logic/hooks/useConnectWallet'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { loadedSelector } from 'src/logic/wallets/store/selectors'
import { grantedSelector } from 'src/utils/safeUtils/selector'
import { convertAmount, formatNumber } from 'src/utils'
import { usePagedQueuedTransactions } from '../../utils/hooks/usePagedQueuedTransactions'
import MyDelegation from './MyDelegation'
import TxActionModal from './TxActionModal'
function Staking(props): ReactElement {
  const dispatch = useDispatch()
  const granted = useSelector(grantedSelector)
  const { safeId } = extractPrefixedSafeAddress()

  const denom = getCoinMinimalDenom()
  const { connectWalletState, onConnectWalletShow, onConnectWalletHide } = useConnectWallet()
  const { count, isLoading, hasMore, next, transactions } = usePagedQueuedTransactions()
  const currentSafeData = useSelector(currentSafeWithNames)
  const loaded = useSelector(loadedSelector)

  const [isOpenDelagate, setIsOpenDelagate] = useState(false)
  const [isOpenReview, setIsOpenReview] = useState(false)
  const [typeStaking, setTypeStaking] = useState('')

  const nativeCurrency = getNativeCurrency()
  const [amount, setAmount] = useState<any>('')

  const [availableBalance, setAvailableBalance] = useState({ _id: '', amount: '', denom: '' })
  const [totalStake, setTotalStake] = useState(0)
  const [rewardAmount, setRewardAmount] = useState(0)

  const internalChainId = getInternalChainId()

  const SafeAddress = extractSafeAddress()

  const [allValidator, setAllValidator] = useState([])
  const [validatorOfUser, setValidatorOfUser] = useState([])
  const [unValidatorOfUser, setUnValidatorOfUser] = useState([])
  const [listReward, setListReward] = useState<any>([])

  const [valueDelegate, setValueDelegate] = React.useState('none')
  const [itemValidator, setItemValidator] = useState<any>()
  const [selectedAction, setSelectedAction] = useState('')
  const [itemDelegate, setItemDelegate] = useState<any>()
  const [dataDelegateOfUser, setDataDelegateOfUser] = useState<any>()
  const [validateMsg, setValidateMsg] = useState<string | undefined>()
  const [gasUsed, setGasUsed] = useState(0)

  const [simulateLoading, setSimulateLoading] = useState(false)

  const handleChangeAction = (action) => {
    setSelectedAction(action)
    setAmount('')
    setValidateMsg('')
    setValueDelegate('none')
  }

  const handleChangeRedelegate = (event) => {
    setValueDelegate(event.target.value)
  }

  const handleDelegatedAmount = (v) => {
    setValidateMsg(undefined)
    const value = formatNumber(v)
    setAmount(value)
    if (+value > +convertAmount(dataDelegateOfUser?.delegation?.delegationBalance?.amount, false)) {
      setValidateMsg('Given amount is greater than available balance!')
    }
  }

  const handleListValidator = async (internalChainId) => {
    const listValidator: any = (await getAllValidator(internalChainId)) || []
    setAllValidator(listValidator?.Data?.validators)
  }

  useEffect(() => {
    const dataTemp: any = []
    handleListValidator(internalChainId)
    //
    getAllDelegateOfUser(internalChainId, SafeAddress).then((res) => {
      setValidatorOfUser(res.Data?.delegations)
      res.Data?.availableBalance && setAvailableBalance(res.Data?.availableBalance)
      setTotalStake(res.Data.total?.staked)
      setRewardAmount(res.Data.total?.reward || 0)
      res.Data?.delegations?.map((item) => {
        if (item.reward?.[0]?.amount) {
          dataTemp.push({
            delegatorAddress: SafeAddress,
            validatorAddress: item?.operatorAddress,
          })
        }
      })
      setListReward(dataTemp)
    })
    getAllUnDelegateOfUser(internalChainId, SafeAddress).then((res) => {
      setUnValidatorOfUser(res.Data?.undelegations)
    })
  }, [internalChainId, SafeAddress])

  const handleAmout = (v) => {
    setValidateMsg(undefined)
    const value = formatNumber(v)
    setAmount(value)
    if (+value > +convertAmount(availableBalance?.amount, false)) {
      setValidateMsg('Given amount is greater than available balance!')
    }
  }

  const handleCallDataValidator = async (address) => {
    setDataDelegateOfUser(null)
    const dataSend: any = {
      internalChainId: internalChainId,
      operatorAddress: address,
      delegatorAddress: SafeAddress,
    }
    const res = await getDelegateOfUser(queryString.stringify(dataSend))
    let numberOfDelegator
    try {
      numberOfDelegator = await getNumberOfDelegator(address)
    } catch (error) {}
    setDataDelegateOfUser({
      ...res.Data,
      validator: { ...res.Data.validator, delegators: numberOfDelegator?.pagination?.total || '??' },
    })
  }

  const handleManage = async (item) => {
    if (!loaded) {
      onConnectWalletShow()
      return
    }
    setSelectedAction('manage')
    setIsOpenDelagate(true)
    const dataTemp = {
      safeStaking: item.operatorAddress,
      name: item.validator,
      avatar: item.description.picture,
    }

    await handleCallDataValidator(item.operatorAddress)
    setItemValidator(dataTemp)
    setItemDelegate(item)
  }

  const handleManageDelegate = async (item) => {
    if (!loaded) {
      onConnectWalletShow()
      return
    }
    setIsOpenDelagate(true)
    setValidateMsg('')
    setSelectedAction('delegate')
    const dataTemp = {
      safeStaking: item.operatorAddress,
      name: item.validator,
      avatar: item.description.picture,
    }
    await handleCallDataValidator(item.operatorAddress)
    setItemValidator(dataTemp)
  }

  const handleSubmit = async (action) => {
    if (action === 'delegate') {
      if (+amount > +convertAmount(availableBalance?.amount, false) || amount == 0) {
        setValidateMsg('Invalid amount! Please check and try again.')
        return
      }
      try {
        const res = await simulate({
          encodedMsgs: Buffer.from(
            JSON.stringify([
              {
                typeUrl: MsgTypeUrl.Delegate,
                value: {
                  amount: coin(convertAmount(amount, true), denom),
                  delegatorAddress: SafeAddress,
                  validatorAddress: itemValidator.safeStaking,
                },
              },
            ]),
            'binary',
          ).toString('base64'),
          safeId: safeId?.toString(),
        })
        if (res?.Data?.gasUsed) {
          setGasUsed(res?.Data?.gasUsed)
        }
      } catch (error) {
        setGasUsed(0)
      }
      setTypeStaking(MsgTypeUrl.Delegate)
    }

    if (action === 'redelegate') {
      if (+amount > +convertAmount(dataDelegateOfUser?.delegation?.delegationBalance?.amount, false) || amount == 0) {
        setValidateMsg('Invalid amount! Please check and try again.')
        return
      }
      try {
        const res = await simulate({
          encodedMsgs: Buffer.from(
            JSON.stringify([
              {
                typeUrl: MsgTypeUrl.Redelegate,
                value: {
                  amount: coin(convertAmount(amount, true), denom),
                  delegatorAddress: SafeAddress,
                  validatorSrcAddress: itemValidator.safeStaking,
                  validatorDstAddress: valueDelegate,
                },
              },
            ]),
            'binary',
          ).toString('base64'),
          safeId: safeId?.toString(),
        })
        if (res?.Data?.gasUsed) {
          setGasUsed(res?.Data?.gasUsed)
        }
      } catch (error) {
        setGasUsed(0)
      }

      setTypeStaking(MsgTypeUrl.Redelegate)
    }

    if (action === 'undelegate') {
      if (+amount > +convertAmount(dataDelegateOfUser?.delegation?.delegationBalance?.amount, false) || amount == 0) {
        setValidateMsg('Invalid amount! Please check and try again.')
        return
      }
      try {
        const res = await simulate({
          encodedMsgs: Buffer.from(
            JSON.stringify([
              {
                typeUrl: MsgTypeUrl.Undelegate,
                value: {
                  amount: coin(convertAmount(amount, true), denom),
                  delegatorAddress: SafeAddress,
                  validatorAddress: itemValidator.safeStaking,
                },
              },
            ]),
            'binary',
          ).toString('base64'),
          safeId: safeId?.toString(),
        })
        if (res?.Data?.gasUsed) {
          setGasUsed(res?.Data?.gasUsed)
        }
      } catch (error) {
        setGasUsed(0)
      }

      setTypeStaking(MsgTypeUrl.Undelegate)
    }
    setIsOpenReview(true)
    setIsOpenDelagate(false)
  }

  const claimReward = async () => {
    if (!loaded) {
      onConnectWalletShow()
      return
    }
    try {
      setSimulateLoading(true)
      const res = await simulate({
        encodedMsgs: Buffer.from(
          JSON.stringify(
            listReward.map((item) => ({
              typeUrl: MsgTypeUrl.GetReward,
              value: {
                delegatorAddress: item.delegatorAddress,
                validatorAddress: item.validatorAddress,
              },
            })),
          ),
          'binary',
        ).toString('base64'),
        safeId: safeId?.toString(),
      })
      if (res?.Data?.gasUsed) {
        setGasUsed(res?.Data?.gasUsed)
      }
      setSimulateLoading(false)
    } catch (error) {
      setSimulateLoading(false)
      setGasUsed(0)
    }

    setIsOpenReview(true)
    setIsOpenDelagate(false)
    setTypeStaking(MsgTypeUrl.GetReward)
  }

  const handleCloseSendFund = () => {
    setIsOpenReview(false)
  }

  const handleMax = (item) => {
    setAmount(item)
  }

  const HandleClose = () => {
    setIsOpenDelagate(false)
    setItemValidator(null)
    setAmount('')
  }

  return (
    <>
      <Breadcrumb title="Staking" subtitleIcon={Icon} subtitle="Staking" />

      <MyDelegation
        handleModal={handleManage}
        availableBalance={availableBalance}
        totalStake={totalStake}
        rewardAmount={rewardAmount}
        validatorOfUser={validatorOfUser}
        claimReward={claimReward}
        nativeCurrency={nativeCurrency}
        allValidator={allValidator}
        disabledButton={loaded && !granted}
        simulateLoading={simulateLoading}
      />

      {unValidatorOfUser && unValidatorOfUser.length > 0 && (
        <Undelegating unValidatorOfUser={unValidatorOfUser} allValidator={allValidator} />
      )}

      <Validators
        allValidator={allValidator}
        handleManageDelegate={handleManageDelegate}
        disabledButton={loaded && !granted}
      />

      <ActionModal
        modalIsOpen={isOpenDelagate}
        handleClose={HandleClose}
        selectedAction={selectedAction}
        handleChangeAction={handleChangeAction}
        handleSubmit={handleSubmit}
        handleAmout={handleAmout}
        amount={amount}
        allValidator={allValidator}
        itemValidator={itemValidator}
        handleChangeRedelegate={handleChangeRedelegate}
        valueDelegate={valueDelegate}
        handleDelegatedAmount={handleDelegatedAmount}
        nativeCurrency={nativeCurrency}
        itemDelegate={itemDelegate}
        availableBalance={availableBalance}
        handleMax={handleMax}
        dataDelegateOfUser={dataDelegateOfUser}
        validateMsg={validateMsg}
      />
      <TxActionModal
        open={isOpenReview}
        onClose={handleCloseSendFund}
        action={typeStaking}
        validator={itemValidator}
        dstValidator={valueDelegate}
        amount={amount}
        listReward={listReward}
        gasUsed={Math.round(gasUsed * 2)}
      />

      <ConnectWalletModal isOpen={connectWalletState.showConnect} onClose={onConnectWalletHide}></ConnectWalletModal>
    </>
  )
}

export default Staking
