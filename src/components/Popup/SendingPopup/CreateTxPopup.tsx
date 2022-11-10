import styled from 'styled-components'
import { Popup } from '..'

const Wrapper = styled.div``

export default function CreateTxPopup({ open, handleClose }) {
  return (
    <Popup open={open} handleClose={handleClose} title="">
      <Wrapper></Wrapper>
    </Popup>
  )
}
