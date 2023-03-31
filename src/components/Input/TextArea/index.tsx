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
    display: flex;
    align-items: center;
    position: relative;

    &.error-input {
      border-color: #bf2525;
    }
    textarea {
      background: #24262e;
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      border-radius: 8px;

      width: 100%;
      outline: none;
      border: none;
      color: #ffffff;
      font-family: 'Inter';
      padding: 0;
      padding: 14px 16px;
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
    position: absolute;
    top: 16px;
    right: 16px;
  }
  .error-msg {
    color: #bf2525;
    font-size: 12px;
    margin-top: 6px;
  }
`
export default function TextArea({
  rows = 5,
  label,
  value,
  onChange,
  type = 'text',
  autoFocus,
  endIcon,
  placeholder,
  required,
  errorMsg,
}: {
  value: any
  onChange: (value: string) => void
  label?: string
  rows?: number
  type?: React.HTMLInputTypeAttribute
  autoFocus?: boolean
  endIcon?: any
  placeholder?: string
  required?: boolean
  errorMsg?: string
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
      <div className={`${errorMsg ? 'error-input' : ''} input`}>
        <textarea
          placeholder={placeholder}
          autoFocus={autoFocus}
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          spellCheck={false}
        />
        {endIcon && <div className="input-end-icon">{endIcon}</div>}
      </div>
      {errorMsg && <div className="error-msg">{errorMsg}</div>}
    </Wrap>
  )
}
