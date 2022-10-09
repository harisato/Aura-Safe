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
  } = props

  const [arrRedelegate, setArrDelegate] = useState([])

  useEffect(() => {
    allValidator.map((item: any) => {
      const dataTemp: any = [
        {
          name: 'Select Actions',
          value: 'actions',
        },
      ]
      if (item?.operatorAddress !== itemValidator?.operatorAddress) {
        const itemTemp = {
          name: item.validator,
          value: item.operatorAddress,
        }
        dataTemp.push(itemTemp)
      }
      setArrDelegate(dataTemp)
    })
  }, [allValidator])

  return (
    <ModalNew modalIsOpen={modalIsOpen}>
      <HeaderContainer>
        <HeaderPopup>
          <ImgStyled src={StakeFish} alt="StakeFish" />
          <BoxImgStyled>
            <img src={Inotel} alt="StakeFish" />
            <Commission>Commission - 6%</Commission>
          </BoxImgStyled>
        </HeaderPopup>
        <BoxVotingPower>
          <TextPower>
            Voting power - 5.58% (64.000000 <TextGreen>{nativeCurrency}</TextGreen> )
          </TextPower>
          <TextDelegators>Delegators - 27,733</TextDelegators>
        </BoxVotingPower>
      </HeaderContainer>

      <StyleDivider />

      {handlValueDelegate === 'delegate' && (
        <ModalDelegate handleAmout={handleAmout} amount={amount} nativeCurrency={nativeCurrency} />
      )}
      {handlValueDelegate === 'redelegate' && (
        <ModalRedelegate
          handlValueDelegate={handlValueDelegate}
          arrRedelegate={arrRedelegate}
          handleChangeRedelegate={handleChangeRedelegate}
          valueDelegate={valueDelegate}
          handleAmoutRedelegate={handleAmoutRedelegate}
          nativeCurrency={nativeCurrency}
        />
      )}
      {handlValueDelegate === 'undelegate' && (
        <ModalRedelegate
          handlValueDelegate={handlValueDelegate}
          arrRedelegate={arrRedelegate}
          handleChangeRedelegate={handleChangeRedelegate}
          valueDelegate={valueDelegate}
          handleAmoutRedelegate={handleAmoutRedelegate}
          nativeCurrency={nativeCurrency}
        />
      )}
      {handlValueDelegate === 'reward' && <ModalReward nativeCurrency={nativeCurrency} />}

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
