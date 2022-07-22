import { Button, IconType } from '@aura/safe-aura-components'
import { ThemeButtonSize, ThemeIconSize, ThemeTextSize } from '@aura/safe-aura-components/dist/theme'
import { ReactNode } from 'react'
import { borderLinear } from 'src/theme/variables'
import styled from 'styled-components'

const StyledButton = styled(Button)`
  border: 2px solid transparent;
  background-image: ${borderLinear};
  background-origin: border-box;
  background-clip: content-box, border-box;
  border-radius: 50px !important;
  padding: 0 !important;
  background-color: transparent !important;
  min-width: 112px !important;
  svg {
    margin-right: 5px;
  }
`

declare type Colors = 'primary' | 'secondary' | 'error'
declare type Variations = 'bordered' | 'contained' | 'outlined'

type Props = {
  onClick?: () => void
  children?: ReactNode
  iconType?: keyof IconType
  disabled?: boolean
  color?: Colors
  variant?: Variations
  size: ThemeButtonSize
  textSize?: ThemeTextSize
  iconSize?: ThemeIconSize
}

const ButtonGradient = ({ onClick = () => undefined, children, disabled, ...props }: Props): React.ReactElement => {
  return (
    <StyledButton disabled={disabled} onClick={onClick} {...props}>
      {children}
    </StyledButton>
  )
}

export default ButtonGradient
