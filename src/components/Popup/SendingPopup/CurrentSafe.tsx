import { useSelector } from 'react-redux'

import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { getExplorerInfo } from 'src/config'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'

const CurrentSafe = (): React.ReactElement => {
  const { address: safeAddress, name: safeName } = useSelector(currentSafeWithNames)

  return (
    <>
      <PrefixedEthHashInfo
        hash={safeAddress}
        name={safeName}
        explorerUrl={getExplorerInfo(safeAddress)}
        showAvatar
        showCopyBtn
      />
    </>
  )
}

export default CurrentSafe
