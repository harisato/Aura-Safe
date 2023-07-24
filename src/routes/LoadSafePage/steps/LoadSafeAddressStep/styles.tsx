import { lg, green } from 'src/theme/variables'
import styled from 'styled-components'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Block from 'src/components/layout/Block'

const Container = styled(Block)`
  padding: ${lg};
`

const FieldContainer = styled(Block)`
  display: flex;
  max-width: 480px;
  margin-top: 12px;
`

const CheckIconAddressAdornment = styled(CheckCircle)`
  color: #03ae60;
  height: 20px;
`
export { Container, FieldContainer, CheckIconAddressAdornment }
