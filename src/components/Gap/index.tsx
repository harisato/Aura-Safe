import { ReactElement } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div<{ height: number }>`
  width: 100%;
  height: ${(props) => props.height}px;
`
const Gap = ({ height }): ReactElement => <Wrapper height={height}></Wrapper>

export default Gap
