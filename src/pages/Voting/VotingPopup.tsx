import { useState } from 'react'
import { OutlinedButton, OutlinedNeutralButton } from 'src/components/Button'
import RadioButtons from 'src/components/Input/RadioGroup'
import { Popup } from 'src/components/Popup'
import ReviewTxPopup from './ReviewTxPopup'
import { VotingPopupWrapper } from './styledComponents'

const VotingPopup = ({ proposal, openVotingModal, setOpenVotingModal }): React.ReactElement => {
  const [vote, setVote] = useState<string>('yes')
  const [reviewTxOpen, setReviewTxOpen] = useState<boolean>(false)
  const onClose = () => setOpenVotingModal(false)

  return (
    <>
      <Popup handleClose={onClose} open={openVotingModal} title="Voting Popup">
        <VotingPopupWrapper>
          <p className="popup-title">Your vote</p>
          <p className="proposal-name">{`#${proposal?.id} ${proposal?.title}`}</p>
          <div className="voting-options">
            <RadioButtons
              name="abc"
              value={vote}
              onChange={(e) => {
                setVote(e.target.value)
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
            <OutlinedButton
              size="md"
              onClick={() => {
                onClose()
                setReviewTxOpen(true)
              }}
            >
              Confirm
            </OutlinedButton>
          </div>
        </VotingPopupWrapper>
      </Popup>
      <ReviewTxPopup
        onBack={() => {
          setReviewTxOpen(false)
          setOpenVotingModal(true)
        }}
        vote={vote}
        proposal={proposal}
        open={reviewTxOpen}
        onClose={() => setReviewTxOpen(false)}
      />
    </>
  )
}

export default VotingPopup
