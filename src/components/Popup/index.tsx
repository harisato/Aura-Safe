import { Modal } from '@material-ui/core'
import { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

const PopupWrapper = styled(Modal)`
  & {
    align-items: center;
    flex-direction: column;
    display: flex;
    overflow-y: scroll;
  }
  .overlay {
    background-color: rgba(19, 20, 25, 0.7) !important;
  }
  .paper {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 12px;
    background-color: #24262e;
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
  title?: string
  keepMounted?: boolean
}

const Popup = ({
  children,
  description,
  handleClose,
  open,
  paperClassName,
  title,
  keepMounted = false,
}: PopupProps): ReactElement => {
  return (
    <PopupWrapper
      BackdropProps={{ className: 'overlay' }}
      aria-describedby={description}
      aria-labelledby={title}
      onClose={handleClose}
      open={open}
      keepMounted={keepMounted}
    >
      <div className={`paper ${paperClassName}`}>{children}</div>
    </PopupWrapper>
  )
}

export { Popup }
