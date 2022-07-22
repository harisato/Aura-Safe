import { Text } from '@aura/safe-aura-components'
import { ReactElement, ReactNode } from 'react'

type InfoDetailsProps = {
  children: ReactNode
  title: string
}

export const InfoDetails = ({ children, title }: InfoDetailsProps): ReactElement => (
  <>
    <Text size="xl" strong color="white">
      {title}
    </Text>
    {children}
  </>
)
