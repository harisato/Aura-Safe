import { FixedIcon, Icon, Menu } from '@aura/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import cn from 'classnames'
import { ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbIcon from 'src/assets/icons/BookBookmark.svg'

import { useHistory } from 'react-router'
import ArrowDown from 'src/assets/icons/ArrowLineDown.svg'
import ArrowUp from 'src/assets/icons/ArrowLineUp.svg'
import Plus from 'src/assets/icons/Plus.svg'
import Breadcrumb from 'src/components/Breadcrumb'
import { OutlinedButton, OutlinedNeutralButton } from 'src/components/Button'
import ButtonHelper from 'src/components/ButtonHelper'
import Gap from 'src/components/Gap'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import Table from 'src/components/Table'
import { cellWidth } from 'src/components/Table/TableHead'
import { getExplorerInfo } from 'src/config'
import { AddressBookEntry, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addressBookAddOrUpdate, addressBookImport, addressBookRemove } from 'src/logic/addressBook/store/actions'
import { currentNetworkAddressBook } from 'src/logic/addressBook/store/selectors'
import { currentChainId } from 'src/logic/config/store/selectors'
import { safesAsList } from 'src/logic/safe/store/selectors'
import { isUserAnOwnerOfAnySafe, sameAddress } from 'src/logic/wallets/ethAddresses'
import { AB_ADDRESS_ID, AB_NAME_ID, ADDRESS_BOOK_ROW_ID, generateColumns } from 'src/pages/AddressBook/columns'
import { CreateEditEntryModal } from 'src/pages/AddressBook/CreateEditEntryModal'
import { DeleteEntryModal } from 'src/pages/AddressBook/DeleteEntryModal'
import { ExportEntriesModal } from 'src/pages/AddressBook/ExportEntriesModal'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import { SAFE_EVENTS, useAnalytics } from 'src/utils/googleAnalytics'
import { isValidAddress } from 'src/utils/isValidAddress'
import { grantedSelector } from 'src/utils/safeUtils/selector'
import ImportEntriesModal from './ImportEntriesModal'
import { styles } from './style'
const useStyles = makeStyles(styles)

interface AddressBookSelectedEntry extends AddressBookEntry {
  isNew?: boolean
}

export type Entry = {
  entry: AddressBookSelectedEntry
  index?: number
  isOwnerAddress?: boolean
}

const AddressBookTable = (): ReactElement => {
  const classes = useStyles()
  const columns = generateColumns()
  const autoColumns = columns.filter(({ custom }) => !custom)
  const dispatch = useDispatch()
  const safesList = useSelector(safesAsList)
  const addressBook = useSelector(currentNetworkAddressBook)
  const networkId = useSelector(currentChainId)
  const granted = useSelector(grantedSelector)
  const chainId = useSelector(currentChainId)
  const initialEntryState: Entry = { entry: { address: '', name: '', chainId, isNew: true } }
  const [selectedEntry, setSelectedEntry] = useState<Entry>(initialEntryState)
  const [editCreateEntryModalOpen, setEditCreateEntryModalOpen] = useState(false)
  const [importEntryModalOpen, setImportEntryModalOpen] = useState(false)
  const [deleteEntryModalOpen, setDeleteEntryModalOpen] = useState(false)
  const [exportEntriesModalOpen, setExportEntriesModalOpen] = useState(false)
  const [sendFundsModalOpen, setSendFundsModalOpen] = useState(false)
  const { trackEvent } = useAnalytics()

  const history = useHistory()
  const queryParams = Object.fromEntries(new URLSearchParams(history.location.search))
  const entryAddressToEditOrCreateNew = queryParams?.entryAddress

  useEffect(() => {
    trackEvent(SAFE_EVENTS.ADDRESS_BOOK)
  }, [trackEvent])

  useEffect(() => {
    if (entryAddressToEditOrCreateNew) {
      setEditCreateEntryModalOpen(true)
    }
  }, [entryAddressToEditOrCreateNew])

  useEffect(() => {
    if (isValidAddress(entryAddressToEditOrCreateNew)) {
      const address = entryAddressToEditOrCreateNew //checksumAddress(entryAddressToEditOrCreateNew as string)
      const oldEntryIndex = addressBook.findIndex((entry) => sameAddress(entry.address, address))

      if (oldEntryIndex >= 0) {
        // Edit old entry
        setSelectedEntry({ entry: addressBook[oldEntryIndex], index: oldEntryIndex })
      } else {
        // Create new entry
        setSelectedEntry({
          entry: {
            name: '',
            address,
            chainId: networkId,
            isNew: true,
          },
        })
      }
    }
  }, [addressBook, entryAddressToEditOrCreateNew, networkId])

  const newEntryModalHandler = (entry: AddressBookEntry) => {
    // close the modal
    setEditCreateEntryModalOpen(false)
    // update the store
    dispatch(addressBookAddOrUpdate(makeAddressBookEntry({ ...entry, address: entry.address, chainId })))
  }

  const editEntryModalHandler = (entry: AddressBookEntry) => {
    // reset the form
    setSelectedEntry(initialEntryState)
    // close the modal
    setEditCreateEntryModalOpen(false)
    // update the store
    dispatch(addressBookAddOrUpdate(makeAddressBookEntry({ ...entry, address: entry.address, chainId })))
  }

  const deleteEntryModalHandler = () => {
    // reset the form
    setSelectedEntry(initialEntryState)
    // close the modal
    setDeleteEntryModalOpen(false)
    // update the store
    selectedEntry?.entry && dispatch(addressBookRemove(selectedEntry.entry))
  }

  const importEntryModalHandler = (addressList: AddressBookEntry[]) => {
    dispatch(addressBookImport(addressList))
    setImportEntryModalOpen(false)
  }

  return (
    <>
      <Menu>
        <Col start="sm" sm={6} xs={12}>
          <Breadcrumb title="Address Book" subtitleIcon={BreadcrumbIcon} subtitle="Address Book" />
        </Col>
        <Col end="sm" sm={6} xs={12}>
          <OutlinedButton
            className="small"
            onClick={() => {
              setSelectedEntry(initialEntryState)
              setExportEntriesModalOpen(true)
            }}
          >
            <img src={ArrowUp} alt="" />
            Export
          </OutlinedButton>
          <Gap width={8} />
          <OutlinedButton
            className="small"
            onClick={() => {
              setImportEntryModalOpen(true)
            }}
          >
            <img src={ArrowDown} alt="" />
            Import
          </OutlinedButton>
          <Gap width={8} />

          <OutlinedButton
            className="small"
            onClick={() => {
              setSelectedEntry(initialEntryState)
              setEditCreateEntryModalOpen(true)
            }}
          >
            <img src={Plus} alt="" />
            Create entry
          </OutlinedButton>
        </Col>
      </Menu>
      <Gap height={16} />
      <Block className={classes.formContainer}>
        <TableContainer>
          <Table
            columns={columns}
            data={addressBook}
            defaultFixed
            defaultOrderBy={AB_NAME_ID}
            defaultRowsPerPage={5}
            disableLoadingOnEmptyTable
            label="Owners"
            size={addressBook?.length || 0}
          >
            {(sortedData) =>
              sortedData.map((row, index) => {
                const userOwner = isUserAnOwnerOfAnySafe(safesList, row.address)
                const hideBorderBottom = index >= 3 && index === sortedData.size - 1 && classes.noBorderBottom
                return (
                  <TableRow
                    className={cn(classes.hide, hideBorderBottom)}
                    data-testid={ADDRESS_BOOK_ROW_ID}
                    key={index}
                    tabIndex={-1}
                  >
                    {autoColumns.map((column) => {
                      return (
                        <TableCell
                          align={column.align}
                          component="td"
                          key={column.id}
                          style={cellWidth(column.width)}
                          className={classes.tableCell}
                        >
                          {column.id === AB_ADDRESS_ID ? (
                            <Block justify="left">
                              <PrefixedEthHashInfo
                                hash={row[column.id]}
                                showCopyBtn
                                showAvatar
                                explorerUrl={getExplorerInfo(row[column.id])}
                              />
                            </Block>
                          ) : (
                            <Paragraph color="white" size="md">
                              {row[column.id]}
                            </Paragraph>
                          )}
                        </TableCell>
                      )
                    })}
                    <TableCell component="td" className={classes.tableCell}>
                      <Row align="end" className={classes.actions}>
                        <ButtonHelper
                          onClick={() => {
                            setSelectedEntry({
                              entry: row,
                              isOwnerAddress: userOwner,
                            })
                            setEditCreateEntryModalOpen(true)
                          }}
                        >
                          <Icon
                            size="sm"
                            type="edit"
                            tooltip="Edit entry"
                            className={granted ? classes.editEntryButton : classes.editEntryButtonNonOwner}
                          />
                        </ButtonHelper>
                        <ButtonHelper
                          onClick={() => {
                            setSelectedEntry({ entry: row })
                            setDeleteEntryModalOpen(true)
                          }}
                        >
                          <Icon
                            size="sm"
                            type="delete"
                            tooltip="Delete entry"
                            className={granted ? classes.removeEntryButton : classes.removeEntryButtonNonOwner}
                          />
                        </ButtonHelper>
                        {granted ? (
                          <OutlinedNeutralButton
                            onClick={() => {
                              setSelectedEntry({ entry: row })
                              setSendFundsModalOpen(true)
                            }}
                          >
                            <FixedIcon type="arrowSentWhite" />
                            Send
                          </OutlinedNeutralButton>
                        ) : null}
                      </Row>
                    </TableCell>
                  </TableRow>
                )
              })
            }
          </Table>
        </TableContainer>
      </Block>
      <CreateEditEntryModal
        editEntryModalHandler={editEntryModalHandler}
        entryToEdit={selectedEntry}
        isOpen={editCreateEntryModalOpen}
        newEntryModalHandler={newEntryModalHandler}
        onClose={() => setEditCreateEntryModalOpen(false)}
      />
      <DeleteEntryModal
        deleteEntryModalHandler={deleteEntryModalHandler}
        entryToDelete={selectedEntry}
        isOpen={deleteEntryModalOpen}
        onClose={() => setDeleteEntryModalOpen(false)}
      />
      <ExportEntriesModal isOpen={exportEntriesModalOpen} onClose={() => setExportEntriesModalOpen(false)} />
      <ImportEntriesModal
        importEntryModalHandler={importEntryModalHandler}
        isOpen={importEntryModalOpen}
        onClose={() => setImportEntryModalOpen(false)}
      />
      <SendModal
        activeScreenType="chooseTxType"
        isOpen={sendFundsModalOpen}
        onClose={() => setSendFundsModalOpen(false)}
        recipientAddress={selectedEntry?.entry?.address}
        recipientName={selectedEntry?.entry?.name}
      />
    </>
  )
}

export default AddressBookTable
