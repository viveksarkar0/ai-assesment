import { getWeather } from './weather'
import { getF1Matches } from './f1'
import { getStockPrice } from './stocks'

export const tools = {
  getWeather,
  getF1Matches,
  getStockPrice,
}

export type ToolName = keyof typeof tools
