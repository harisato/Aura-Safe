import { getNativeCurrency } from 'src/config'
import { Token } from 'src/logic/tokens/store/model/token'

export default function Amount({
  label = 'Amount',
  amount = '0',
  token,
}: {
  label?: string
  amount?: string
  token?: Token
}) {
  const nativeCurrency = getNativeCurrency()
  return (
    <div className="total-amount">
      <p className="title"> {label}</p>
      <div className="amount">
        <img alt={'nativeCurrencyLogoUri'} height={25} src={token?.logoUri || nativeCurrency.logoUri} />
        <p>{amount}</p>
      </div>
    </div>
  )
}
