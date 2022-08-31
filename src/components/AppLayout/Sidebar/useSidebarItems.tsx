import { useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'
import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'

import { getShortName } from 'src/config'
import { ListItemType } from 'src/components/List'
import ListIcon from 'src/components/List/ListIcon'
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
    ({ label, disabled, badge, iconType, href, subItems }) => ({
      label,
      badge,
      disabled,
      icon: <ListIcon type={iconType} />,
      selected: href === matchSafeWithSidebarSection?.url,
      href,
      subItems,
    }),
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

    const assetsSubItems = [
      makeEntryItem({
        label: 'Coins',
        iconType: 'coinAura',
        href: currentSafeRoutes.ASSETS_BALANCES,
      }),
      makeEntryItem({
        disabled: true, // !isCollectiblesEnabled,
        label: 'Collectibles',
        iconType: 'collectibles',
        href: currentSafeRoutes.ASSETS_BALANCES_COLLECTIBLES,
      }),
    ]

    const settingsSubItems = [
      makeEntryItem({
        label: 'Safe Details',
        badge: needsUpdate && granted,
        iconType: 'info',
        href: currentSafeRoutes.SETTINGS_DETAILS,
      }),
      makeEntryItem({
        label: 'Appearance',
        iconType: 'eye',
        href: currentSafeRoutes.SETTINGS_APPEARANCE,
        disabled: true,
      }),
      makeEntryItem({
        label: 'Owners',
        iconType: 'owners',
        href: currentSafeRoutes.SETTINGS_OWNERS,
        disabled: true,
      }),
      makeEntryItem({
        label: 'Policies',
        iconType: 'requiredConfirmations',
        href: currentSafeRoutes.SETTINGS_POLICIES,
        disabled: true,
      }),
      makeEntryItem({
        disabled: true, // !isSpendingLimitEnabled,
        label: 'Spending Limit',
        iconType: 'fuelIndicator',
        href: currentSafeRoutes.SETTINGS_SPENDING_LIMIT,
      }),
      makeEntryItem({
        label: 'Advanced',
        iconType: 'settingsTool',
        href: currentSafeRoutes.SETTINGS_ADVANCED,
        disabled: true,
      }),
    ].filter(Boolean)

    return [
      makeEntryItem({
        label: 'Assets',
        iconType: 'assestAura',
        href: currentSafeRoutes.ASSETS_BALANCES,
        subItems: assetsSubItems,
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
        label: 'Address Book',
        iconType: 'addressbookAura',
        href: currentSafeRoutes.ADDRESS_BOOK,
      }),
      // makeEntryItem({
      //   label: 'Staking',
      //   iconType: 'stakingAura',
      //   href: currentSafeRoutes.STAKING,
      // }),
      makeEntryItem({
        label: 'Voting',
        iconType: 'votingAura',
        href: currentSafeRoutes.VOTING,
      }),
      makeEntryItem({
        disabled: !safeAppsEnabled,
        label: 'Apps',
        iconType: 'apps',
        href: currentSafeRoutes.APPS,
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
