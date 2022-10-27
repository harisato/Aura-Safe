import { createStyles } from '@material-ui/core'
import { borderLinear } from 'src/theme/variables'
import styled from 'styled-components'
import { Text, Button } from '@aura/safe-react-components'

export const styles = createStyles({
  stakingOverview: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '8px',
  },
  stakingOverviewTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space - between',
    alignItems: 'center',
    gap: '8px',
  },
})

const StyledButton = styled.div`
  display: flex;
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  padding: 8px 20px;
  gap: 6px;
  background: linear-gradient(108.46deg, #5ee6d0 12.51%, #bfc6ff 51.13%, #ffba69 87.49%);
  cursor: pointer;
  color: rgba(19, 20, 25, 1);
`
const BoxCardStakingOverview = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-self: stretch;
  align-items: center;
  padding: 24px;
  background: #363843;
  border-radius: 25px;
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

const StyledButtonManage = styled(Button)`
  border: 2px solid transparent;
  background-image: ${borderLinear};
  background-origin: border-box;
  background-clip: content-box, border-box;
  border-radius: 50px !important;
  padding: 0 !important;
  background-color: transparent !important;
  min-width: 130px !important;
`

const HeaderValidator = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`
const ImgRow = styled.div`
  display: flex;
  > img {
    margin-right: 5px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
`
export {
  StyledButton,
  BoxCardStakingOverview,
  BoxCardStaking,
  BoxCardStakingList,
  StyledButtonManage,
  HeaderValidator,
  ImgRow,
}
