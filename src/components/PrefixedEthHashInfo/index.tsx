import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { getChainInfo } from 'src/config'
import { copyShortNameSelector, showShortNameSelector } from 'src/logic/appearance/selectors'
import { parsePrefixedAddress } from 'src/utils/prefixedAddress'
import { StyledPrefixedEthHashInfo } from './styles'

type Props = Omit<Parameters<typeof StyledPrefixedEthHashInfo>[0], 'shouldShowShortName' | 'shouldCopyShortName'>

const PrefixedEthHashInfo = ({ hash, ...rest }: any): ReactElement => {
  const showChainPrefix = useSelector(showShortNameSelector)
  const copyChainPrefix = useSelector(copyShortNameSelector)
  const { address } = parsePrefixedAddress(hash)
  const chainInfo = getChainInfo()

  return (
    <StyledPrefixedEthHashInfo
      hash={address}
      className="ethInfo"
      shortName={chainInfo.shortName}
      shouldShowShortName={showChainPrefix}
      shouldCopyShortName={copyChainPrefix}
      {...rest}
    />
  )
}

export default PrefixedEthHashInfo
