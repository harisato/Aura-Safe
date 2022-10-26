import { getChainInfo } from 'src/config'
import { HeaderWrapper } from './styles'
import Close from '@material-ui/icons/Close'
import ChainIndicator from 'src/components/ChainIndicator'

export const Header = ({ onClose, title, subTitle }) => {
  const connectedNetwork = getChainInfo()
  return (
    <HeaderWrapper>
      <div>
        <p className="title">{title}</p>
        <p className="sub-title">{subTitle}</p>
      </div>
      <div>
        {connectedNetwork.chainId && <ChainIndicator chainId={connectedNetwork.chainId} />}
        <Close className="close-icon" />
      </div>
    </HeaderWrapper>
  )
}
