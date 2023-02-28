export default function TxSequence({ sequence, style }: { sequence: string; style?: any }) {
  return (
    <div style={style} className="tx-seq">
      {sequence == '-1' ? '-' : sequence}
    </div>
  )
}
