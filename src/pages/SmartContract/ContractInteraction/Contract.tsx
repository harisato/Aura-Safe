import { toUtf8 } from '@cosmjs/encoding'
import { ReactElement, useEffect, useState } from 'react'
import JsonschemaForm from 'src/components/JsonschemaForm'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { extractPrefixedSafeAddress, extractSafeAddress } from 'src/routes/routes'
import { simulate } from 'src/services'
import styled from 'styled-components'
import ReviewPopup from './ReviewPopup'
import { FilledButton } from 'src/components/Button'

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
  const [open, setOpen] = useState(false)
  const { safeId } = extractPrefixedSafeAddress()
  const [gasUsed, setGasUsed] = useState(0)
  const [formData, setFormData] = useState({})
  const [shouldCheck, setShouldCheck] = useState(false)
  const [activeFunction, setActiveFunction] = useState(0)
  const [schema, setSchema] = useState<any>()

  const preview = async () => {
    try {
      setShouldCheck(true)
      let isError = false
      schema?.forEach((s) => {
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
    } catch (error) {
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
      if (contractData?.executeMsgSchema) setSchema(JSON.parse(contractData.executeMsgSchema))
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
        <FilledButton onClick={preview}>Preview</FilledButton>
      </div>
      <ReviewPopup
        open={open}
        setOpen={setOpen}
        gasUsed={Math.round(gasUsed * 1.3)}
        data={formData}
        contractData={{ ...contractData, selectedFunction: activeFunction }}
      />
    </Wrap>
  )
}

export default Contract
function dispatch(arg0: any) {
  throw new Error('Function not implemented.')
}

function enqueueSnackbar(arg0: any): any {
  throw new Error('Function not implemented.')
}

function enhanceSnackbarForAction(arg0: {
  message: any
  options: { variant: string; persist: boolean; preventDuplicate: boolean }
}): any {
  throw new Error('Function not implemented.')
}
