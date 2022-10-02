import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'

import Markdown from 'marked-react'

const DetailWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 8px;
  padding: 16px;
  background-color: rgba(19, 20, 25, 0.5);
  max-height: 360px;
  overflow-y: auto;

  color: #b4b8c0;

  & a {
    color: #5ee6d0;
  }

  & h1,
  & h2,
  & h3,
  & h4,
  & h5,
  & h6 {
    color: #e6e7e8;
  }
`

interface Props {
  description: string
}

function DetailVoting({ description }: Props): ReactElement {
  const [markDown, setMarkDown] = useState(description)
  useEffect(() => {
    setMarkDown(description.replace(/<\/div>/gi, ''))
  }, [description])
  return (
    <DetailWrapper>
      <Markdown openLinksInNewTab={true} value={markDown} />
    </DetailWrapper>
  )
}

export default DetailVoting
