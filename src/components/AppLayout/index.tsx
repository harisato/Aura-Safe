import { useState } from 'react'
import { useLocation, matchPath } from 'react-router-dom'
import { ListItemType } from 'src/components/List'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { MobileNotSupported } from './MobileNotSupported'
import { SAFE_ROUTES, WELCOME_ROUTE } from 'src/routes/routes'
import { Container, HeaderWrapper, BodyWrapper, SidebarWrapper, ContentWrapper } from './styles'

type Props = {
  sidebarItems: ListItemType[]
  safeAddress?: string
  safeName?: string
  balance?: string
  granted: boolean
  onToggleSafeList: () => void
  onReceiveClick: () => void
  onNewTransactionClick: () => void
  onConnectClick: () => void
}

const Layout: React.FC<Props> = ({
  balance,
  safeAddress,
  safeName,
  granted,
  onToggleSafeList,
  onReceiveClick,
  onNewTransactionClick,
  children,
  sidebarItems,
  onConnectClick,
}): React.ReactElement => {
  const [mobileNotSupportedClosed, setMobileNotSupportedClosed] = useState(false)
  const { pathname } = useLocation()
  const closeMobileNotSupported = () => setMobileNotSupportedClosed(true)
  const hasFooter = !!matchPath(pathname, {
    path: [SAFE_ROUTES.SETTINGS, WELCOME_ROUTE],
  })

  return (
    <Container>
      <HeaderWrapper>
        <Header openConnectWallet={onConnectClick} onToggleSafeList={onToggleSafeList} />
      </HeaderWrapper>
      <BodyWrapper>
        <SidebarWrapper data-testid="sidebar">
          <Sidebar
            items={sidebarItems}
            safeAddress={safeAddress}
            safeName={safeName}
            balance={balance}
            granted={granted}
            onToggleSafeList={onToggleSafeList}
            onReceiveClick={onReceiveClick}
            onNewTransactionClick={onNewTransactionClick}
          />
        </SidebarWrapper>
        <ContentWrapper>
          <div>{children}</div>
          {hasFooter && <Footer />}
        </ContentWrapper>
      </BodyWrapper>

      {!mobileNotSupportedClosed && <MobileNotSupported onClose={closeMobileNotSupported} />}
    </Container>
  )
}

export default Layout
