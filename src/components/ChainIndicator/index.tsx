import React from 'react'
import { CircleDot } from 'src/layout/Header/components/CircleDot/CircleDot'
import { getChainById } from 'src/config'
import { ChainId } from 'src/config/chain.d'
import { Wrapper } from './styles'
interface Props {
  chainId: ChainId
  noLabel?: boolean
}

const ChainIndicator = ({ chainId, noLabel }: Props): React.ReactElement => {
  return (
    <Wrapper>
      <CircleDot networkId={chainId} />
      {!noLabel && getChainById(chainId).chainName}
    </Wrapper>
  )
}

export default ChainIndicator
