import { makeStyles } from '@material-ui/core/styles'
import * as React from 'react'
import Col from 'src/components/layout/Col'
import Img from 'src/components/layout/Img'
import WALLET_ICONS from '../../assets/icons'
import { styles } from './styles'
const useStyles = makeStyles(styles)

interface WalletIconProps {
  provider: string
}

const WalletIcon = ({ provider }: WalletIconProps): React.ReactElement => {
  const classes = useStyles()
  const walletIcon = WALLET_ICONS[provider]

  return (
    <Col className={classes.container} start="sm">
      {walletIcon && <Img alt={provider} className={classes.icon} {...walletIcon} />}
    </Col>
  )
}

export default WalletIcon
