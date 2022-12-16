import { Item } from '@aura/safe-react-components/dist/navigation/Tab'
import { ReactElement, useEffect, useState } from 'react'
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import Icon from 'src/assets/icons/ChartBar.svg'
import Breadcrumb from 'src/components/Breadcrumb'
import Tabs from 'src/components/Tabs'
import Tab from 'src/components/Tabs/Tab'
import { extractPrefixedSafeAddress, generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'
import { SAFE_EVENTS, useAnalytics } from 'src/utils/googleAnalytics'
import HistoryTransactions from './History'
import QueueTransactions from './Queue'
import { ContentWrapper, Wrapper } from './styled'

const TRANSACTION_TABS: Item[] = [
  { label: 'Queue', id: SAFE_ROUTES.TRANSACTIONS_QUEUE },
  { label: 'History', id: SAFE_ROUTES.TRANSACTIONS_HISTORY },
]

const Transactions = (): ReactElement => {
  const history = useHistory()
  const { path } = useRouteMatch()
  const [tab, setTab] = useState(0)
  const { trackEvent } = useAnalytics()
  useEffect(() => {
    trackEvent(SAFE_EVENTS.TRANSACTIONS)
  }, [trackEvent])
  useEffect(() => {
    switch (tab) {
      case 0:
        onTabChange(SAFE_ROUTES.TRANSACTIONS_QUEUE)
        break
      case 1:
        onTabChange(SAFE_ROUTES.TRANSACTIONS_HISTORY)
        break
    }
  }, [tab])
  const onTabChange = (path: string) => {
    history.replace(generateSafeRoute(path, extractPrefixedSafeAddress()))
  }

  return (
    <Wrapper>
      <div className="head">
        <Breadcrumb title="Transactions" subtitleIcon={Icon} subtitle="Transactions" />
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Queue" />
          <Tab label="History" />
        </Tabs>
      </div>
      <ContentWrapper>
        <Switch>
          <Route exact path={SAFE_ROUTES.TRANSACTIONS_QUEUE} render={() => <QueueTransactions />} />
          <Route exact path={SAFE_ROUTES.TRANSACTIONS_HISTORY} render={() => <HistoryTransactions />} />
          <Redirect to={SAFE_ROUTES.TRANSACTIONS_HISTORY} />
        </Switch>
      </ContentWrapper>
    </Wrapper>
  )
}

export default Transactions
