import { GenericModal, Loader } from '@aura/safe-react-components'
import React, { lazy, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'

import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'
import { LoadingContainer } from 'src/components/LoaderContainer'
import { fetchAllDelegations } from 'src/logic/delegation/store/actions'
import { currentSafeFeaturesEnabled, currentSafeOwners } from 'src/logic/safe/store/selectors'
import Assets from 'src/pages/Assets'
import CustomTransaction from 'src/pages/Avanced/Custom Transaction'
import ContractInteraction from 'src/pages/SmartContract/ContractInteraction'
import { SAFE_ROUTES, extractPrefixedSafeAddress, generateSafeRoute } from 'src/routes/routes'
import { SAFE_POLLING_INTERVAL } from 'src/utils/constants'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'
import SafeLoadError from './components/SafeLoadError'

export const BALANCES_TAB_BTN_TEST_ID = 'balances-tab-btn'
export const SETTINGS_TAB_BTN_TEST_ID = 'settings-tab-btn'
export const APPS_TAB_BTN_TEST_ID = 'apps-tab-btn'
export const TRANSACTIONS_TAB_BTN_TEST_ID = 'transactions-tab-btn'
export const ADDRESS_BOOK_TAB_BTN_TEST_ID = 'address-book-tab-btn'
export const SAFE_VIEW_NAME_HEADING_TEST_ID = 'safe-name-heading'
export const TRANSACTIONS_TAB_NEW_BTN_TEST_ID = 'transactions-tab-new-btn'

const Apps = lazy(() => import('src/routes/safe/components/Apps'))
const Settings = lazy(() => import('src/routes/safe/components/Settings'))
const Transaction = lazy(() => import('src/pages/Transactions'))
const AddressBookTable = lazy(() => import('src/pages/AddressBook'))
const Staking = lazy(() => import('src/pages/Staking'))
const Voting = lazy(() => import('src/pages/Voting'))

const Container = (): React.ReactElement => {
  const location = useLocation()
  const featuresEnabled = useSelector(currentSafeFeaturesEnabled)
  const owners = useSelector(currentSafeOwners)
  const isSafeLoaded = owners.length > 0
  const [hasLoadFailed, setHasLoadFailed] = useState<boolean>(false)
  const dispatch = useDispatch()
  const isIgnorantPage =
    location.pathname.includes('/custom-transaction') || location.pathname.includes('/transactions')
  let componentToRender: React.ReactElement

  useEffect(() => {
    if (isSafeLoaded) {
      dispatch(fetchAllDelegations())
      return
    }
    const failedTimeout = setTimeout(() => {
      setHasLoadFailed(true)
    }, SAFE_POLLING_INTERVAL)
    return () => {
      clearTimeout(failedTimeout)
    }
  }, [isSafeLoaded])

  const [modal, setModal] = useState({
    isOpen: false,
    title: null,
    body: null,
    footer: null,
    onClose: () => {},
  })

  if (hasLoadFailed) {
    if (isIgnorantPage) {
      componentToRender = (
        <Switch>
          <Route
            exact
            path={[
              SAFE_ROUTES.TRANSACTIONS,
              SAFE_ROUTES.TRANSACTIONS_HISTORY,
              SAFE_ROUTES.TRANSACTIONS_QUEUE,
              SAFE_ROUTES.TRANSACTIONS_SINGULAR,
            ]}
            render={() => wrapInSuspense(<Transaction />, null)}
          />
          <Route
            exact
            path={SAFE_ROUTES.CUSTOM_TRANSACTION}
            render={() => wrapInSuspense(<CustomTransaction />, null)}
          />
        </Switch>
      )
    } else {
      componentToRender = <SafeLoadError />
    }
  } else {
    componentToRender = (
      <Switch>
        <Route
          exact
          path={[SAFE_ROUTES.ASSETS_BALANCES, SAFE_ROUTES.ASSETS_BALANCES_COLLECTIBLES]}
          render={() => wrapInSuspense(<Assets />, null)}
        />
        <Route
          exact
          path={[
            SAFE_ROUTES.TRANSACTIONS,
            SAFE_ROUTES.TRANSACTIONS_HISTORY,
            SAFE_ROUTES.TRANSACTIONS_QUEUE,
            SAFE_ROUTES.TRANSACTIONS_SINGULAR,
          ]}
          render={() => wrapInSuspense(<Transaction />, null)}
        />
        <Route
          exact
          path={SAFE_ROUTES.CONTRACT_INTERACTION}
          render={() => wrapInSuspense(<ContractInteraction />, null)}
        />
        <Route exact path={SAFE_ROUTES.CUSTOM_TRANSACTION} render={() => wrapInSuspense(<CustomTransaction />, null)} />
        <Route exact path={SAFE_ROUTES.STAKING} render={() => wrapInSuspense(<Staking />, null)} />
        <Route exact path={SAFE_ROUTES.VOTING} render={() => wrapInSuspense(<Voting />, null)} />
        <Route exact path={SAFE_ROUTES.ADDRESS_BOOK} render={() => wrapInSuspense(<AddressBookTable />, null)} />
        <Route
          exact
          path={SAFE_ROUTES.APPS}
          render={({ history }) => {
            if (!featuresEnabled.includes(FEATURES.SAFE_APPS)) {
              history.push(generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, extractPrefixedSafeAddress()))
            }
            return wrapInSuspense(<Apps />, null)
          }}
        />
        <Route path={SAFE_ROUTES.SETTINGS} render={() => wrapInSuspense(<Settings />, null)} />
        <Redirect to={SAFE_ROUTES.ASSETS_BALANCES} />
      </Switch>
    )
  }

  if (!isSafeLoaded && !hasLoadFailed && !isIgnorantPage) {
    return (
      <LoadingContainer>
        <Loader size="md" />
      </LoadingContainer>
    )
  }

  const closeGenericModal = () => {
    if (modal.onClose) {
      modal.onClose?.()
    }

    setModal({
      isOpen: false,
      title: null,
      body: null,
      footer: null,
      onClose: () => {},
    })
  }

  return (
    <>
      {componentToRender}
      {modal.isOpen && <GenericModal {...modal} onClose={closeGenericModal} />}
    </>
  )
}
export default Container
