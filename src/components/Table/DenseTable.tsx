import { ReactElement } from 'react'
import styled from 'styled-components'

import { withStyles, makeStyles } from '@material-ui/core/styles'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Pagination from '@material-ui/lab/Pagination'

export const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#363843',
    fontSize: 16,
    fontWeight: 600,
    padding: '14px 16px',
    lineHeight: '20px',
    textTransform: 'unset',
  },
  body: {
    fontSize: '14px !important',
    padding: '12px 16px',
    color: '#E5E7EA !important',
    borderTop: '1px solid #363843',
    background: '#24262E',
  },
}))(TableCell)

export const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      //   borderTop: '1px solid #363843',
    },
  },
}))(TableRow)

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  pagi: {
    display: 'flex',
    marginTop: 20,
    justifyContent: 'flex-end',
    color: 'white',
  },
})

function DenseTable({
  headers,
  children,
  showPagination,
  stickyHeader,
  maxHeight,
}: {
  headers: string[]
  children: ReactElement | ReactElement[] | undefined
  showPagination?: boolean
  stickyHeader?: boolean
  maxHeight?: number | string
}): ReactElement {
  const classes = useStyles()
  return (
    <>
      <TableContainer style={maxHeight ? { maxHeight } : {}}>
        <Table stickyHeader={stickyHeader} className={classes.table} aria-label="customized table">
          {headers.length > 0 && (
            <TableHead>
              <TableRow>
                {headers.map((header, index) => {
                  return (
                    <StyledTableCell key={index} align="left">
                      {header}
                    </StyledTableCell>
                  )
                })}
              </TableRow>
            </TableHead>
          )}
          <TableBody>{children}</TableBody>
        </Table>
        {showPagination && (
          <Pagination className={classes.pagi} count={5} shape="rounded" showFirstButton showLastButton />
        )}
      </TableContainer>
    </>
  )
}

export default DenseTable
