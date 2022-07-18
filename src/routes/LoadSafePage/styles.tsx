import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import { secondary, sm } from 'src/theme/variables'
const BackIcon = styled(IconButton)`
  color: ${secondary};
  padding: ${sm};
  margin-right: 5px;
`

export { BackIcon }
