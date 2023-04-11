import { ReactElement, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { FilledButton } from 'src/components/Button'
import JsonschemaForm from 'src/components/JsonschemaForm'
import { enhanceSnackbarForAction } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { extractPrefixedSafeAddress, extractSafeAddress } from 'src/routes/routes'
import { simulate } from 'src/services'
import styled from 'styled-components'
import ReviewPopup from './ReviewPopup'
import { Validator } from 'jsonschema'
import { makeSchemaInput } from 'src/components/JsonschemaForm/utils'
import Loader from 'src/components/Loader'

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
  const [schema, setSchema] = useState<any>()
  const [loading, setLoading] = useState(false)
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
        if (s.isRequired && !formData[s.fieldName]) {
          isError = true
        }
      })

      if (!isError) {
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
                      [activeFunction]: formData,
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
  }, [contractData.contractAddress])

  if (!contractData?.executeMsgSchema) return <></>

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
      />
      <div className="preview-button">
        <FilledButton disabled={loading} onClick={preview}>
          {loading ? <Loader content="preview" /> : 'Preview'}
        </FilledButton>
      </div>
      <ReviewPopup
        open={open}
        setOpen={setOpen}
        gasUsed={Math.round(gasUsed * 1.3)}
        data={formData}
        contractData={{ ...contractData, selectedFunction: selectedFunction }}
      />
    </Wrap>
  )
}

export default Contract
