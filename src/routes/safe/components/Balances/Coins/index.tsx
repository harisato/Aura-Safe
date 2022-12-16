import { FixedIcon, Text } from '@aura/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import { List } from 'immutable'
import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { OutlinedNeutralButton } from 'src/components/Button'
import Row from 'src/components/layout/Row'
import Table from 'src/components/Table'
import { cellWidth } from 'src/components/Table/TableHead'
import { currentCurrencySelector } from 'src/logic/currencyValues/store/selectors'
import { BALANCE_ROW_TEST_ID } from 'src/routes/safe/components/Balances'
import AssetTableCell from 'src/routes/safe/components/Balances/AssetTableCell'
import {
  BalanceData,
  BALANCE_TABLE_ASSET_ID,
  BALANCE_TABLE_BALANCE_ID,
  generateColumns,
  getBalanceData,
} from 'src/routes/safe/components/Balances/dataFetcher'
import { extendedSafeTokensSelector, grantedSelector } from 'src/routes/safe/container/selector'
import { SAFE_EVENTS, useAnalytics } from 'src/utils/googleAnalytics'
import styled from 'styled-components'
import { StyledButton, styles } from './styles'

const useStyles = makeStyles(styles)

type Props = {
  showReceiveFunds: () => void
  showSendFunds: (tokenAddress: string) => void
}

const Icon = styled.div`
  > span {
    display: inline-block;
    width: 20px;
    margin: 0px 6px 0px -8px;
  }
`

const Coins = (props: Props): React.ReactElement => {
  const { showReceiveFunds, showSendFunds } = props
  const classes = useStyles()
  const columns = generateColumns()
  const autoColumns = columns.filter((c) => !c.custom)
  const selectedCurrency = useSelector(currentCurrencySelector)
  const safeTokens = useSelector(extendedSafeTokensSelector)
  const granted = useSelector(grantedSelector)
  const filteredData: List<BalanceData> = useMemo(
    () => getBalanceData(safeTokens, selectedCurrency),
    [safeTokens, selectedCurrency],
  )
  return (
    <TableContainer>
      <Table
        columns={columns}
        className={classes.table}
        data={filteredData}
        defaultRowsPerPage={5}
        label="Balances"
        size={filteredData.size}
      >
        {(sortedData) =>
          sortedData.map((row, index) => (
            <TableRow className={classes.hide} data-testid={BALANCE_ROW_TEST_ID} key={index} tabIndex={-1}>
              {autoColumns.map((column) => {
                const { align, id, width } = column
                let cellItem
                switch (id) {
                  case BALANCE_TABLE_ASSET_ID: {
                    cellItem = <AssetTableCell asset={row[id]} />
                    break
                  }
                  case BALANCE_TABLE_BALANCE_ID: {
                    cellItem = (
                      <div data-testid={`balance-${row[BALANCE_TABLE_ASSET_ID].symbol}`} style={{ color: 'white' }}>
                        {row[id]}
                      </div>
                    )
                    break
                  }
                  default: {
                    cellItem = null
                    break
                  }
                }
                return (
                  <TableCell align={align} component="td" key={id} style={cellWidth(width)}>
                    {cellItem}
                  </TableCell>
                )
              })}
              <TableCell component="td">
                <Row align="end" className={classes.actions}>
                  {granted && (
                    <OutlinedNeutralButton
                      className="small"
                      onClick={() => showSendFunds(row.asset.address)}
                      data-testid="balance-send-btn"
                    >
                      <Icon>
                        <FixedIcon type="arrowSentWhite" />
                        Send
                      </Icon>
                    </OutlinedNeutralButton>
                  )}
                  <OutlinedNeutralButton className="small" style={{ marginLeft: 8 }} onClick={showReceiveFunds}>
                    <Icon>
                      <FixedIcon type="arrowReceivedWhite" />
                      Receive
                    </Icon>
                  </OutlinedNeutralButton>
                </Row>
              </TableCell>
            </TableRow>
          ))
        }
      </Table>
    </TableContainer>
  )
}

export default Coins
