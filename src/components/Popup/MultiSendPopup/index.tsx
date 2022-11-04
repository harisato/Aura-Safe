import Close from '@material-ui/icons/Close'
import { useSelector } from 'react-redux'
import Select from 'src/components/Input/Select'
import Row from 'src/components/layout/Row'
import { Token } from 'src/logic/tokens/store/model/token'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'
import styled from 'styled-components'
import { Popup } from '../'
import { OutlinedButton, TextButton } from '../../Button'
import AssetSelect from './AssetSelect'
import Header from '../Header'
import { useState } from 'react'
import TextArea from 'src/components/Input/TextArea'
import TextField from 'src/components/Input/TextField'
import Footer from '../Footer'
const Wrapper = styled.div`
  padding: 24px;
  > button {
    width: 100%;
    &:nth-child(1) {
      margin-bottom: 16px;
    }
  }
  > div {
    margin-bottom: 24px;
  }
  .token-selection {
    width: 50%;
  }
`

interface MultiSendPopupProps {
  onClose: () => void
  open: boolean
}

const MultiSendPopup = ({ onClose, open }: MultiSendPopupProps): React.ReactElement => {
  const tokens = useSelector(extendedSafeTokensSelector)
  const [selectedToken, setSelectedToken] = useState<string | undefined>(undefined)
  const [rawRecipientsList, setRawRecipientsList] = useState<string>('')
  const [gasAmount, setGasAmount] = useState<string>('')

  return (
    <Popup open={open} title="Multi send popup">
      <Header onClose={onClose} subTitle="Step 1 of 2" title="Multi-send" />
      <Wrapper>
        <div className="token-selection">
          <AssetSelect tokenList={tokens} selectedToken={selectedToken} setSelectedToken={setSelectedToken} />
        </div>
        <div>
          <TextArea value={rawRecipientsList} onChange={setRawRecipientsList} />
        </div>
        <div>
          <TextField label="Gas Amount" type="number" value={gasAmount} onChange={setGasAmount} />
        </div>
      </Wrapper>
      <Footer>
        <TextButton size="md" onClick={onClose}>
          Cancel
        </TextButton>
        <OutlinedButton size="md">Review</OutlinedButton>
      </Footer>
    </Popup>
  )
}

export default MultiSendPopup
