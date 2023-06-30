import { Text, Icon, Button } from '@aura/safe-react-components'
import { useEffect, useRef, ReactElement, useState } from 'react'
import { useHistory } from 'react-router'
import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction'
import styled from 'styled-components'

import { sameAddress } from 'src/logic/wallets/ethAddresses'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { useSelector } from 'react-redux'
import { addressBookName } from 'src/logic/addressBook/store/selectors'
import { setChainId } from 'src/logic/config/utils'
import {
  extractSafeAddress,
  LOAD_SPECIFIC_SAFE_ROUTE,
  SAFE_ROUTES,
  SafeRouteParams,
  ALLOW_SPECIFIC_SAFE_ROUTE,
  CANCEL_SPECIFIC_SAFE_ROUTE,
  generateSafeRoute,
} from 'src/routes/routes'

import { currentChainId } from 'src/logic/config/store/selectors'
import { ChainId } from 'src/config/chain.d'
import { getChainById, getInternalChainId } from 'src/config'
import { SafeStatus } from 'src/logic/safe/hooks/useOwnerSafes'
import { loadFromStorage } from 'src/utils/storage'
import { PendingSafeListStorage } from 'src/routes/CreateSafePage/CreateSafePage'
import {
  FIELD_CREATE_CUSTOM_SAFE_NAME,
  FIELD_CREATE_SUGGESTED_SAFE_NAME,
  SAFES_PENDING_STORAGE_KEY,
} from 'src/routes/CreateSafePage/fields/createSafeFields'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import _ from 'lodash'

const StyledIcon = styled(Icon)<{ checked: boolean }>`
  ${({ checked }) => (checked ? { marginRight: '4px' } : { visibility: 'hidden', width: '28px' })}
`
// background-color: ${({ hovercolor }) => hovercolor || '#cbf1eb'};
const StyledButton = styled(Button)<{ status?: string }>`
  &.MuiButton-root.MuiButton-text {
    padding: 8px 16px;
    min-width: auto;
    height: 100%;

    &:hover {
      ${({ status }) => {
        switch (status) {
          case SafeStatus.Pending:
            return {
              backgroundColor: '#ffaa78',
            }
          case SafeStatus.NeedConfirm:
            return {
              backgroundColor: '#cbf1eb',
            }
          default:
            return {
              backgroundColor: '#fff',
            }
        }
      }};
    }
  }
`

const StyledText = styled(Text)`
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: white;
  margin-top: 13px;
`

const StyledPrefixedEthHashInfo = styled(PrefixedEthHashInfo)`
  & > div > p:first-of-type {
    width: 210px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

type Props = {
  onSafeClick: () => void
  onNetworkSwitch?: () => void
  address: string
  nativeBalance?: string
  showAddSafeLink?: boolean
  pendingStatus?: SafeStatus | undefined
  networkId: ChainId
  shouldScrollToSafe?: boolean
  safeId?: number
}

const SafeListItem = ({
  onSafeClick,
  onNetworkSwitch,
  address,
  nativeBalance,
  showAddSafeLink = false,
  pendingStatus = undefined,
  networkId,
  shouldScrollToSafe = false,
  safeId,
}: Props): ReactElement => {
  const history = useHistory()
  const safeName = useSelector((state) => addressBookName(state, { address, chainId: networkId }))
  const currentSafeAddress = extractSafeAddress()
  const currChainId = useSelector(currentChainId)

  const userAccount = useSelector(userAccountSelector)

  const isCurrentSafe = currChainId === networkId && sameAddress(currentSafeAddress, address)
  const safeRef = useRef<HTMLDivElement>(null)

  const { nativeCurrency, shortName } = getChainById(networkId)
  const internalChainId = getInternalChainId()
  const nativeCurrencySymbol = nativeCurrency?.symbol ?? 'ETH'

  const [pendingSafeName, setPendingSafeName] = useState('')

  useEffect(() => {
    if (isCurrentSafe && shouldScrollToSafe) {
      safeRef?.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isCurrentSafe, shouldScrollToSafe])

  useEffect(() => {
    const saveCallback = async () => {
      const safesPending = await Promise.resolve(
        loadFromStorage<PendingSafeListStorage>(SAFES_PENDING_STORAGE_KEY, `${userAccount}_`),
      )
      const pendingSafe = safesPending?.find((e) => e.id === safeId)

      if (pendingSafe) {
        setPendingSafeName(pendingSafe[FIELD_CREATE_CUSTOM_SAFE_NAME] || pendingSafe[FIELD_CREATE_SUGGESTED_SAFE_NAME])
      }
    }

    saveCallback()
  }, [safeId])

  const routesSlug: SafeRouteParams = {
    shortName,
    safeId: safeId || undefined,
    safeAddress: address,
  }

  const renderButton = (status: SafeStatus) => {
    switch (status) {
      case SafeStatus.NeedConfirm:
        return (
          <StyledButton onClick={handleAllowSafe} size="md" variant="outlined" status={status}>
            <Text size="lg" color="primary">
              Allow
            </Text>
          </StyledButton>
        )

      case SafeStatus.Pending:
        return (
          <StyledButton onClick={handleCancelSafe} size="md" variant="outlined">
            <Text size="lg" color="primary">
              Cancel
            </Text>
          </StyledButton>
        )

      default:
        return (
          <StyledButton size="md" variant="outlined" disabled>
            <Text size="lg" color="primary">
              Allowed
            </Text>
          </StyledButton>
        )
    }
  }

  const hashText = (status: SafeStatus | undefined, address: string): string => {
    switch (status) {
      case SafeStatus.Pending:
        return 'Created by you'
      case SafeStatus.Confirmed:
        return address
          ? 'Created by ' +
              `${_.truncate(address, { length: 13, omission: '...' + address.slice(address.length - 4) })}`
          : ''
      default:
        return address || ''
    }
  }

  const nameText = (status: SafeStatus | undefined, safeName: string): string => {
    switch (status) {
      case SafeStatus.NeedConfirm:
        return 'Created by:'
      case SafeStatus.Pending:
      case SafeStatus.Confirmed:
        return pendingSafeName
      default:
        return safeName || ''
    }
  }

  const handleOpenSafe = (): void => {
    if (pendingStatus) {
      return
    }

    onSafeClick()
    onNetworkSwitch?.()
    history.push(generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, routesSlug))
  }

  const handleLoadSafe = (): void => {
    onSafeClick()
    onNetworkSwitch?.()
    history.push(generateSafeRoute(LOAD_SPECIFIC_SAFE_ROUTE, routesSlug))

    // Navigating to LOAD_SPECIFIC_SAFE_ROUTE doesn't trigger a network switch
    setChainId(networkId)
  }

  const handleAllowSafe = (): void => {
    onSafeClick()
    onNetworkSwitch?.()
    history.push(generateSafeRoute(ALLOW_SPECIFIC_SAFE_ROUTE, routesSlug))

    // Navigating to LOAD_SPECIFIC_SAFE_ROUTE doesn't trigger a network switch
    setChainId(networkId)
  }

  const handleCancelSafe = (): void => {
    onSafeClick()
    onNetworkSwitch?.()
    // CANCEL_SPECIFIC_SAFE_ROUTE
    history.push(
      generateSafeRoute(CANCEL_SPECIFIC_SAFE_ROUTE, {
        ...routesSlug,
        safeAddress: String(internalChainId),
      }),
    )
  }

  return (
    <ListItem button onClick={handleOpenSafe} ref={safeRef}>
      <StyledIcon type="check" size="md" color="primary" checked={isCurrentSafe} />
      <StyledPrefixedEthHashInfo
        hash={hashText(pendingStatus, address)}
        name={nameText(pendingStatus, safeName)}
        shortName={shortName}
        showAvatar
        shortenHash={[SafeStatus.Pending, SafeStatus.Confirmed].includes(pendingStatus!) ? 100 : 4}
      />
      <ListItemSecondaryAction>
        {nativeBalance ? (
          <StyledText size="lg">
            {+nativeBalance > 0 ? formatAmount(nativeBalance) : 0} {nativeCurrencySymbol}
          </StyledText>
        ) : showAddSafeLink ? (
          <StyledButton onClick={handleLoadSafe} size="md" variant="outlined">
            <Text size="lg" color="primary">
              Add Safe
            </Text>
          </StyledButton>
        ) : pendingStatus ? (
          renderButton(pendingStatus)
        ) : null}
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default SafeListItem
