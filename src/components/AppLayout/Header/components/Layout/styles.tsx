import { headerHeight, md, screenSm, sm } from 'src/theme/variables'
import styled from 'styled-components'
export const styles = () => ({
  root: {
    backgroundColor: '#121212',
    borderRadius: sm,
    boxShadow: '0 0 10px 0 rgba(33, 48, 77, 0.1)',
    marginTop: '11px',
    minWidth: '280px',
    padding: 0,
  },
  summary: {
    alignItems: 'center',
    backgroundColor: '#121212',
    flexWrap: 'nowrap',
    height: headerHeight,
    position: 'fixed',
    width: '100%',
    zIndex: 1301,
  },
  logo: {
    flexShrink: '0',
    flexGrow: '0',
    padding: sm,
    marginTop: '4px',
    [`@media (min-width: ${screenSm}px)`]: {
      maxWidth: 'none',
      paddingLeft: md,
      paddingRight: md,
    },
  },
  link: {
    textDecoration: 'none',
  },
  wallet: {
    paddingRight: md,
  },
  popper: {
    zIndex: 1301,
  },
  network: {
    backgroundColor: 'white',
    borderRadius: sm,
    boxShadow: '0 0 10px 0 rgba(33, 48, 77, 0.1)',
    marginTop: '11px',
    minWidth: '180px',
    padding: '0',
  },
  menu: {
    color: 'white',
    marginLeft: 20,
  },
})

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`