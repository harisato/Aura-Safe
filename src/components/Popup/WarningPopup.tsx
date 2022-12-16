import { ReactNode } from 'react'
import { Popup } from '.'
import { OutlinedButton } from '../Button'
import WarningIcon from 'src/assets/icons/warning.svg'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 482px;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  letter-spacing: 0.01em;
  box-sizing: border-box;
  > img {
    height: 23px;
    width: 23px;
  }
  .warning-content {
    margin: 12px 0px 24px;
  }
`
export default function WarningPopup({
  children,
  open,
  onClose,
}: {
  children: ReactNode
  open: boolean
  onClose: () => void
}) {
  return (
    <Popup title="warning-popup" open={open} handleClose={onClose}>
      <Wrapper>
        <img src={WarningIcon} alt="" />
        <div className="warning-content">{children}</div>
        <OutlinedButton onClick={onClose}>OK</OutlinedButton>
      </Wrapper>
    </Popup>
  )
}
