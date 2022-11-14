import { createStyles } from '@material-ui/core'
import { borderLinear } from 'src/theme/variables'
import styled from 'styled-components'
import { Text, Button } from '@aura/safe-react-components'

export const Wrapper = styled.div`
  border-radius: 12px;
  overflow: hidden;
  > .stake-management {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #363843;
    padding: 24px;
    > div.balance {
      width: 100%;
      max-width: 444px;
      margin-right: 16px;
      > div {
        align-items: center;
        display: flex;
        justify-content: space-between;
        p {
          margin: 0;
        }
        > .label {
          font-weight: 500;
          font-size: 14px;
          line-height: 16px;
          color: #b4b8c0;
        }
        > .amount {
          font-size: 16px;
          line-height: 24px;
        }
      }
    }
  }
  .staked-validator {
    background: #24262e;
    padding: 0px 24px 24px;
    margin-top: 30px;
  }
  .validator-cell {
    display: flex;
    align-items: center;
    > img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
  }
`
