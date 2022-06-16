import styled from 'styled-components'
import Block from 'src/components/layout/Block'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { lg } from 'src/theme/variables'

const Container = styled(Block)`
  padding: ${lg};
`

const StyledDialogContent = styled(DialogContent)`
  min-width: 500px;
`

const StyledDialogTitle = styled(DialogTitle)`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
`
const SwitchNetworkContainer = styled.div`
  margin: ${lg};
  display: flex;
  justify-content: center;
`
const NetworkLabelItem = styled.div`
  display: flex;
  margin: ${lg} auto;
  cursor: pointer;
  max-width: 50%;

  & > span {
    font-size: 13px;
  }
`

export { Container, StyledDialogContent, StyledDialogTitle, NetworkLabelItem, SwitchNetworkContainer }
