import { ButtonProps as ButtonPropsMUI } from '@material-ui/core'
import { theme } from '@aura/safe-react-components'
import { ReactNode } from 'react'

type Theme = typeof theme

export interface BodyProps {
  children: ReactNode
  withoutPadding?: boolean
}

export interface GnoModalProps {
  children: ReactNode
  description: string
  // type copied from Material-UI Modal's `close` prop
  handleClose?: (event: Record<string, unknown>, reason: 'backdropClick' | 'escapeKeyDown') => void
  open: boolean
  paperClassName?: string
  title: string
}

export interface TitleProps {
  children: string | ReactNode
  size?: keyof Theme['title']['size']
  withoutMargin?: boolean
  strong?: boolean
}

type CustomButtonMUIProps = Omit<ButtonPropsMUI, 'size' | 'color' | 'variant'> & {
  to?: string
  component?: ReactNode
}

export enum ButtonStatus {
  ERROR = -1,
  DISABLED,
  READY,
  LOADING,
}
interface ButtonProps extends CustomButtonMUIProps {
  text?: string
  status?: ButtonStatus
  size?: keyof Theme['buttons']['size']
  color?: 'primary' | 'secondary' | 'error'
  variant?: 'bordered' | 'contained' | 'outlined'
  testId?: string
}

export interface ButtonsProps {
  cancelButtonProps?: ButtonProps
  confirmButtonProps?: ButtonProps
}

export interface ModalProps {
  children: ReactNode
  description?: string
  handleClose: () => void
  open?: boolean
  title?: string
}

export interface FooterProps {
  children: ReactNode
  withoutBorder?: boolean
  justifyContent?: 'center' | 'flex-end' | 'flex-start'
}

export interface HeaderProps {
  children?: ReactNode
  onClose?: (event: any) => void
}
