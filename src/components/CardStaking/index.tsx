import { ReactElement } from 'react'
import BoxCard from '../BoxCard'
import { Breadcrumb, BreadcrumbElement, Menu, Text } from '@aura/safe-react-components'
import styled from 'styled-components'
import { styles } from './style'
import { makeStyles } from '@material-ui/core'

const StyledButton = styled.div`
  display: flex;
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  padding: 8px 20px;
  gap: 6px;
  background: linear-gradient(108.46deg, #5ee6d0 12.51%, #bfc6ff 51.13%, #ffba69 87.49%);
  cursor: pointer;
`
const BoxCardStakingOverview = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-self: stretch;
  align-items: center;
  padding: 24px;
  background: #363843;
`
const BoxCardStaking = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #24262e;
`
const BoxCardStakingList = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  align-items: flex-start;
  padding: 24px;
`

const useStyles = makeStyles(styles)

function CardStaking(props): ReactElement {
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
        <div>
          <div>name</div>
          <div>amount staked</div>
          <div>pending rewardhh</div>
          <div></div>
        </div>
      </BoxCardStakingList>
    </BoxCardStaking>
  )
}

export default CardStaking
