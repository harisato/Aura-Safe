import styled from 'styled-components'
import { Card } from '@aura/safe-react-components'
import { bgBox } from 'src/theme/variables'

export const styles = () => ({
  logo: {
    justifyContent: 'center',
  },
  text: {
    letterSpacing: '-0.6px',
    flexGrow: 1,
    textAlign: 'center',
  },
  connect: {
    textAlign: 'center',
    marginTop: '60px',
  },
  connectText: {
    letterSpacing: '1px',
  },
  img: {
    margin: '0px 2px',
  },
})

export const StyledCard = styled(Card)`
  padding: 20px;
  background-color: ${bgBox};
`
