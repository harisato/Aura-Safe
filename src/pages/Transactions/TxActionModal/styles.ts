import { OutlinedNeutralButton } from 'src/components/Button'
import styled from 'styled-components'

export const TxContent = styled.div`
  background: #363843;
  border-radius: 4px;
  padding: 16px;
  > div {
    display: flex;
    justify-content: space-between;
    &:not(:first-child) {
      margin-top: 8px;
    }
  }
  .divider {
    width: 100%;
    height: 2px;
    background: #404047;
  }
  .label,
  .value {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #ffffff;
  }
`
export const DeleteButton = styled(OutlinedNeutralButton)`
  border-color: #d5625e;
  color: #d5625e;
  &:not(:disabled)&:hover {
    background: #382323;
  }
`
