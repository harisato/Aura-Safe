import { Text } from '@aura/safe-react-components'
import { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'
type InfoDetailsProps = {
  children: ReactNode
  title: string
  quanlity?: string
}

const TextStyled = styled(Text)`
  font-weight: 600;
`

export const InfoDetails = ({ children, title, quanlity }: InfoDetailsProps): ReactElement => {
  return (
    <>
      <TextStyled size="lg" strong color="white">
        {title === 'Send' && (
          <>
            Send <span style={{ color: 'rgba(94, 230, 208, 1)' }}>{quanlity}</span> to:
          </>
        )}
        {title === 'Received' && (
          <>
            Received <span style={{ color: 'rgba(94, 230, 208, 1)' }}>{quanlity}</span> to:
          </>
        )}
      </TextStyled>
      {children}
    </>
  )
}
