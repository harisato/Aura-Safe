import { ReactElement } from 'react'
import styled from 'styled-components'

const BoxCardStyled = styled.div`
  background-color: #24262e;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
`

function BoxCard(props): ReactElement {
  const { children } = props
  return <BoxCardStyled>{children}</BoxCardStyled>
}

export default BoxCard
