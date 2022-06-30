import styled from 'styled-components'
import { Divider } from '@gnosis.pm/safe-react-components'

import List, { ListItemType } from 'src/components/List'
import SafeHeader from './SafeHeader'
import DebugToggle from './DebugToggle'
import { IS_PRODUCTION } from 'src/utils/constants'

const StyledDivider = styled(Divider)`
  margin: 16px -8px 0;
  border-top: 1px solid #3e3f40;
`

const HelpContainer = styled.div`
  margin-top: auto;
`

// const HelpCenterLink = styled.a`
//   height: 30px;
//   width: 166px;
//   padding: 6px 0 8px 16px;
//   margin: 14px 0px;
//   text-decoration: none;
//   display: block;

//   &:hover {
//     border-radius: 8px;
//     background-color: ${({ theme }) => theme.colors.background};
//     box-sizing: content-box;
//   }
//   p {
//     font-family: ${({ theme }) => theme.fonts.fontFamily};
//     font-size: 0.76em;
//     font-weight: 600;
//     line-height: 1.5;
//     letter-spacing: 1px;
//     color: ${({ theme }) => theme.colors.placeHolder};
//     text-transform: uppercase;
//     padding: 0 0 0 4px;
//   }
// `
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
        <StyledDivider />
        <List items={items} />
      </>
    ) : null}
  </>
)

export default Sidebar
