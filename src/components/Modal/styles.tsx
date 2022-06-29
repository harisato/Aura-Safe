import styled from 'styled-components'
import { Modal as ModalMUI } from '@material-ui/core'
import { Title as TitleSRC } from '@gnosis.pm/safe-react-components'
import { bgBox } from 'src/theme/variables'
import { BodyProps, FooterProps } from './type'

const ModalStyled = styled(ModalMUI)`
  & {
    align-items: center;
    flex-direction: column;
    display: flex;
    overflow-y: scroll;
  }

  .overlay {
    background-color: rgba(232, 231, 230, 0.75) !important;
  }

  .paper {
    position: relative;
    top: 68px;
    width: 500px;
    border-radius: 8px;
    background-color: ${bgBox};
    box-shadow: 1px 2px 10px 0 rgba(40, 54, 61, 0.18);
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

const FooterSection = styled.div<{ withoutBorder: boolean; justifyContent?: FooterProps['justifyContent']}>`
  display: flex;
  justify-content: ${({ justifyContent }) => (justifyContent ? justifyContent : 'center')};
  align-items: center;
  border-top: ${({ withoutBorder }) => (withoutBorder ? '0' : '2px')} solid #404047;
  height: 84px;
  gap: 16px;

  padding: 0px 24px;
`

const LoaderText = styled.span`
  margin-left: 10px;
`
export { ModalStyled, HeaderSection, TitleStyled, BodySection, FooterSection, LoaderText }
