import { sm, xxl, bgBox } from 'src/theme/variables'
const FIXED_EMPTY_HEIGHT = 255

const styles = {
  root: {
    backgroundColor: bgBox,
    borderTopRightRadius: sm,
    borderTopLeftRadius: sm,
    overFlow: 'hidden',
  },
  selectRoot: {
    lineHeight: xxl,
    backgroundColor: '#222223 !important',
    height: '30px',
  },
  white: {
    backgroundColor: 'white',
  },
  paginationRoot: {
    backgroundColor: bgBox,
    marginBottom: '90px',
    borderBottomRightRadius: sm,
    borderBottomLeftRadius: sm,
    color: 'white',
  },
  loader: {
    boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
  },
}
const getEmptyStyle = () => ({
  height: `calc(100vh - ${FIXED_EMPTY_HEIGHT}px)`,
  borderTopRightRadius: sm,
  borderTopLeftRadius: sm,
  backgroundColor: 'white',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

export { styles, getEmptyStyle }
