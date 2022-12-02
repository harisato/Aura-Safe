import { useState } from 'react'
import { OutlinedButton, OutlinedNeutralButton } from 'src/components/Button'
import RadioButtons from 'src/components/Input/RadioGroup'
import { Popup } from 'src/components/Popup'
import { simulate } from 'src/services'
import ReviewTxPopup from './ReviewTxPopup'
import { VotingPopupWrapper } from './styledComponents'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { extractPrefixedSafeAddress, extractSafeAddress } from 'src/routes/routes'
import { Loader } from '@aura/safe-react-components'

const voteMapping = {
  ['YES']: 1,
  ['ABSTAIN']: 2,
  ['NO']: 3,
  ['NOWITHVETO']: 4,
}

const VotingPopup = ({ proposal, openVotingModal, setOpenVotingModal }): React.ReactElement => {
  const [vote, setVote] = useState<string>('yes')
  const [reviewTxOpen, setReviewTxOpen] = useState<boolean>(false)
  const safeAddress = extractSafeAddress()
  const { safeId } = extractPrefixedSafeAddress()
  const [simualteLoading, setSimulateLoading] = useState(false)
  const [gasUsed, setGasUsed] = useState('0')
  const onClose = () => setOpenVotingModal(false)
  const createTx = async () => {
    setSimulateLoading(true)
    try {
      const res = await simulate({
        encodedMsgs: Buffer.from(
          JSON.stringify([
            {
              typeUrl: MsgTypeUrl.Vote,
              value: {
                option: voteMapping[vote.toUpperCase()],
                proposalId: proposal?.id as any,
                voter: safeAddress,
              },
            },
          ]),
          'binary',
        ).toString('base64'),
        safeId,
      })
      if (res?.Data?.gasUsed) {
        setGasUsed(res?.Data?.gasUsed)
        setSimulateLoading(false)
      }
    } catch (error) {
      setSimulateLoading(false)
      setGasUsed('0')
    }
    onClose()
    setReviewTxOpen(true)
  }
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
            <OutlinedButton size="md" onClick={createTx} disabled={simualteLoading}>
              {simualteLoading ? <Loader size="xs" /> : 'Confirm'}
            </OutlinedButton>
          </div>
        </VotingPopupWrapper>
      </Popup>
      <ReviewTxPopup
        onBack={() => {
          setReviewTxOpen(false)
          setSimulateLoading(false)
          setOpenVotingModal(true)
        }}
        vote={vote}
        proposal={proposal}
        open={reviewTxOpen}
        onClose={() => setReviewTxOpen(false)}
        gasUsed={gasUsed}
      />
    </>
  )
}

export default VotingPopup
