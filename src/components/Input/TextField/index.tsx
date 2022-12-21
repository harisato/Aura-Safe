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
const Wrap = styled.div`
  width: 100%;
  .input-label {
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    margin-bottom: 8px;
  }
  .input {
    background: #24262e;
    border: 1px solid #494c58;
    border-radius: 8px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    input {
      background: #24262e;
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      width: 100%;
      outline: none;
      border: none;
      color: #ffffff;
      font-family: 'Inter';
      padding: 0;
    }
  }
  .input-end-icon {
    height: 24px;
    width: 24px;
    margin: -4px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
`
export default function TextField({
  label,
  value,
  onChange,
  type = 'text',
  autoFocus,
  endIcon,
}: {
  label: string
  value: any
  onChange: (value: string) => void
  type?: React.HTMLInputTypeAttribute
  autoFocus?: boolean
  endIcon?: any
}) {
  return (
    <Wrap>
      {label && <div className="input-label">{label}</div>}
      <div className="input">
        <input autoFocus={autoFocus} value={value} type={type} onChange={(e) => onChange(e.target.value)} />
        {endIcon && <div className="input-end-icon">{endIcon}</div>}
      </div>
    </Wrap>
  )
}
