import { useState } from 'react'
import { useLocation, matchPath } from 'react-router-dom'
import { ListItemType } from 'src/components/List'
import Header from './Header'
import Footer from './Footer'
import { MobileNotSupported } from 'src/layout/MobileNotSupported'
import { SAFE_ROUTES, WELCOME_ROUTE } from 'src/routes/routes'
import { Container, HeaderWrapper, BodyWrapper, SidebarWrapper, ContentWrapper } from './styles'
import Sidebar from 'src/layout/Sidebar'

type Props = {
  sidebarItems: ListItemType[]
  safeAddress?: string
  safeName?: string
  balance?: string
  granted: boolean
  onToggleSafeList: () => void
  onReceiveClick: () => void
  onConnectClick: () => void
}

const Layout: React.FC<Props> = ({
  balance,
  safeAddress,
  safeName,
  granted,
  onToggleSafeList,
  onReceiveClick,
  children,
  sidebarItems,
  onConnectClick,
}): React.ReactElement => {
  const { pathname } = useLocation()
  const hasFooter = !!matchPath(pathname, {
    path: [SAFE_ROUTES.SETTINGS, WELCOME_ROUTE],
  })

  if (window.innerWidth <= 720) {
    return <MobileNotSupported />
  }

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
          />
        </SidebarWrapper>
        <ContentWrapper>
          <div>{children}</div>
          {hasFooter && <Footer />}
        </ContentWrapper>
      </BodyWrapper>
    </Container>
  )
}

export default Layout
