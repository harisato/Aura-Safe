import { useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'
import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'

import { getShortName } from 'src/config'
import { ListItemType } from 'src/components/List'
import ListIcon from 'src/layout/Sidebar/ListIcon'
import { currentSafeFeaturesEnabled, currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'
import {
  extractSafeAddress,
  ADDRESSED_ROUTE,
  SAFE_SUBSECTION_ROUTE,
  generatePrefixedAddressRoutes,
} from 'src/routes/routes'
import { hasFeature } from 'src/logic/safe/utils/safeVersion'
import path from 'path'

const useSidebarItems = (): ListItemType[] => {
  const featuresEnabled = useSelector(currentSafeFeaturesEnabled)
  const safeAppsEnabled = hasFeature(FEATURES.SAFE_APPS)
  // const isCollectiblesEnabled = hasFeature(FEATURES.ERC721)
  // const isSpendingLimitEnabled = hasFeature(FEATURES.SPENDING_LIMIT)
  const { needsUpdate } = useSelector(currentSafeWithNames)
  const safeAddress = extractSafeAddress()
  const granted = useSelector(grantedSelector)

  const matchSafe = useRouteMatch(ADDRESSED_ROUTE)

  // Question mark makes matching [SAFE_SUBSECTION_SLUG] optional
  const matchSafeWithSidebarSection = useRouteMatch(`${SAFE_SUBSECTION_ROUTE}?`)

  const makeEntryItem = useCallback(
    ({ label, disabled, badge, iconType, href, subItems }) => {
      return {
        label,
        badge,
        disabled,
        icon: <ListIcon type={iconType} />,
        selected: matchSafeWithSidebarSection?.url.includes(href),
        href,
        subItems,
      }
    },
    [matchSafeWithSidebarSection],
  )

  return useMemo((): ListItemType[] => {
    if (!matchSafe || !matchSafeWithSidebarSection || !featuresEnabled || !safeAddress) {
      return []
    }

    const currentSafeRoutes = generatePrefixedAddressRoutes({
      shortName: getShortName(),
      safeAddress,
    })

    const settingsSubItems = [
      makeEntryItem({
        label: 'Safe Details',
        badge: needsUpdate && granted,
        iconType: 'info',
        href: currentSafeRoutes.SETTINGS_DETAILS,
      }),
    ]
    const smartContractSubItems = [
      makeEntryItem({
        label: 'Contract Interaction',
        badge: needsUpdate && granted,
        iconType: 'info',
        href: currentSafeRoutes.CONTRACT_INTERACTION,
      }),
    ]
    const advancedSubItems = [
      makeEntryItem({
        label: 'Custom Transaction',
        badge: needsUpdate && granted,
        iconType: 'info',
        href: currentSafeRoutes.CUSTOM_TRANSACTION,
      }),
    ]

    return [
      makeEntryItem({
        label: 'Assets',
        iconType: 'assestAura',
        href: currentSafeRoutes.ASSETS_BALANCES,
      }),
      makeEntryItem({
        label: 'Transactions',
        iconType: 'transactionsAura',
        href:
          window.location.pathname === currentSafeRoutes.TRANSACTIONS_HISTORY
            ? currentSafeRoutes.TRANSACTIONS_HISTORY
            : currentSafeRoutes.TRANSACTIONS_QUEUE,
      }),
      makeEntryItem({
        label: 'Staking',
        iconType: 'stakingAura',
        href: currentSafeRoutes.STAKING,
      }),
      makeEntryItem({
        label: 'Voting',
        iconType: 'votingAura',
        href: currentSafeRoutes.VOTING,
      }),
      makeEntryItem({
        label: 'Smart Contract',
        iconType: 'smartContractAura',
        href: currentSafeRoutes.CONTRACT_INTERACTION,
        subItems: smartContractSubItems,
      }),
      makeEntryItem({
        label: 'Advanced',
        iconType: 'smartContractAura',
        href: currentSafeRoutes.CUSTOM_TRANSACTION,
        subItems: advancedSubItems,
      }),
      makeEntryItem({
        label: 'Address Book',
        iconType: 'addressbookAura',
        href: currentSafeRoutes.ADDRESS_BOOK,
      }),
      makeEntryItem({
        label: 'Settings',
        iconType: 'settingsAura',
        href: currentSafeRoutes.SETTINGS_DETAILS,
        subItems: settingsSubItems,
      }),
    ]
  }, [
    featuresEnabled,
    granted,
    // isCollectiblesEnabled,
    // isSpendingLimitEnabled,
    makeEntryItem,
    matchSafe,
    matchSafeWithSidebarSection,
    needsUpdate,
    safeAddress,
    safeAppsEnabled,
  ])
}

export { useSidebarItems }
