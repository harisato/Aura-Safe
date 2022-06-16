import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import { sm, boldFont, bgBox, borderLinear } from 'src/theme/variables'
import { GenericModal } from '@gnosis.pm/safe-react-components'
import Button from 'src/components/layout/Button'

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const BackIcon = styled(IconButton)`
  color: #98989b;
  padding: ${sm};
  margin-right: 5px;
`
const EmphasisLabel = styled.span`
  font-weight: ${boldFont};
`

const ButtonContainer = styled.div`
  text-align: center;
`

const StyledGenericModal = styled(GenericModal)`
  background-color: ${bgBox};
`

const StyledButtonBorder = styled(Button)``

export { LoaderContainer, BackIcon, EmphasisLabel, ButtonContainer, StyledGenericModal, StyledButtonBorder }
