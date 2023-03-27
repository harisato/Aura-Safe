import { colorLinear, inputLinear } from 'src/theme/variables'
import styled from 'styled-components'

const StyledTextArea = styled.textarea`
  width: 100%;
  resize: vertical;
  box-sizing: border-box;
  width: 100%;
  resize: vertical;
  font-size: 14px;
  font-family: 'Inter';
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
const Label = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 8px;
`
export default function TextArea({
  value,
  onChange,
  rows = 5,
  placeholder,
  label,
}: {
  value: string
  onChange: any
  rows?: number
  placeholder?: string
  label?: string
}) {
  return (
    <>
      {label && <Label>{label}</Label>}
      <StyledTextArea
        placeholder={placeholder}
        spellCheck={false}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </>
  )
}
