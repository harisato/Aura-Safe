import { getNativeCurrency } from 'src/config'
import { formatNativeToken } from 'src/utils'

export default function TotalAllocationAmount({ totalAmount }) {
  const nativeCurrency = getNativeCurrency()
  return (
    <div className="total-amount">
      <p className="title">Total Allocation Amount</p>
      <div className="amount">
        <img alt={'nativeCurrencyLogoUri'} height={25} src={nativeCurrency.logoUri} />
        <p>{formatNativeToken(totalAmount)}</p>
      </div>
    </div>
  )
}
