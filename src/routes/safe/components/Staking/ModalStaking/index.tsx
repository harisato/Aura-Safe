import styled from 'styled-components'
import { useState } from 'react'
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
  const { modalIsOpen, handleClose, typeValidator } = props
  const [handlValueDelegate, setHandleValueDelegate] = useState(1)

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
            Voting power - 5.58% (64.000000 <TextGreen>AURA</TextGreen> )
          </TextPower>
          <TextDelegators>Delegators - 27,733</TextDelegators>
        </BoxVotingPower>
      </HeaderContainer>

      <StyleDivider />

      {typeValidator === 'delegate' && <ModalDelegate />}
      {typeValidator === 'redelegate' && <ModalRedelegate />}
      {typeValidator === 'reward' && <ModalReward />}

      <FotterModal>
        <CloseButton title="Close" onClick={handleClose} />
        {typeValidator === 'delegate' && (
          <StyledButtonSubmit size="md" onClick={() => {}}>
            Delegate
          </StyledButtonSubmit>
        )}
        {typeValidator === 'redelegate' && (
          <StyledButtonSubmit size="md" onClick={() => {}}>
            Redelegate
          </StyledButtonSubmit>
        )}
        {typeValidator === 'reward' && (
          <>
            <ButtonSelect handlValueDelegate={handlValueDelegate} setHandleValueDelegate={setHandleValueDelegate} />
            <StyledButtonSubmit size="md" onClick={() => {}}>
              Delegate
            </StyledButtonSubmit>
          </>
        )}
      </FotterModal>
    </ModalNew>
  )
}
