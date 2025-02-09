import { Dispatch } from 'src/logic/safe/store/actions/types.d'

import updateViewedSafes from 'src/logic/currentSession/store/actions/updateViewedSafes'

const addViewedSafe =
  (safeAddress: string, safeId: string) =>
  (dispatch: Dispatch): void => {
    dispatch(updateViewedSafes({safeAddress,safeId}))
  }

export default addViewedSafe
