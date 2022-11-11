import styled from 'styled-components'
import MuiTextField from '@material-ui/core/TextField'
import React from 'react'
import { colorLinear } from 'src/theme/variables'
import { formatNumber, isNumberKeyPress, validateFloatNumber } from 'src/utils'

export const StyledTextField = styled(MuiTextField)`
  width: 100%;
  > label {
    z-index: 1;
    font-size: 14px;
    transform: translate(12px, 18px) scale(1);
  }
  .MuiInputLabel-filled.MuiInputLabel-shrink {
    transform: translate(12px, 8px) scale(0.85);
    height: 16px;
  }
  .MuiInputLabel-filled.MuiInputLabel-shrink.Mui-focused {
    color: #5ee6d0;
  }
  > div {
    background: #24262e;
    border: 1px solid #494c58;
    color: #fff;
    border-radius: 8px;
    &:hover {
      background: #24262e;
    }
  }
  > div.Mui-focused {
    background: linear-gradient(#24262e, #24262e) padding-box, ${colorLinear} border-box;
    border: 1px solid transparent;
  }
  input {
    color: #fff;
    padding: 22px 12px 8px;
    height: 18px;
    font-size: 14px;
  }
  > div::after,
  > div::before {
    display: none;
  }
`
export default function TextField({
  label,
  value,
  onChange,
  type = 'text',
  autoFocus,
}: {
  label: string
  value: any
  onChange: (value: string) => void
  type?: React.HTMLInputTypeAttribute
  autoFocus?: boolean
}) {
  return (
    <StyledTextField
      autoFocus={autoFocus}
      variant="filled"
      label={label}
      type={type}
      value={value}
      onKeyPress={type == 'number' ? isNumberKeyPress : undefined}
      inputProps={type == 'number' ? { inputMode: 'numeric', pattern: '[0-9]*', step: '0.0000001' } : {}}
      onChange={(event) =>
        type == 'number' ? onChange(formatNumber(event.target.value)) : onChange(event.target.value)
      }
    />
  )
}
