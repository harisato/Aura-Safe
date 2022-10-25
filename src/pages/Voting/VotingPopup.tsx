import { useState } from 'react'
import { OutlinedButton, OutlinedNeutralButton } from 'src/components/Button'
import Popup from 'src/components/Popup'
import RadioButtons from 'src/components/RadioGroup'
import { VotingPopupWrapper } from './styledComponents'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const VotingPopup = ({ isOpen, onClose }: Props): React.ReactElement => {
  const [selectedOptionValue, setSelectedOptionValue] = useState<string>('yes')
  return (
    <Popup handleClose={onClose} open={isOpen} title="Voting Popup">
      <VotingPopupWrapper>
        <p className="title-h3_20m popup-title">Your vote</p>
        <p className="proposal-name">#169 Match External Incentives for CMDX/OSMO and CMDX/ATOM pairs</p>
        <div className="voting-options">
          <RadioButtons
            name="abc"
            value={selectedOptionValue}
            onChange={(e) => {
              setSelectedOptionValue(e.target.value)
            }}
            options={[
              {
                label: 'Yes',
                value: 'yes',
              },
              {
                label: 'No',
                value: 'no',
              },
              {
                label: 'NoWithVeto',
                value: 'noWithVeto',
              },
              {
                label: 'Abstain',
                value: 'abstain',
              },
            ]}
          />
        </div>
        <div className="buttons">
          <OutlinedNeutralButton size="md" onClick={onClose}>
            Cancel
          </OutlinedNeutralButton>
          <OutlinedButton size="md">Vote</OutlinedButton>
        </div>
      </VotingPopupWrapper>
    </Popup>
  )
}

export default VotingPopup
