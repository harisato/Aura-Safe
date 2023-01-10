import { ReactElement } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div<{ height?: number; width?: number }>`
  width: 100%;
  height: ${(props) => props.height || 0}px;
  width: ${(props) => props.width || 0}px;
`
const Gap = ({ height, width }: any): ReactElement => <Wrapper height={height} width={width}></Wrapper>

export default Gap
