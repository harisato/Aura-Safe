import styled from 'styled-components'
import CheckMark from 'src/assets/icons/checkIcon.svg'
const Wrap = styled.input`
  width: 20px;
  height: 20px;
  margin: 0;
  appearance: unset;
  border-radius: 4px;
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;
  &:not(:checked) {
    border: 2px solid #717582;
  }
  &:checked {
    background: #2bbba3;
    box-sizing: border-box;
  }
  &:checked::before {
    content: '';
    background: url(${CheckMark}) no-repeat center center;
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
  }
`
export default function Checkbox({ checked, onChange }) {
  return <Wrap type="checkbox" checked={checked} onChange={(value) => onChange(value.target.checked)}></Wrap>
}
