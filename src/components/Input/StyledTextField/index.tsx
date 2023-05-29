import styled from 'styled-components'
import MuiTextField from '@material-ui/core/TextField'
import { colorLinear } from 'src/theme/variables'

export const StyledTextField = styled(MuiTextField)`
  width: 100%;
  label {
    z-index: 1;
    font-size: 14px;
    transform: translate(12px, 18px) scale(1);
  }
  .MuiInputLabel-shrink {
    transform: translate(12px, 8px) scale(0.85);
    height: 16px;
  }
  .MuiInputLabel-shrink.Mui-focused {
    color: #5ee6d0;
  }
  > div {
    background: #24262e;
    border: 1px solid #494c58;
    color: #fff;
    border-radius: 8px;
    padding: 0px !important ;
    &:hover {
      background: #24262e;
    }
  }
  > div.Mui-focused {
    background: linear-gradient(#24262e, #24262e) padding-box, ${colorLinear} border-box;
    border: 1px solid transparent;
    border-radius: 8px;
  }
  input {
    color: #fff;
    padding: 22px 12px 8px !important;
    font-size: 14px;
    height: 18px;
  }
  > div::after,
  > div::before {
    display: none;
  }
  .denom {
    margin-left: 8px;
    color: #fff;
    background: #363843;
    height: 18px;
    margin-right: -12px;
    padding: 14px 8px;
  }
`
