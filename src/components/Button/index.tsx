import { Button } from '@aura/safe-react-components'
import styled from 'styled-components'
import { borderLinear, colorLinear } from 'src/theme/variables'

export const OutlinedButton = ({ children, ...rest }) => {
  return (
    <OutlinedButtonWrap {...rest}>
      <div>{children}</div>
    </OutlinedButtonWrap>
  )
}
export const OutlinedButtonWrap = styled.button<{ disabled?: boolean }>`
  cursor: pointer;
  border: 1px solid transparent;
  background-image: ${borderLinear};
  background-origin: border-box;
  background-clip: content-box, border-box;
  background-color: transparent !important;
  padding: 0 !important;
  border-radius: 8px;
  font-weight: 400;
  font-family: 'Inter';
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.01em;
  color: #fff;
  white-space: nowrap;

  &:disabled {
    cursor: not-allowed;
    pointer-events: unset;
    color: #717582;
    background-image: linear-gradient(rgba(19, 20, 25, 1), rgba(19, 20, 25, 1)),
      linear-gradient(108.46deg, #23534b 12.51%, #45475b 51.13%, #5c4326 87.49%);
    > div {
      background: #131419;
    }
  }
  > div {
    padding: 10px 24px;
    border-radius: 8px;

    > i,
    img,
    svg,
    .icon {
      margin: 0px -14px;
    }
  }

  &:hover {
    > div {
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
        linear-gradient(113.1deg, #5ee6d0 13.45%, #bfc6ff 50.33%, #ffba69 85.05%);
    }
  }
  &:active {
    > div {
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
        linear-gradient(113.1deg, #5ee6d0 13.45%, #bfc6ff 50.33%, #ffba69 85.05%);
    }
  }

  &.small {
    font-size: 12px;
    line-height: 16px;
    > div {
      padding: 8px 16px;
      border-radius: 8px;

      > i,
      img,
      svg,
      .icon {
        margin: 0px -8px;
      }
    }
  }
`

export const OutlinedNeutralButton = styled.button<{ disabled?: boolean }>`
  background: transparent;
  cursor: pointer;
  border: 1px solid #717582;
  border-radius: 8px;
  font-weight: 400;
  font-family: 'Inter';
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.01em;
  color: #fff;
  white-space: nowrap;
  padding: 10px 24px;
  > i,
  img,
  svg,
  .icon {
    margin: 0px -14px;
  }
  &:disabled {
    cursor: not-allowed;
    pointer-events: unset;
    background: #494c58;
  }
  &:not(:disabled)&:hover {
    background: #363843;
  }
  &:active {
    background: #24262e;
  }
  &.loading {
    pointer-events: unset;
    background: #24262e;
  }
  &.small {
    font-size: 12px;
    line-height: 16px;
    padding: 8px 16px;
    > i,
    img,
    svg,
    .icon {
      margin: 0px -8px;
    }
  }
`
export const TextButton = styled(Button)`
  border: none;
  padding: 0 !important;
  min-width: 130px !important;
  background-color: transparent !important;
  box-shadow: none !important;
`
export const LinkButton = styled.button`
  border: none;
  padding: 0 !important;
  background-color: transparent !important;
  box-shadow: none !important;
  color: #5ee6d0;
  text-decoration: underline;
  cursor: pointer;
`
export const FilledButton = styled.button<{ disabled?: boolean }>`
  cursor: pointer;
  background: linear-gradient(113.1deg, #5ee6d0 13.45%, #bfc6ff 50.33%, #ffba69 85.05%);
  border-radius: 8px;
  font-weight: 400;
  font-family: 'Inter';
  font-size: 16px;
  line-height: 20px;
  padding: 10px 24px;
  text-align: center;
  letter-spacing: 0.01em;
  color: #131419;
  border: none;
  white-space: nowrap;
  > i,
  img,
  svg,
  .icon {
    margin: 0px -14px;
  }
  &:disabled {
    cursor: not-allowed;
    pointer-events: unset;
    background: #494c58;
  }
  &:not(:disabled)&:hover {
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.44), rgba(255, 255, 255, 0.44)),
      linear-gradient(113.1deg, #5ee6d0 13.45%, #bfc6ff 50.33%, #ffba69 85.05%);
  }
  &:active {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.24)),
      linear-gradient(94.25deg, #5ee6d0 4.18%, #bfc6ff 50.06%, #ffba69 93.26%);
  }
  &.loading {
    pointer-events: unset;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.24)),
      linear-gradient(94.25deg, #5ee6d0 4.18%, #bfc6ff 50.06%, #ffba69 93.26%);
  }
  &.small {
    font-size: 12px;
    line-height: 16px;
    padding: 8px 16px;
    > i,
    img,
    svg,
    .icon {
      margin: 0px -8px;
    }
  }
`
