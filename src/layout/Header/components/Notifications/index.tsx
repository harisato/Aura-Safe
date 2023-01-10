import styled from 'styled-components'
import Bell from 'src/assets/icons/Bell.svg'
const Wrap = styled.div`
  height: 100%;
  padding: 25px;
  border-left: 1px solid #3e3f40;
`
export default function Notifications() {
  return (
    <Wrap>
      <img src={Bell} alt="" />
    </Wrap>
  )
}
