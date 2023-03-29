import { toUtf8 } from '@cosmjs/encoding'
import { ReactElement, useState } from 'react'
import JsonschemaForm from 'src/components/JsonschemaForm'
import { MsgTypeUrl } from 'src/logic/providers/constants/constant'
import { extractPrefixedSafeAddress, extractSafeAddress } from 'src/routes/routes'
import { simulate } from 'src/services'
import styled from 'styled-components'
import ReviewPopup from './ReviewPopup'

const Wrap = styled.div``

function Contract({ contractData }): ReactElement {
  const safeAddress = extractSafeAddress()
  const [open, setOpen] = useState(false)
  const { safeId } = extractPrefixedSafeAddress()
  const [gasUsed, setGasUsed] = useState(0)
  const [formData, setFormData] = useState({})
  const [selectedFunction, setSelectedFunction] = useState('')
  if (!contractData.executeMsgSchema) return <></>
  let schema
  try {
    schema = JSON.parse(contractData.executeMsgSchema)
  } catch (error) {
    console.log('ee', error)
  }
  const onPreview = async (schema, data, selectedFunction) => {
    let isError = false
    schema.forEach((s) => {
      if (s.isRequired && !data[s.fieldName]) {
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
                  msg: toUtf8(
                    JSON.stringify({
                      [selectedFunction]: data,
                    }),
                  ),
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
      setSelectedFunction(selectedFunction)
      setFormData(data)
      setOpen(true)
    }
  }
  return (
    <Wrap>
      <JsonschemaForm contractData={contractData} schema={schema} onPreview={onPreview} />
      <ReviewPopup
        open={open}
        setOpen={setOpen}
        gasUsed={gasUsed}
        data={formData}
        contractData={{ ...contractData, selectedFunction: selectedFunction }}
      />
    </Wrap>
  )
}

export default Contract
