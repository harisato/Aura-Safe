import BigNumber from 'bignumber.js'
import { VoteMapping } from 'src/types/proposal'

function calcPercent(total: number, value: number): number {
  return (value * 100) / total || 0
}

function calcPercentInObj(obj: { [key: string]: any }): { [key: string]: number } {
  const keys = Object.keys(obj)

  const total = keys.reduce((total, key) => {
    return (total += Number(obj[key]))
  }, 0)

  const value = {}

  keys.forEach((key) => {
    Object.assign(value, {
      [key]: calcPercent(total, Number(obj[key])),
    })
  })

  return value
}

function calcVotePercent(obj: any): any {
  const keys = Object.keys(obj)
  const value = {}
  keys.forEach((key) => {
    Object.assign(value, {
      [VoteMapping[key]]: obj[key],
    })
  })

  return value
}

function maxVote(percent) {
  let max: { [x: string]: any } | null = null
  Object.keys(percent).forEach((key) => {
    if (!max) {
      max = {
        key: key,
        value: `${(+percent[key]).toFixed(2)}%`,
      }
      return
    }

    if (max[key] < percent[key]) {
      max = {
        key: key,
        value: `${(+percent[key]).toFixed(2)}%`,
      }
    }
  })

  return max
}

function calcBalance(amount: string, decimals: number): string {
  return new BigNumber(amount).dividedBy(Math.pow(10, decimals)).toString()
}

export { calcPercent, calcPercentInObj, calcVotePercent, maxVote, calcBalance }
