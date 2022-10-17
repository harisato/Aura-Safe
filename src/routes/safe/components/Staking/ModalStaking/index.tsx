import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { Button } from '@aura/safe-react-components'
import ModalNew from 'src/components/ModalNew'
import StakeFish from '../assets/StakeFish.svg'
import Inotel from '../assets/Inotel.png'
import CloseButton from 'src/components/CloseButton'
import ButtonSelect from 'src/components/ButtonSelect'

import {
  ImgStyled,
  HeaderPopup,
  HeaderContainer,
  BoxImgStyled,
  BoxVotingPower,
  TextPower,
  TextDelegators,
  Commission,
  StyleDivider,
  TextGreen,
  FotterModal,
} from './styles'

import { borderLinear } from 'src/theme/variables'

import ModalDelegate from './delegate'
import ModalRedelegate from './redelegate'
import ModalReward from './reward'

import * as _ from 'lodash'

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
`

export default function ModalStaking(props) {
  const {
    modalIsOpen,
    handleClose,
    handleSubmit,
    handleAmout,
    amount,
    handlValueDelegate,
    handleChange,
    allValidator,
    itemValidator,
    handleChangeRedelegate,
    valueDelegate,
    handleAmoutRedelegate,
    nativeCurrency,
    itemDelegate,
    availableBalance,
    handleMax,
    dataDelegateOfUser,
  } = props

  const [arrRedelegate, setArrDelegate] = useState([])

  useEffect(() => {
    const dataTemp: any = [
      {
        name: 'Select Actions',
        value: 'actions',
      },
    ]
    if (handlValueDelegate === 'redelegate') {
      allValidator.map((item) => {
        if (item.operatorAddress !== itemValidator?.safeStaking) {
          dataTemp.push({
            name: item.validator,
            value: item.operatorAddress,
          })
        }
      })
    }
    if (handlValueDelegate === 'undelegate') {
      allValidator.map((item) => {
        if (item.operatorAddress === itemValidator?.safeStaking) {
          dataTemp.push({
            name: item.validator,
            value: item.operatorAddress,
          })
        }
      })
    }
    setArrDelegate(dataTemp)
  }, [handlValueDelegate || itemValidator?.safeStaking])

  return (
    <ModalNew modalIsOpen={modalIsOpen} closeModal={handleClose}>
      <HeaderContainer>
        <HeaderPopup>
          <ImgStyled src={StakeFish} alt="StakeFish" />
          <BoxImgStyled>
            <img src={Inotel} alt="StakeFish" />
            <Commission>
              Commission - {parseFloat(dataDelegateOfUser?.validator?.commission).toFixed(2) || 0}%
            </Commission>
          </BoxImgStyled>
        </HeaderPopup>
        <BoxVotingPower>
          <TextPower>
            Voting power -{' '}
            {parseFloat(dataDelegateOfUser?.validator?.votingPower?.percent_voting_power).toFixed(2) || 0}% (0{' '}
            <TextGreen>{nativeCurrency}</TextGreen> )
          </TextPower>
          <TextDelegators>Delegators - {dataDelegateOfUser?.validator?.delegators || 0}</TextDelegators>
        </BoxVotingPower>
      </HeaderContainer>

      <StyleDivider />

      {handlValueDelegate === 'delegate' && (
        <ModalDelegate
          handleAmout={handleAmout}
          amount={amount}
          nativeCurrency={nativeCurrency}
          availableBalance={availableBalance}
          dataDelegateOfUser={dataDelegateOfUser}
          handleMax={handleMax}
        />
      )}
      {handlValueDelegate === 'redelegate' && (
        <ModalRedelegate
          dataDelegateOfUser={dataDelegateOfUser}
          handlValueDelegate={handlValueDelegate}
          arrRedelegate={arrRedelegate}
          handleChangeRedelegate={handleChangeRedelegate}
          valueDelegate={valueDelegate}
          handleAmoutRedelegate={handleAmoutRedelegate}
          amount={amount}
          itemDelegate={itemDelegate}
          nativeCurrency={nativeCurrency}
          handleMax={handleMax}
        />
      )}
      {handlValueDelegate === 'undelegate' && (
        <ModalRedelegate
          dataDelegateOfUser={dataDelegateOfUser}
          handlValueDelegate={handlValueDelegate}
          arrRedelegate={arrRedelegate}
          handleChangeRedelegate={handleChangeRedelegate}
          valueDelegate={valueDelegate}
          handleAmoutRedelegate={handleAmoutRedelegate}
          nativeCurrency={nativeCurrency}
          itemDelegate={itemDelegate}
          amount={amount}
          handleMax={handleMax}
        />
      )}
      {handlValueDelegate === 'reward' && (
        <ModalReward
          dataDelegateOfUser={dataDelegateOfUser}
          nativeCurrency={nativeCurrency}
          itemDelegate={itemDelegate}
          availableBalance={availableBalance}
        />
      )}

      <FotterModal>
        <CloseButton title="Close" onClick={handleClose} />
        {handlValueDelegate === 'delegate' && (
          <StyledButtonSubmit size="md" onClick={() => handleSubmit(handlValueDelegate)}>
            Delegate
          </StyledButtonSubmit>
        )}
        {handlValueDelegate === 'redelegate' && (
          <StyledButtonSubmit size="md" onClick={() => handleSubmit(handlValueDelegate)}>
            Redelegate
          </StyledButtonSubmit>
        )}
        {handlValueDelegate === 'undelegate' && (
          <StyledButtonSubmit size="md" onClick={() => handleSubmit(handlValueDelegate)}>
            Undelegate
          </StyledButtonSubmit>
        )}
        {handlValueDelegate === 'reward' && (
          <>
            <ButtonSelect handlValueDelegate={handlValueDelegate} handleChange={handleChange} />
            <StyledButtonSubmit size="md" onClick={() => handleSubmit('delegate')}>
              Delegate
            </StyledButtonSubmit>
          </>
        )}
      </FotterModal>
    </ModalNew>
  )
}
