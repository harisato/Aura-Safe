import { Modal } from '@material-ui/core'
import { ReactElement, ReactNode } from 'react'
import { bgBox } from 'src/theme/variables'
import styled from 'styled-components'

const PopupWrapper = styled(Modal)`
  & {
    align-items: center;
    flex-direction: column;
    display: flex;
    overflow-y: scroll;
  }
  .overlay {
    background-color: rgba(0, 0, 0, 0.7) !important;
  }
  .paper {
    position: relative;
    top: 68px;
    border-radius: 12px;
    background-color: ${bgBox};
    display: flex;
    flex-direction: column;
    &:focus {
      outline: none;
    }
  }
`

interface PopupProps {
  children: ReactNode
  description?: string
  handleClose?: (event: Record<string, unknown>, reason: 'backdropClick' | 'escapeKeyDown') => void
  open: boolean
  paperClassName?: string
  title: string
}

const Popup = ({ children, description, handleClose, open, paperClassName, title }: PopupProps): ReactElement => {
  return (
    <PopupWrapper
      BackdropProps={{ className: 'overlay' }}
      aria-describedby={description}
      aria-labelledby={title}
      onClose={handleClose}
      open={open}
    >
      <div className={`paper ${paperClassName}`}>{children}</div>
    </PopupWrapper>
  )
}

export { Popup }
