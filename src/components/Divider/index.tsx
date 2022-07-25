import { ReactElement } from 'react'
import styled from 'styled-components'
import { Icon, Divider as DividerSRC } from '@aura/safe-react-components'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;

  svg {
    margin: 0 12px 0 4px;
  }
`
const StyledDivider = styled(DividerSRC)`
  width: 100%;
  border-top: 1px solid #3e3f40;
`

type Props = {
  withArrow?: boolean
}

const Divider = ({ withArrow }: Props): ReactElement => (
  <Wrapper>
    {withArrow && <Icon type="arrowDown" size="md" />}
    <StyledDivider />
  </Wrapper>
)

export default Divider
