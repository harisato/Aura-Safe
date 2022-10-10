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
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { getDisplayAddress } from 'src/routes/safe/components/Staking/constant'

const RowHead = [
  { name: 'NAME' },
  { name: 'AMOUNT STAKED' },
  { name: 'PENDING REWARD' },
  // { name: 'TIME' },
  { name: '' },
]

const TableVotingDetailInside = (props) => {
  const { handleModal, data } = props

  return (
    <TableVoting RowHead={RowHead}>
      {data.map((row) => (
        <StyledTableRow key={row.id}>
          <StyledTableCell component="th" scope="row">
            {getDisplayAddress(row.operatorAddress)}
          </StyledTableCell>
          <StyledTableCell align="left">
            <Text size="lg" color="linkAura">
              {row.balance.amount / 10 ** 6}
            </Text>
          </StyledTableCell>
          <StyledTableCell align="left">{row.reward.length > 0 ? 'Yes' : 'No'}</StyledTableCell>
          {/* <StyledTableCell align="left">
            <div>2 months ago</div>
            <div style={{ color: 'rgba(134, 138, 151, 1)' }}>{row.voting}</div>
          </StyledTableCell> */}
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
  const { handleModal, availableBalance, totalStake, rewardAmount, validatorOfUser, ClaimReward, nativeCurrency } =
    props
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
              {availableBalance?.amount / 10 ** 6 || 0} {nativeCurrency}
            </Text>
          </div>
          <div className={classes.stakingOverviewTextContainer}>
            <Text size="lg" color="disableAura">
              Total Staked:
            </Text>
            <Text size="lg" color="inputDefault" strong>
              {totalStake?.amount ? totalStake?.amount / 10 ** 6 : 0} {nativeCurrency}
            </Text>
          </div>
        </div>
        {rewardAmount[0]?.amount / 10 ** 6 > 0 && (
          <StyledButton onClick={ClaimReward}>
            <span style={{ fontSize: 14, fontWeight: 590 }}>
              Claim Reward: {rewardAmount[0] ? (rewardAmount[0]?.amount / 10 ** 6).toFixed(6) : 0} {nativeCurrency}
            </span>
          </StyledButton>
        )}
      </BoxCardStakingOverview>
      {validatorOfUser && validatorOfUser?.length > 1 && (
        <BoxCardStakingList>
          <TableVotingDetailInside handleModal={handleModal} data={validatorOfUser} />
        </BoxCardStakingList>
      )}
    </BoxCardStaking>
  )
}

export default CardStaking
