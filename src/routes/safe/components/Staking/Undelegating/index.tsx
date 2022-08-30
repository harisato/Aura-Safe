import { ReactElement } from 'react'
import { Text } from '@aura/safe-react-components'
import styled from 'styled-components'

const BoxCardStakingOverview = styled.div`
  padding: 24px;
  background: #363843;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;
`
const BoxCardStaking = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 25px;
  background: #363843;
  align-items: flex-start;
`
const BoxCardStakingList = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  align-items: flex-start;
  padding: 24px;
  background: #24262e;
  border-radius: 25px;
`

function Undelegating(props): ReactElement {
  return (
    <BoxCardStaking>
      <BoxCardStakingOverview>
        <Text size="lg" color="disableAura">
          Undelegating
        </Text>
      </BoxCardStakingOverview>
      <BoxCardStakingList>{/* <TableVotingDetailInside /> */}</BoxCardStakingList>
    </BoxCardStaking>
  )
}

export default Undelegating
