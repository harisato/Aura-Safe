import { CopyToClipboardBtn } from '@aura/safe-aura-components'
import { ReactElement } from 'react'
import { generatePath } from 'react-router-dom'

import { getPrefixedSafeAddressSlug, SAFE_ADDRESS_SLUG, SAFE_ROUTES, TRANSACTION_ID_NUMBER, TRANSACTION_ID_SLUG } from 'src/routes/routes'
import { PUBLIC_URL } from 'src/utils/constants'

type Props = {
  safeTxHash: string
}

const TxShareButton = ({ safeTxHash }: Props): ReactElement => {
  try {
    const txDetailsPathname = generatePath(SAFE_ROUTES.TRANSACTIONS_SINGULAR, {
      [SAFE_ADDRESS_SLUG]: getPrefixedSafeAddressSlug(),
      [TRANSACTION_ID_NUMBER]: safeTxHash,
    })
    const txDetailsLink = `${window.location.origin}${PUBLIC_URL}${txDetailsPathname}`
  
    return <CopyToClipboardBtn textToCopy={txDetailsLink} iconType="share" />
  } catch (error) {
    console.log(error)
  }
  return <CopyToClipboardBtn textToCopy={''} iconType="share" />
}

export default TxShareButton
