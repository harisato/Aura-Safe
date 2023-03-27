import { ReactElement, useEffect, useState } from 'react'
import { getCoinMinimalDenom, getInternalChainId, getNativeCurrency } from 'src/config'
import { extractPrefixedSafeAddress, extractSafeAddress } from 'src/routes/routes'
import { useDispatch, useSelector } from 'react-redux'
import useConnectWallet from 'src/logic/hooks/useConnectWallet'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'
import Breadcrumb from 'src/components/Breadcrumb'
import Icon from 'src/assets/icons/FileText.svg'
import styled from 'styled-components'
import TextField from 'src/components/Input/TextField'
import TextArea from 'src/components/Input/TextArea'
import Gap from 'src/components/Gap'
import { isValidAddress } from 'src/utils/isValidAddress'
import { getContract } from 'src/services'
import Contract from './Contract'

const Wrap = styled.div`
  background: #24262e;
  border-radius: 8px;
  padding: 24px;
  max-width: 800px;
  > .title {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 16px;
  }
`

function ContractInteraction(props): ReactElement {
  const dispatch = useDispatch()
  const granted = useSelector(grantedSelector)
  const { safeId } = extractPrefixedSafeAddress()
  const denom = getCoinMinimalDenom()
  const { connectWalletState, onConnectWalletShow, onConnectWalletHide } = useConnectWallet()
  const currentSafeData = useSelector(currentSafeWithNames)
  const nativeCurrency = getNativeCurrency()
  const internalChainId = getInternalChainId()
  const SafeAddress = extractSafeAddress()

  const [contractAddress, setContractAddress] = useState('')
  const [abi, setAbi] = useState('')
  const [contractData, setContractData] = useState(null)

  const getContractDetail = async () => {
    const { Data } = await getContract(contractAddress, internalChainId)
    if (Data) {
      setContractData(Data)
    }
  }
  useEffect(() => {
    const isValid = isValidAddress(contractAddress)
    if (isValid) {
      getContractDetail()
    }
  }, [contractAddress])

  return (
    <>
      <Breadcrumb title="Contract Interaction" subtitleIcon={Icon} subtitle="Smart Contract / Contract Interaction" />
      <Wrap>
        <div className="title">Contract</div>
        <TextField
          placeholder="Input contract address"
          label="Contract Address"
          value={contractAddress}
          onChange={setContractAddress}
          autoFocus={true}
        />
        <Gap height={16} />
        <TextArea label="ABI" placeholder="Input text" value={abi} onChange={setAbi} />
        {contractData && <Contract contractData={contractData} />}
      </Wrap>
    </>
  )
}

export default ContractInteraction
