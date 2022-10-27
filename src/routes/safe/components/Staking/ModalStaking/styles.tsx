import styled from 'styled-components'
import { Divider } from '@material-ui/core'

const ImgStyled = styled.img`
  width: 56px;
  height: 56px;
`
const HeaderPopup = styled.div`
  display: flex;
`

const HeaderContainer = styled.div`
  display: flex;
`

const BoxImgStyled = styled.div`
  align-self: center;
  margin-left: 10px;
`

const BoxVotingPower = styled.div`
  margin-left: 20px;
  align-self: center;
`

const TextPower = styled.div`
  font-size: 16px;
  color: #868a97;
  font-weight: 400;
`

const TextDelegators = styled.div`
  font-size: 16px;
  color: #868a97;
  margin-top: 8px;
  font-weight: 400;
`
const Commission = styled.div`
  font-weight: 510;
  font-size: 16px;
`

const StyleDivider = styled(Divider)`
  background-color: #363843 !important;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
`

const TextNotiStyled = styled.div`
  color: #868a97;
  font-weight: 400;
  font-size: 14px;
  margin-bottom: 6px;
`

const TextGreen = styled.span`
  color: #5ee6d0;
`

const TextDelegateNoti = styled.span`
  color: #e5e7ea;
`

const BoxDelegate = styled.div`
  margin-bottom: 6px;
`

const FotterModal = styled.div`
  display: flex;
  margin-top: 10px;
  justify-content: flex-end;
`

const TextTitleStaking = styled.div`
  color: #e5e7ea;
  font-weight: 510;
  font-size: 16px;
`

const PaddingPopup = styled.div`
  margin-top: 10px;
  > .validate-msg {
    color: #ff3535;
    font-size: 12px;
    margin: 6px 0px;
  }
`

const StyledInputModal = styled.input`
  background: transparent;
  border: none;
  color: white;
  outline: none;
  width: 85%;
  border: none;
`

const StyledButtonModal = styled.button`
  background: #717582;
  border-radius: 2px;
  padding: 6px 16px;
  font-weight: 510;
  font-size: 14px;
  color: white;
`

const BorderInput = styled.div`
  border: 1px solid #363843;
  width: 100%;
  padding: 10px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
`

const BorderAura = styled.div`
  border: 1px solid #363843;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`

const InputAura = styled.div`
  margin-top: 10px;
  display: flex;
  width: 100%;
`

const TextDisable = styled.span`
  color: #868a97;
`

export {
  ImgStyled,
  HeaderPopup,
  HeaderContainer,
  BoxImgStyled,
  BoxVotingPower,
  TextPower,
  TextDelegators,
  Commission,
  StyleDivider,
  TextNotiStyled,
  TextGreen,
  TextDelegateNoti,
  BoxDelegate,
  FotterModal,
  TextTitleStaking,
  PaddingPopup,
  InputAura,
  StyledInputModal,
  StyledButtonModal,
  BorderInput,
  BorderAura,
  TextDisable,
}
