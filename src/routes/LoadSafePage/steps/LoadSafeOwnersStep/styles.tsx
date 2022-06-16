import styled from 'styled-components'
import Block from 'src/components/layout/Block'
import { disabled, extraSmallFontSize, lg, md, sm } from 'src/theme/variables'
import Row from 'src/components/layout/Row'
import Field from 'src/components/forms/Field'

const TitleContainer = styled(Block)`
  padding: ${md} ${lg};
`

const HeaderContainer = styled(Row)`
  padding: ${sm} ${lg};
  color: ${disabled};
  font-size: ${extraSmallFontSize};
`

const OwnerContainer = styled(Row)`
  padding: 0 ${lg};
  margin-bottom: 12px;
`

const OwnerAddressContainer = styled(Row)`
  align-items: center;
  margin-left: ${sm};
`

const FieldContainer = styled(Field)`
  margin-right: ${sm};
`
export { TitleContainer, HeaderContainer, OwnerContainer, OwnerAddressContainer, FieldContainer }
