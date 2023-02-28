import { getNativeCurrency } from 'src/config'
import { formatNativeToken } from 'src/utils'

export default function TxAmount({ amount = 0 }) {
  const nativeCurrency = getNativeCurrency()
  return (
    <div className="tx-amount">
      {amount ? (
        <>
          <img className="native-token-img" src={nativeCurrency.logoUri} alt="native-url-icon" />
          <p>{formatNativeToken(amount)}</p>
        </>
      ) : (
        `-`
      )}
    </div>
  )
}
