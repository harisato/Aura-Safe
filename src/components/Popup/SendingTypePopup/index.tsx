import Close from '@material-ui/icons/Close'

import Hairline from 'src/components/layout/Hairline'
import Row from 'src/components/layout/Row'
import styled from 'styled-components'
import { Popup } from '..'
import { OutlinedButton } from '../../Button'

const Wrapper = styled.div`
  width: 356px;
  padding: 24px;
  > button {
    width: 100%;
    &:nth-child(1) {
      margin-bottom: 16px;
    }
  }
`
const StyledButton = styled(OutlinedButton)``
const StyledRow = styled(Row)`
  padding: 24px;
  justify-content: end;
  box-sizing: border-box;
`
const StyledCloseIcon = styled(Close)`
  height: 28px;
  width: 28px;
  color: #777e91;
`
interface SendTxTypePopupProps {
  onClose: () => void
  open: boolean
  onTypeButtonClick: (string) => void
}

const SendTxTypePopup = ({ onClose, open, onTypeButtonClick }: SendTxTypePopupProps): React.ReactElement => {
  return (
    <Popup open={open} title="Choose Sending Type">
      <StyledRow grow>
        <StyledCloseIcon onClick={onClose} />
      </StyledRow>
      <Hairline />
      <Wrapper>
        <StyledButton size="lg" onClick={() => onTypeButtonClick('single-send')}>
          Send
        </StyledButton>
        <StyledButton size="lg" onClick={() => onTypeButtonClick('multi-send')}>
          Multi-send
        </StyledButton>
      </Wrapper>
    </Popup>
  )
}

export default SendTxTypePopup
