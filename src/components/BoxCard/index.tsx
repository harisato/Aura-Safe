import { ReactElement } from 'react'
import styled from 'styled-components'

const BoxCardStyled = styled.div<{ justify: string; column: boolean; width: string; top: string; left: string }>`
  background-color: #24262e;
  padding: 24px;
  display: flex;
  justify-content: ${({ justify }) => (justify ? justify : 'center')};
  flex-direction: ${({ column }) => (column ? 'column' : 'none')};
  align-items: center;
  border-radius: 12px;
  width: ${({ width }) => width};
  margin-top: ${({ top }) => top};
  margin-left: ${({ left }) => left};
`

function BoxCard(props): ReactElement {
  const { children, justify, column, width, top, left } = props
  return (
    <BoxCardStyled top={top} width={width} justify={justify} column={column} left={left}>
      {children}
    </BoxCardStyled>
  )
}

export default BoxCard
