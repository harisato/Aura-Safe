import React, { ReactElement } from 'react'
import styled from 'styled-components'

const CloseButtonStyled = styled.button`
  font-size: 14px;
  padding: 8px 20px;
  border: 1px solid #5c606d;
  border-radius: 20px;
  background-color: transparent;
  color: white;
  height: 32px;
`

function CloseButton(props): ReactElement {
  const { title } = props

  return <CloseButtonStyled>{title}</CloseButtonStyled>
}

export default CloseButton
