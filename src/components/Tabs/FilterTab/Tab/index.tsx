import MuiTab from '@material-ui/core/Tab'
import styled from 'styled-components'
const Wrap = styled(MuiTab)`
  min-width: 88px;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.01em;
  min-height: 34px;
  span {
    text-transform: capitalize;
  }
`
export default function Tab(props: any) {
  return <Wrap {...props} />
}
