import { colorLinear, inputLinear } from 'src/theme/variables'
import styled from 'styled-components'

const StyledTextArea = styled.textarea`
  width: 100%;
  resize: vertical;
  box-sizing: border-box;
  width: 100%;
  resize: vertical;
  font-size: 14px;
  font-family: 'SFProDisplay';
  border: 1px solid #494c58;
  border-radius: 8px;
  padding: 14px;
  color: #fff;
  background: #24262e;
  outline: none;
  &:focus {
    background: linear-gradient(#24262e, #24262e) padding-box, ${colorLinear} border-box;
    border: 1px solid transparent;
  }
`
export default function TextArea({
  value,
  onChange,
  rows = 5,
  placeholder,
}: {
  value: string
  onChange: any
  rows?: number
  placeholder?: string
}) {
  return (
    <StyledTextArea
      placeholder={placeholder}
      spellCheck={false}
      rows={rows}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}
