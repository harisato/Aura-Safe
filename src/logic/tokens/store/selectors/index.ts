import { AppReduxState } from 'src/logic/safe/store'
import { TOKEN_REDUCER_ID, TokenState } from 'src/logic/tokens/store/reducer/tokens'

export const tokensSelector = (state: AppReduxState): TokenState => state[TOKEN_REDUCER_ID]
