import MuiTabs from '@material-ui/core/Tabs'
import styled from 'styled-components'
const Wrap = styled(MuiTabs)`
  .MuiTabs-indicator {
    z-index: 1;
    background-color: #fff !important;
    border-radius: 8px;
  }
`
export default function Tabs({ value, onChange, children }: any) {
  return (
    <Wrap value={value} onChange={onChange}>
      {children}
    </Wrap>
  )
}
