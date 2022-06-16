import styled from 'styled-components'
import Button from 'src/components/layout/Button'
import { colorLinear } from 'src/theme/variables'

const StyledConnectButton = styled(Button)`
  border-radius: 50px;
  background: ${colorLinear} !important;
  color: rgba(34, 34, 35, 1);
`
export { StyledConnectButton }
