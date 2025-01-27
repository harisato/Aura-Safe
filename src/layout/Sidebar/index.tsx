import styled from 'styled-components'
import { Divider } from '@aura/safe-react-components'

import List, { ListItemType } from 'src/components/List'
import SafeHeader from './SafeHeader'

const StyledDivider = styled(Divider)`
  margin: 16px -8px 0;
  border-top: 1px solid #404047;
`

type Props = {
  safeAddress?: string
  safeName?: string
  balance?: string
  granted: boolean
  onToggleSafeList: () => void
  onReceiveClick: () => void
  onNewTransactionClick: () => void
  items: ListItemType[]
}

const Sidebar = ({
  items,
  balance,
  safeAddress,
  safeName,
  granted,
  onToggleSafeList,
  onReceiveClick,
  onNewTransactionClick,
}: Props): React.ReactElement => (
  <>
    <SafeHeader
      address={safeAddress}
      safeName={safeName}
      granted={granted}
      balance={balance}
      onToggleSafeList={onToggleSafeList}
      onReceiveClick={onReceiveClick}
      onNewTransactionClick={onNewTransactionClick}
    />

    {items.length ? (
      <>
        <List items={items} />
      </>
    ) : null}
  </>
)

export default Sidebar
