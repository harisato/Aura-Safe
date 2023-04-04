import { ReactElement, useEffect, useState } from 'react'
import Icon from 'src/assets/icons/FileText.svg'
import Breadcrumb from 'src/components/Breadcrumb'
import Gap from 'src/components/Gap'
import TextArea from 'src/components/Input/TextArea'
import TextField from 'src/components/Input/TextField'
import { getInternalChainId } from 'src/config'
import { getContract } from 'src/services'
import { isValidAddress } from 'src/utils/isValidAddress'
import styled from 'styled-components'
import Contract from './Contract'
import Check from 'src/assets/icons/check.svg'
import Alert from 'src/assets/icons/alert.svg'
import Tooltip from 'src/components/Tooltip'
import { Validator } from 'jsonschema'
import { makeSchemaInput } from 'src/components/JsonschemaForm/utils'
import Loader from 'src/components/Loader'
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
  const internalChainId = getInternalChainId()
  const [contractAddress, setContractAddress] = useState('')
  const [abi, setAbi] = useState('')
  const [contractData, setContractData] = useState({})
  const [isVerifiedContract, setIsVerifiedContract] = useState<string | null>(null)
  const [isValidAbi, setIsValidAbi] = useState<string | null>(null)

  const getContractDetail = async () => {
    setIsVerifiedContract('loading')
    const { Data } = await getContract(contractAddress, internalChainId)
    if (Data && (isValidAbi == 'false' || isValidAbi == null)) {
      setContractData(Data)
      setIsVerifiedContract(Data.verification ? 'true' : 'false')
    } else {
      setContractData({})
      setIsVerifiedContract('false')
    }
  }
  useEffect(() => {
    setIsVerifiedContract(null)
    setContractData({})
    setAbi('')
    if (!contractAddress) {
      return
    }
    const isValid = isValidAddress(contractAddress)
    if (isValid) {
      getContractDetail()
    } else {
      setIsVerifiedContract('false')
    }
  }, [contractAddress])

  useEffect(() => {
    try {
      setIsValidAbi(null)
      if (!abi) return
      const schema = JSON.parse(abi)
      const jsValidator = new Validator()
      jsValidator.addSchema(schema)
      makeSchemaInput(jsValidator)
      setIsValidAbi('true')
      setContractData((prevState) => ({
        ...prevState,
        executeMsgSchema: abi,
      }))
    } catch (error) {
      setIsValidAbi('false')
      if (isVerifiedContract == 'false') {
        setContractData({})
      }
      console.log('eerrrorr', error)
    }
  }, [abi])

  const getContractStatus = () => {
    if (isVerifiedContract == 'loading') {
      return <Loader size={14} />
    }
    if (isVerifiedContract == 'true') {
      return (
        <Tooltip tooltip="This contract is verified">
          <img src={Check} alt="" />
        </Tooltip>
      )
    }
    return (
      <Tooltip tooltip="This contract is not verified">
        <img src={Alert} alt="" />
      </Tooltip>
    )
  }
  const getAbiStatus = () => {
    if (isValidAbi == 'true') {
      return (
        <Tooltip tooltip="This schema is valid">
          <img src={Check} alt="" />
        </Tooltip>
      )
    }
    return (
      <Tooltip tooltip="This schema is invalid">
        <img src={Alert} alt="" />
      </Tooltip>
    )
  }

  return (
    <>
      <Breadcrumb title="Contract Interaction" subtitleIcon={Icon} subtitle="Smart Contract / Contract Interaction" />
      <Wrap>
        <div className="title">Contract</div>
        <TextField
          placeholder="Input contract address"
          label="Contract Address"
          value={contractAddress}
          onChange={(value) => setContractAddress(value.trim())}
          endIcon={isVerifiedContract != null ? getContractStatus() : null}
          autoFocus={true}
        />
        <Gap height={16} />
        <TextArea
          label="Contract Execution Schema"
          placeholder="Input text"
          value={abi}
          onChange={setAbi}
          endIcon={isValidAbi != null ? getAbiStatus() : null}
        />
        {contractData && <Contract contractData={contractData} />}
      </Wrap>
    </>
  )
}

export default ContractInteraction
