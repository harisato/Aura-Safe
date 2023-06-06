import { ReactElement, useState } from 'react'

import { makeStyles, withStyles } from '@material-ui/core/styles'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Pagination from '@material-ui/lab/Pagination'
import { List } from 'immutable'
import styled from 'styled-components'
import Select from '../Input/Select'

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
  pagination: {
    color: 'white',
    '& .MuiPaginationItem-page.Mui-selected': {
      color: '#fff',
      background: '#2BBBA3',
      border: 'none',
    },
  },
})

const TablePagination = styled.div`
  border-top: 1px solid #3a3a3a;
  display: flex;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  > div:last-child {
    display: flex;
    align-items: center;
    > div:first-child {
      display: flex;
      margin-right: 36px;
      align-items: center;
      > div:first-child {
        margin-right: 6px;
      }
      .MuiSelect-select.MuiSelect-select {
        padding: 8px 40px 8px 16px;
        font-size: 12px;
        line-height: 16px;
      }
      .select-icon {
        width: 12px;
      }
    }
  }
`
function DenseTable({
  headers,
  children,
  showPagination,
  stickyHeader,
  maxHeight,
}: {
  headers: string[]
  children: ReactElement[] | List<any>
  showPagination?: boolean
  stickyHeader?: boolean
  maxHeight?: number | string
}): ReactElement {
  const classes = useStyles()
  const totalCount: number | undefined = (children as ReactElement[]).length || (children as List<any>).size
  const [rowPerPage, setRowPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(1)
  return (
    <>
      <TableContainer style={maxHeight ? { maxHeight } : {}}>
        <Table stickyHeader={stickyHeader} className={classes.table} aria-label="customized table">
          {headers.length > 0 && (
            <TableHead>
              <TableRow>
                {headers.map<ReactElement>((header, index) => {
                  return (
                    <StyledTableCell key={index} align="left">
                      {header}
                    </StyledTableCell>
                  )
                })}
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {showPagination ? children.slice(rowPerPage * (page - 1), rowPerPage * page) : children}
          </TableBody>
        </Table>
        {showPagination && totalCount / rowPerPage > 1 && (
          <TablePagination>
            <div>{`${rowPerPage * (page - 1) + 1} - ${
              rowPerPage * page > totalCount ? totalCount : rowPerPage * page
            } of ${totalCount}`}</div>
            <div>
              <div>
                <div>Row per page:</div>
                <div>
                  <Select
                    options={[
                      {
                        value: 10,
                        label: '10',
                      },
                      {
                        value: 25,
                        label: '25',
                      },
                      {
                        value: 50,
                        label: '50',
                      },
                      {
                        value: 100,
                        label: '100',
                      },
                    ]}
                    value={rowPerPage}
                    onChange={(v: number) => setRowPerPage(v)}
                  />
                </div>
              </div>
              <Pagination
                className={classes.pagination}
                page={page}
                onChange={(e, v) => setPage(v)}
                count={Math.ceil(totalCount / rowPerPage)}
                shape="rounded"
              />
            </div>
          </TablePagination>
        )}
      </TableContainer>
    </>
  )
}

export default DenseTable
