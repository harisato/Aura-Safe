import { ReactElement } from 'react'
import styled from 'styled-components'
import { Icon, Divider as DividerSRC } from '@aura/safe-react-components'

const Wrapper = styled.div<{ rotateArrow?: boolean }>`
  display: flex;
  align-items: center;
  svg {
    margin: 0 12px 0 4px;
    transform: ${(props) => (props.rotateArrow ? 'rotate(180deg)' : 'unset')};
  }
`
const StyledDivider = styled(DividerSRC)`
  width: 100%;
  border-top: 1px solid #3e3f40;
`

type Props = {
  withArrow?: boolean
  rotateArrow?: boolean
}

const Divider = ({ withArrow, rotateArrow }: Props): ReactElement => (
  <Wrapper rotateArrow={rotateArrow}>
    {withArrow && <Icon type="arrowDown" size="md" />}
    <StyledDivider />
  </Wrapper>
)

export default Divider
