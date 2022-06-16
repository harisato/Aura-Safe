import { ReactElement } from 'react'
import { UnStyledButton } from './styles'
type Props = {
  onClick?: () => void
  children: ReactElement
  dataTestId?: string
}

const ButtonHelper = ({ onClick = () => undefined, children, dataTestId }: Props): React.ReactElement => {
  return (
    <UnStyledButton onClick={onClick} type={'button'} data-testid={dataTestId}>
      {children}
    </UnStyledButton>
  )
}

export default ButtonHelper
