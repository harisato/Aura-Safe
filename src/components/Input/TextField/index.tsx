import React, { useState } from 'react'
import { colorLinear } from 'src/theme/variables'
import styled from 'styled-components'
const Wrap = styled.div`
  &.focused {
    .input {
      background: linear-gradient(#24262e, #24262e) padding-box, ${colorLinear} border-box;
      border: 1px solid transparent;
    }
  }
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
    &.error-input {
      border-color: #bf2525;
    }
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
  .error-msg {
    color: #bf2525;
    font-size: 12px;
    margin-top: 6px;
  }
  .disabled-input {
    background: #494c58;
    border: 1px solid #494c58;
    input {
      background: #494c58;
    }
  }
`
export default function TextField({
  label,
  value,
  onChange,
  type = 'text',
  autoFocus,
  endIcon,
  placeholder,
  required,
  errorMsg,
  min,
  disabled,
}: {
  label: string
  value: any
  onChange?: (value: string) => void
  type?: React.HTMLInputTypeAttribute
  autoFocus?: boolean
  endIcon?: any
  placeholder?: string
  required?: boolean
  errorMsg?: string
  min?: number
  disabled?: boolean
}) {
  const [isFocus, setIsFocus] = useState(false)
  return (
    <Wrap className={isFocus ? 'focused' : ''}>
      {label && (
        <div className="input-label">
          {label}
          {required && <span style={{ color: '#bf2525' }}>*</span>}
        </div>
      )}
      <div className={`${errorMsg ? 'error-input' : ''}  ${disabled ? 'disabled-input' : ''} input`}>
        <input
          placeholder={placeholder}
          autoFocus={autoFocus}
          value={value}
          type={type}
          onChange={(e) => onChange && onChange(e.target.value)}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          min={min}
          disabled={disabled}
        />
        {endIcon && <div className="input-end-icon">{endIcon}</div>}
      </div>
      {errorMsg && <div className="error-msg">{errorMsg}</div>}
    </Wrap>
  )
}
