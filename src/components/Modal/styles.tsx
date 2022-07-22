import styled from 'styled-components'
import { Modal as ModalMUI } from '@material-ui/core'
import { Title as TitleSRC, Button } from '@aura/safe-react-components'
import { bgBox, borderLinear } from 'src/theme/variables'
import { BodyProps, FooterProps } from './type'

const ModalStyled = styled(ModalMUI)`
  & {
    align-items: center;
    flex-direction: column;
    display: flex;
    overflow-y: scroll;
  }

  .overlay {
    background-color: rgba(0, 0, 0, 0.9) !important;
  }

  .paper {
    position: relative;
    top: 68px;
    width: 500px;
    border-radius: 8px;
    background-color: ${bgBox};
    display: flex;
    flex-direction: column;

    &:focus {
      outline: none;
    }

    // TODO: replace class-based styles by params
    &.receive-modal {
      height: auto;
      max-width: calc(100% - 130px);
      min-height: 544px;
      overflow: hidden;
    }

    &.bigger-modal-window {
      width: 775px;
      height: auto;
    }

    &.smaller-modal-window {
      height: auto;
    }

    &.modal {
      height: auto;
      max-width: calc(100% - 130px);
    }
  }
`

const HeaderSection = styled.div`
  display: flex;
  padding: 24px 18px 24px 24px;
  border-bottom: 2px solid #404047;
  h5 {
    color: #ffffff;
  }

  .close-button {
    align-self: flex-end;
    background: none;
    border: none;
    padding: 5px;
    width: 26px;
    height: 26px;

    span {
      margin-right: 0;
    }

    :hover {
      background: ${({ theme }) => theme.colors.separator};
      border-radius: 16px;
      cursor: pointer;
    }
  }
`

const TitleStyled = styled(TitleSRC)`
  display: flex;
  align-items: center;
  flex-basis: 100%;

  .image,
  img {
    width: 20px;
    margin-right: 10px;
  }

  .note,
  span {
    margin-left: 12px;
  }
`

const BodySection = styled.div<{ withoutPadding: BodyProps['withoutPadding']; fitContent?: boolean }>`
  padding: ${({ withoutPadding }) => (withoutPadding ? 0 : '24px')};
  min-height: ${({ fitContent }) => (fitContent ? 'fit-content' : '200px')};
`

const FooterSection = styled.div<{ withoutBorder: boolean; justifyContent?: FooterProps['justifyContent'] }>`
  display: flex;
  justify-content: ${({ justifyContent }) => (justifyContent ? justifyContent : 'center')};
  align-items: center;
  border-top: ${({ withoutBorder }) => (withoutBorder ? '0' : '2px')} solid #404047;
  height: 84px;
  gap: 16px;
  border-top: 1px solid rgb(62, 63, 64);
  padding: 0px 24px;
`

const LoaderText = styled.span`
  margin-left: 10px;
`
const StyledBorderButton = styled.div<{ disabled: boolean }>`
  border-radius: 50px !important;
  border: 2px solid transparent;
  background-image: ${borderLinear};
  background-origin: border-box;
  background-clip: content-box, border-box;
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
`

const StyledButtonConfirm = styled(Button)`
  background-color: transparent !important;
  background-color: rgba(18, 18, 18, 1) !important;
  border-radius: 50px !important;
`

const StyledButtonClose = styled(Button)`
  background-color: transparent !important;
  /* border: 1px solid rgba(230, 94, 94, 1); */
  border: none;
  border-radius: 50px !important;
  color: white !important;
`

export {
  ModalStyled,
  HeaderSection,
  TitleStyled,
  BodySection,
  FooterSection,
  LoaderText,
  StyledButtonClose,
  StyledButtonConfirm,
  StyledBorderButton,
}
