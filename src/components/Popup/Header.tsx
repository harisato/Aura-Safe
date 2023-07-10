import { getChainInfo } from 'src/config'
import Close from '@material-ui/icons/Close'
import ChainIndicator from 'src/components/ChainIndicator'
import styled from 'styled-components'
const HeaderWrapper = styled.div`
  padding: 14px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #404047;
  background: #363843;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  > div:nth-child(2) {
    display: flex;
    color: #98989b;
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    > span:nth-child(1) {
      margin-right: 16px;
    }
  }
  .title {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    margin: 0;
  }
  .sub-title {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.01em;
    color: #98989b;
    margin: 2px 0px 0px 0px;
  }
  .close-icon {
    color: #98989b !important;
    cursor: pointer;
  }
`
export default function Header({
  onClose,
  title,
  subTitle,
  hideNetwork,
}: {
  onClose: () => void
  title?: string
  subTitle?: string
  hideNetwork?: boolean
}) {
  const connectedNetwork = getChainInfo()
  return (
    <HeaderWrapper>
      <div>
        <p className="title">{title}</p>
        <p className="sub-title">{subTitle}</p>
      </div>
      <div>
        {connectedNetwork.chainId && !hideNetwork && <ChainIndicator chainId={connectedNetwork.chainId} />}
        <Close onClick={onClose} className="close-icon" />
      </div>
    </HeaderWrapper>
  )
}
