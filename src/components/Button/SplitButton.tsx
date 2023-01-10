import styled from 'styled-components'
import Arrow from 'src/assets/icons/arrow-down-black.svg'
import { useState } from 'react'
const Wrap = styled.div`
  display: flex;
  background: linear-gradient(113.1deg, #5ee6d0 13.45%, #bfc6ff 50.33%, #ffba69 85.05%);
  border-radius: 8px;
  position: relative;
  &.disabled {
    background: #494c58;
    * {
      cursor: not-allowed;
      pointer-events: unset;
    }
    > div:not(.options) {
      pointer-events: unset;
      cursor: not-allowed;
      border-left: 1px solid #000;
    }
  }
  > button {
    cursor: pointer;
    background: transparent;
    font-weight: 400;
    font-family: 'Inter';
    border-radius: 8px 0px 0px 8px;
    font-size: 16px;
    line-height: 20px;
    padding: 10px 24px;
    text-align: center;
    letter-spacing: 0.01em;
    color: #131419;
    border: none;
    white-space: nowrap;
    &:hover {
      background: #ffffff5e;
    }
  }
  > div:not(.options) {
    cursor: pointer;
    background: transparent;
    border-left: 1px solid #494c58;
    display: flex;
    align-items: center;
    border-radius: 0px 8px 8px 0px;

    justify-content: center;
    width: 40px;
    &:hover {
      background: #ffffff5e;
    }
  }
  > div.options {
    position: absolute;
    background: #24262e;
    border-radius: 8px;
    top: 50px;
    left: 0;
    right: 0;
    overflow: hidden;
    z-index: 9;
    > button {
      border: none;
      font-family: 'Inter';
      white-space: nowrap;
      display: block;
      width: 100%;
      background: transparent;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      padding: 12px 24px;
      color: #fff;
      &:not(:first-child) {
        border-top: 1px solid #3e3d56;
      }
      &:hover {
        background: #1c1d24;
      }
    }
  }
`

interface IOption {
  label: string
  onClick: () => void
}

interface IProps {
  defaultLabel: string
  defaultOnClick: () => void
  options: IOption[]
  disabled?: boolean
}
export default function SplitButton({ defaultLabel, defaultOnClick, options, disabled }: IProps) {
  const [open, setOpen] = useState(false)
  return (
    <Wrap className={disabled ? 'disabled' : ''}>
      <button onClick={() => (disabled ? null : defaultOnClick())}>{defaultLabel}</button>
      <div onClick={() => (disabled ? null : setOpen(!open))}>
        <img src={Arrow} alt="" />
      </div>
      {open && (
        <div className="options">
          {options.map((option, index) => {
            return (
              <button
                key={index}
                onClick={() => {
                  setOpen(false)
                  option.onClick()
                }}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </Wrap>
  )
}
