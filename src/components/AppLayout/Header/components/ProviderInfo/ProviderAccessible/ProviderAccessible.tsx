import { makeStyles } from '@material-ui/core/styles'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { Text } from '@aura/safe-react-components'

import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import WalletIcon from '../../WalletIcon'
import { KeyRing } from 'src/components/AppLayout/Header/components/KeyRing/KeyRing'
import { networkSelector } from 'src/logic/wallets/store/selectors'
import { getChainById } from 'src/config'
import { styles } from './styles'

const useStyles = makeStyles(styles)

interface ProviderInfoProps {
  connected: boolean
  provider: string
  // TODO: [xDai] Review. This may cause some issues with EthHashInfo.
  userAddress: string
}

const ProviderInfo = ({ connected, provider, userAddress }: ProviderInfoProps): React.ReactElement => {
  const classes = useStyles()
  const currentNetwork = useSelector(networkSelector)
  const chain = getChainById(currentNetwork)
  const addressColor = connected ? 'white' : 'warning'
  return (
    <>
      {!connected && <KeyRing circleSize={35} dotRight={11} dotSize={16} dotTop={24} keySize={14} mode="warning" />}
      <WalletIcon provider={provider.toUpperCase()} />
      <Col className={classes.account} layout="column" start="sm">
        <Paragraph
          className={classes.network}
          noMargin
          size="md"
          transform="capitalize"
          color="white"
          weight="regular"
          data-testid="connected-wallet"
        >
          {provider}
          {chain?.chainName && ` @ ${chain.chainName}`}
        </Paragraph>
        <div className={classes.providerContainer}>
          {connected ? (
            <PrefixedEthHashInfo
              hash={userAddress}
              shortenHash={4}
              showAvatar
              avatarSize="sm"
              textColor={addressColor}
              textSize="md"
            />
          ) : (
            <Text size="md" color={addressColor}>
              Connection Error
            </Text>
          )}
        </div>
      </Col>
    </>
  )
}

export default ProviderInfo
