import { bgBox } from 'src/theme/variables'
export const stylesBasedOn = (padding) => ({
  padding: `0 ${padding}%`,
  flexDirection: 'column',
  flex: '1 0 auto',
  backgroundColor: `${bgBox}`,
  borderRadius: '8px',
})
