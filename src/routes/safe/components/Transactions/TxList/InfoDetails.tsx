import { Text } from '@aura/safe-react-components'
import { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'
type InfoDetailsProps = {
  children: ReactNode
  title: string
  quantity?: string
}

const TextStyled = styled(Text)`
  font-weight: 600;
  margin-bottom: 10px;
`

export const InfoDetails = ({ children, title, quantity }: InfoDetailsProps): ReactElement => {
  return (
    <>
      <TextStyled size="lg" strong color="white">
        {title === 'Delegate' && (
          <>
            Delegate <span style={{ color: 'rgba(94, 230, 208, 1)' }}>{parseFloat(quantity || '0')}</span> to:
          </>
        )}
        {title === 'Undelegate' && (
          <>
            Undelegate <span style={{ color: 'rgba(94, 230, 208, 1)' }}>{parseFloat(quantity || '0')}</span> from:
          </>
        )}
        {title === 'Redelegate' && (
          <>
            Redelegate <span style={{ color: 'rgba(94, 230, 208, 1)' }}>{parseFloat(quantity || '0')}</span> from:
          </>
        )}
        {title === 'Reward' && (
          <>
            Reward <span style={{ color: 'rgba(94, 230, 208, 1)' }}>{parseFloat(quantity || '0')}</span> from:
          </>
        )}{' '}
        {title === 'Send' && (
          <>
            Send <span style={{ color: 'rgba(94, 230, 208, 1)' }}>{parseFloat(quantity || '0')}</span> to:
          </>
        )}
        {title === 'Received' && (
          <>
            Received <span style={{ color: 'rgba(94, 230, 208, 1)' }}>{parseFloat(quantity || '0')}</span> from:
          </>
        )}{' '}
      </TextStyled>
      {children}
    </>
  )
}
