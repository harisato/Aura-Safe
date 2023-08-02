import { Validator } from 'jsonschema'
import { ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FilledButton } from 'src/components/Button'
import JsonschemaForm from 'src/components/JsonschemaForm'
import { IFund } from 'src/components/JsonschemaForm/FundForm'
import { makeSchemaInput } from 'src/components/JsonschemaForm/utils'
import Loader from 'src/components/Loader'
import { addToFunds } from 'src/logic/contracts/store/actions'
import { enhanceSnackbarForAction } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { Token } from 'src/logic/tokens/store/model/token'
import { extractPrefixedSafeAddress, extractSafeAddress } from 'src/routes/routes'
import { simulate } from 'src/services'
import { extendedSafeTokensSelector } from 'src/utils/safeUtils/selector'
import styled from 'styled-components'
import ReviewPopup from './ReviewPopup'

const Wrap = styled.div`
  .preview-button {
    padding: 24px;
    margin: 24px -24px -24px;
    border-top: 1px solid #363843;
    display: flex;
    justify-content: end;
  }
`

function Contract({ contractData }): ReactElement {
  const safeAddress = extractSafeAddress()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const { safeId } = extractPrefixedSafeAddress()
  const [gasUsed, setGasUsed] = useState(0)
  const [formData, setFormData] = useState({})
  const [shouldCheck, setShouldCheck] = useState(false)
  const [activeFunction, setActiveFunction] = useState(0)
  const [selectedFunction, setSelectedFunction] = useState('')
  const [funds, setFunds] = useState<IFund[]>([])
  const [schema, setSchema] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [invalidAmount, setInvalidAmount] = useState(false)
  const tokenList = useSelector(extendedSafeTokensSelector)

  const defListTokens = tokenList
    .toArray()
    .filter((t) => t.type !== 'CW20')
    .map((token) => ({
      id: token.denom,
      denom: token.cosmosDenom ?? token.denom,
      amount: '',
      tokenDecimal: token.decimals,
      logoUri: token.logoUri,
      type: token.type,
      symbol: token.symbol,
      name: token.name,
      balance: token.balance.tokenBalance,
      address: token.address,
      enabled: false,
    })) as IFund[]

  const preview = async () => {
    try {
      setLoading(true)
      setShouldCheck(true)
      let isError = false
      const jsValidator = new Validator()
      jsValidator.addSchema(schema)
      const schemaInput = makeSchemaInput(jsValidator)
      setSelectedFunction(schemaInput.at(activeFunction).fieldName)
      schemaInput.at(activeFunction).fieldList?.forEach((s) => {
        if (s.isRequired && (typeof formData[s.fieldName] == 'undefined' || formData[s.fieldName] === '')) {
          isError = true
        }
      })
      if (!isError && !invalidAmount) {
        try {
          const res = await simulate({
            encodedMsgs: Buffer.from(
              JSON.stringify([
                {
                  typeUrl: MsgTypeUrl.ExecuteContract,
                  value: {
                    contract: contractData.contractAddress,
                    sender: safeAddress,
                    funds: [],
                    msg: JSON.stringify({
                      [schemaInput.at(activeFunction).fieldName]: formData,
                    }),
                  },
                },
              ]),
              'binary',
            ).toString('base64'),
            safeId: safeId?.toString(),
          })
          if (res?.Data?.gasUsed) {
            setGasUsed(res?.Data?.gasUsed)
          }
        } catch (error) {
          setGasUsed(0)
        }
        setOpen(true)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      dispatch(
        enqueueSnackbar(
          enhanceSnackbarForAction({
            message: error.message || 'Failed to execute message',
            options: { variant: 'error', persist: true, preventDuplicate: true },
          }),
        ),
      )
      console.log('eevv', error)
    }
  }

  useEffect(() => {
    setFormData({})
    setShouldCheck(false)
    setActiveFunction(0)
    try {
      if (contractData?.executeMsgSchema) {
        const s = JSON.parse(contractData.executeMsgSchema)
        setSchema(s)
      }
    } catch (error) {
      console.log('ee', error)
    }
  }, [contractData.contractAddress, contractData.executeMsgSchema])

  useEffect(() => {
    return () => {
      dispatch(addToFunds(defListTokens))
    }
  }, [])

  if (!contractData?.executeMsgSchema || !contractData.contractAddress) return <></>

  return (
    <Wrap>
      <JsonschemaForm
        schema={schema}
        formData={formData}
        setFormData={setFormData}
        shouldCheck={shouldCheck}
        setShouldCheck={setShouldCheck}
        activeFunction={activeFunction}
        setActiveFunction={setActiveFunction}
        funds={funds}
        setFunds={setFunds}
        setInvalidAmount={setInvalidAmount}
        defListTokens={defListTokens}
      />
      <div className="preview-button">
        <FilledButton disabled={loading} onClick={preview}>
          {loading ? <Loader content="preview" /> : 'Preview'}
        </FilledButton>
      </div>
      <ReviewPopup
        open={open}
        setOpen={setOpen}
        gasUsed={Math.round(gasUsed * 2)}
        data={formData}
        contractData={{
          ...contractData,
          selectedFunction: selectedFunction,
          funds: funds
            .filter((fund) => fund.denom !== '')
            .map((e) => ({
              denom: e.denom,
              amount: e.amount,
              logoUri: e.logoUri,
              type: e.type,
              symbol: e.symbol,
            })),
        }}
      />
    </Wrap>
  )
}

export default Contract
