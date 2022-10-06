import { ReactElement } from 'react'
import { Text } from '@aura/safe-react-components'
import {
  styles,
  StyledButton,
  BoxCardStakingOverview,
  BoxCardStaking,
  BoxCardStakingList,
  StyledButtonManage,
} from './style'
import { makeStyles } from '@material-ui/core'
import TableVoting from 'src/components/TableVoting'
import { StyledTableCell, StyledTableRow } from 'src/components/TableVoting'

const RowHead = [
  { name: 'NAME' },
  { name: 'AMOUNT STAKED' },
  { name: 'PENDING REWARD' },
  { name: 'TIME' },
  { name: '' },
]

const RowData = [
  {
    id: 'aura81...818hsbcasc',
    title: '1782GSAW...DHF1HG13',
    status: 'Yes',
    voting: '2022-01-09 | 07:55:02',
  },
  {
    id: 'aura81...818hsbcasc',
    title: '1782GSAW...DHF1HG13',
    status: 'Yes',
    voting: '2022-01-09 | 07:55:02',
  },
]

const TableVotingDetailInside = (props) => {
  const { handleModal } = props
  return (
    <TableVoting RowHead={RowHead}>
      {RowData.map((row) => (
        <StyledTableRow key={row.id}>
          <StyledTableCell component="th" scope="row">
            {row.id}
          </StyledTableCell>
          <StyledTableCell align="left">
            <Text size="lg" color="linkAura">
              {row.title}
            </Text>
          </StyledTableCell>
          <StyledTableCell align="left">{row.status}</StyledTableCell>
          <StyledTableCell align="left">
            <div>2 months ago</div>
            <div style={{ color: 'rgba(134, 138, 151, 1)' }}>{row.voting}</div>
          </StyledTableCell>
          <StyledTableCell align="right">
            <StyledButtonManage size="md" onClick={() => handleModal(row)}>
              <Text size="lg" color="white">
                Manage
              </Text>
            </StyledButtonManage>
          </StyledTableCell>
        </StyledTableRow>
      ))}
    </TableVoting>
  )
}

const useStyles = makeStyles(styles)

function CardStaking(props): ReactElement {
  const { handleModal } = props
  const classes = useStyles()

  return (
    <BoxCardStaking>
      <BoxCardStakingOverview>
        <div className={classes.stakingOverview}>
          <div className={classes.stakingOverviewTextContainer}>
            <Text size="lg" color="disableAura">
              Available Balance:
            </Text>
            <Text size="lg" color="inputDefault" strong>
              64.000000 AURA
            </Text>
          </div>
          <div className={classes.stakingOverviewTextContainer}>
            <Text size="lg" color="disableAura">
              Total Staked:
            </Text>
            <Text size="lg" color="inputDefault" strong>
              123.092822 AURA
            </Text>
          </div>
        </div>
        <StyledButton>
          <span style={{ fontSize: 14, fontWeight: 590 }}>Claim Reward: 0.012672 AURA</span>
        </StyledButton>
      </BoxCardStakingOverview>
      <BoxCardStakingList>
        <TableVotingDetailInside handleModal={handleModal} />
      </BoxCardStakingList>
    </BoxCardStaking>
  )
}

export default CardStaking
