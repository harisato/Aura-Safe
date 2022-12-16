import { Button } from '@aura/safe-react-components'
import { useEffect, useState } from 'react'
import ButtonSelect from 'src/components/ButtonSelect'
import CloseButton from 'src/components/CloseButton'
import { Popup } from 'src/components/Popup'
import styled from 'styled-components'
import StakeFish from '../assets/StakeFish.svg'

import {
  BoxImgStyled,
  BoxVotingPower,
  Commission,
  FotterModal,
  HeaderContainer,
  HeaderPopup,
  ImgStyled,
  StyleDivider,
  TextDelegators,
  TextGray,
  TextPower,
  Wrapper,
} from './styles'

import { borderLinear } from 'src/theme/variables'

import ModalDelegate from './delegate'
import ManageModal from './manage'
import ModalRedelegate from './redelegate'

import { useSelector } from 'react-redux'
import { LoadingContainer } from 'src/components/LoaderContainer'
import { ValidatorType } from 'src/logic/validator/store/reducer'
import { allValidator as allValidatorSelector } from 'src/logic/validator/store/selectors'
import ModalUndelegate from './undelegate'
import Loader from 'src/components/Loader'
import { FilledButton, OutlinedNeutralButton } from 'src/components/Button'
const StyledButtonSubmit = styled(Button)`
  border: 2px solid transparent;
  background-image: ${borderLinear};
  background-origin: border-box;
  background-clip: content-box, border-box;
  border-radius: 50px !important;
  padding: 0 !important;
  background-color: transparent !important;
  min-width: 130px !important;
  height: 32px !important;
  margin-left: 10px;
  &:disabled {
    cursor: not-allowed;
    pointer-events: unset;
  }
`

export default function ModalStaking(props) {
  const {
    modalIsOpen,
    handleClose,
    handleSubmit,
    handleAmout,
    amount,
    selectedAction,
    handleChangeAction,
    allValidator,
    itemValidator,
    handleChangeRedelegate,
    valueDelegate,
    handleDelegatedAmount,
    nativeCurrency,
    itemDelegate,
    availableBalance,
    handleMax,
    dataDelegateOfUser,
    validateMsg,
  } = props

  const [arrRedelegate, setArrDelegate] = useState([])
  const allValidatorData = useSelector(allValidatorSelector)
  const [loadingSimulate, setLoadingSimulate] = useState(false)

  useEffect(() => {
    if (!modalIsOpen || validateMsg) {
      setLoadingSimulate(false)
    }
  }, [modalIsOpen, validateMsg])
  const submit = () => {
    setLoadingSimulate(true)
    handleSubmit(selectedAction)
  }

  useEffect(() => {
    const dataTemp: any = []
    if (selectedAction === 'redelegate') {
      allValidator.map((item) => {
        if (item.operatorAddress !== itemValidator?.safeStaking && item.status == 'BOND_STATUS_BONDED') {
          dataTemp.push({
            name: item.validator,
            value: item.operatorAddress,
          })
        }
      })
    }
    setArrDelegate(dataTemp)
  }, [selectedAction || itemValidator?.safeStaking])

  const stakedValidator = allValidatorData.find(
    (validator: ValidatorType) => validator.operatorAddress == dataDelegateOfUser?.validator.operatorAddress,
  )

  if (!dataDelegateOfUser) {
    return (
      <Popup title="" open={modalIsOpen} handleClose={handleClose}>
        <Wrapper>
          <LoadingContainer>
            <Loader size={60} />
          </LoadingContainer>
        </Wrapper>
      </Popup>
    )
  }

  return (
    <Popup title="" open={modalIsOpen} handleClose={handleClose}>
      <Wrapper>
        <HeaderContainer>
          <HeaderPopup>
            <ImgStyled src={stakedValidator?.picture || StakeFish} alt="StakeFish" />
            <BoxImgStyled>
              <p>{stakedValidator?.name}</p>
              <Commission>
                Commission - {parseFloat(Number(dataDelegateOfUser?.validator?.commission).toFixed(2)) || 0}%
              </Commission>
            </BoxImgStyled>
          </HeaderPopup>
          <BoxVotingPower>
            <TextPower>
              Voting power -{' '}
              {parseFloat(Number(dataDelegateOfUser?.validator?.votingPower?.percent_voting_power).toFixed(2)) || 0}% (0{' '}
              <TextGray>{nativeCurrency.symbol}</TextGray> )
            </TextPower>
            <TextDelegators>Delegators - {dataDelegateOfUser?.validator?.delegators || 0}</TextDelegators>
          </BoxVotingPower>
        </HeaderContainer>

        <StyleDivider />

        {selectedAction === 'delegate' && (
          <ModalDelegate
            handleAmout={handleAmout}
            amount={amount}
            nativeCurrency={nativeCurrency}
            availableBalance={availableBalance}
            dataDelegateOfUser={dataDelegateOfUser}
            handleMax={handleMax}
            validateMsg={validateMsg}
          />
        )}
        {selectedAction === 'redelegate' && (
          <ModalRedelegate
            dataDelegateOfUser={dataDelegateOfUser}
            selectedAction={selectedAction}
            arrRedelegate={arrRedelegate}
            handleChangeRedelegate={handleChangeRedelegate}
            valueDelegate={valueDelegate}
            handleDelegatedAmount={handleDelegatedAmount}
            amount={amount}
            itemDelegate={itemDelegate}
            nativeCurrency={nativeCurrency}
            handleMax={handleMax}
            validateMsg={validateMsg}
          />
        )}
        {selectedAction === 'undelegate' && (
          <ModalUndelegate
            dataDelegateOfUser={dataDelegateOfUser}
            selectedAction={selectedAction}
            handleChangeRedelegate={handleChangeRedelegate}
            valueDelegate={valueDelegate}
            handleDelegatedAmount={handleDelegatedAmount}
            nativeCurrency={nativeCurrency}
            amount={amount}
            handleMax={handleMax}
            validateMsg={validateMsg}
          />
        )}
        {selectedAction === 'manage' && (
          <ManageModal
            dataDelegateOfUser={dataDelegateOfUser}
            nativeCurrency={nativeCurrency}
            itemDelegate={itemDelegate}
            availableBalance={availableBalance}
          />
        )}

        <FotterModal>
          <OutlinedNeutralButton style={{ marginRight: 8 }} onClick={handleClose}>
            Close
          </OutlinedNeutralButton>
          {selectedAction === 'delegate' && (
            <FilledButton disabled={!!validateMsg} className={loadingSimulate ? 'loading' : ''} onClick={submit}>
              {loadingSimulate ? <Loader color="#24262E" content="Delegate" /> : 'Delegate'}
            </FilledButton>
          )}
          {selectedAction === 'redelegate' && (
            <FilledButton
              disabled={!!validateMsg || valueDelegate == 'none'}
              onClick={submit}
              className={loadingSimulate ? 'loading' : ''}
            >
              {loadingSimulate ? <Loader color="#24262E" content="Redelegate" /> : 'Redelegate'}
            </FilledButton>
          )}
          {selectedAction === 'undelegate' && (
            <FilledButton disabled={!!validateMsg} className={loadingSimulate ? 'loading' : ''} onClick={submit}>
              {loadingSimulate ? <Loader color="#24262E" content="Undelegate" /> : 'Undelegate'}
            </FilledButton>
          )}
          {selectedAction === 'manage' && (
            <>
              <ButtonSelect selectedAction={selectedAction} handleChangeAction={handleChangeAction} />
            </>
          )}
        </FotterModal>
      </Wrapper>
    </Popup>
  )
}
