import React, { ReactElement } from 'react'
import styled from 'styled-components'

const StatusStyled = styled.div`
  padding: 8px 16px;
  background-color: rgba(231, 187, 65, 0.2);
  border-radius: 4px;
  color: #ffcd76;
`
function StatusCard(props): ReactElement {
  return <StatusStyled>status</StatusStyled>
}

export default StatusCard
