import MuiTabs from '@material-ui/core/Tabs'
import styled from 'styled-components'
const Wrap = styled(MuiTabs)`
  background: #363843;
  border: 1px solid #494c58;
  border-radius: 8px;
  width: fit-content;
  min-height: unset;
  padding: 4px;
  .MuiTabs-flexContainer {
    z-index: 2;
    position: relative;
  }
  .MuiTabs-indicator {
    z-index: 1;
    background-color: #24262e !important;
    border-radius: 8px;
    height: 100%;
  }
`
export default function Tabs({ value, onChange, children }: any) {
  return (
    <Wrap value={value} onChange={onChange}>
      {children}
    </Wrap>
  )
}
