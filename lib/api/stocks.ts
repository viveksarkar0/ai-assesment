interface StockData {
  symbol: string
  price: string
  change: string
  changePercent: string
  volume: string
  high: string
  low: string
  open: string
  previousClose: string
  interval: string
}

export async function getStockData(symbol: string, interval = "daily"): Promise<StockData> {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY
    if (!apiKey) {
      console.log("[v0] Using demo stock data - API key not configured")
      const demoPrice = 150 + Math.random() * 50 // Random price between 150-200
      const demoChange = (Math.random() - 0.5) * 10 // Random change between -5 to +5
      const changePercent = (demoChange / demoPrice) * 100

      return {
        symbol: symbol.toUpperCase(),
        price: `$${demoPrice.toFixed(2)}`,
        change: demoChange >= 0 ? `+$${demoChange.toFixed(2)}` : `-$${Math.abs(demoChange).toFixed(2)}`,
        changePercent: demoChange >= 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`,
        volume: "1,234,567",
        high: `$${(demoPrice + 5).toFixed(2)}`,
        low: `$${(demoPrice - 5).toFixed(2)}`,
        open: `$${(demoPrice - demoChange).toFixed(2)}`,
        previousClose: `$${(demoPrice - demoChange).toFixed(2)}`,
        interval,
      }
    }

    // Use different function based on interval
    const func = interval === "daily" ? "GLOBAL_QUOTE" : "TIME_SERIES_INTRADAY"
    let url = `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&apikey=${apiKey}`

    if (func === "TIME_SERIES_INTRADAY") {
      url += `&interval=${interval}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Stock API error: ${response.status}`)
    }

    const data = await response.json()

    if (data["Error Message"]) {
      throw new Error(data["Error Message"])
    }

    if (func === "GLOBAL_QUOTE") {
      const quote = data["Global Quote"]
      const price = Number.parseFloat(quote["05. price"])
      const change = Number.parseFloat(quote["09. change"])
      const changePercent = Number.parseFloat(quote["10. change percent"].replace("%", ""))

      return {
        symbol: quote["01. symbol"],
        price: `$${price.toFixed(2)}`,
        change: change >= 0 ? `+$${change.toFixed(2)}` : `-$${Math.abs(change).toFixed(2)}`,
        changePercent: change >= 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`,
        volume: Number.parseInt(quote["06. volume"]).toLocaleString(),
        high: `$${Number.parseFloat(quote["03. high"]).toFixed(2)}`,
        low: `$${Number.parseFloat(quote["04. low"]).toFixed(2)}`,
        open: `$${Number.parseFloat(quote["02. open"]).toFixed(2)}`,
        previousClose: `$${Number.parseFloat(quote["08. previous close"]).toFixed(2)}`,
        interval: "daily",
      }
    } else {
      // Handle intraday data
      const timeSeriesKey = `Time Series (${interval})`
      const timeSeries = data[timeSeriesKey]
      const latestTime = Object.keys(timeSeries)[0]
      const latestData = timeSeries[latestTime]

      const price = Number.parseFloat(latestData["4. close"])
      const open = Number.parseFloat(latestData["1. open"])
      const change = price - open
      const changePercent = (change / open) * 100

      return {
        symbol,
        price: `$${price.toFixed(2)}`,
        change: change >= 0 ? `+$${change.toFixed(2)}` : `-$${Math.abs(change).toFixed(2)}`,
        changePercent: change >= 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`,
        volume: Number.parseInt(latestData["5. volume"]).toLocaleString(),
        high: `$${Number.parseFloat(latestData["2. high"]).toFixed(2)}`,
        low: `$${Number.parseFloat(latestData["3. low"]).toFixed(2)}`,
        open: `$${open.toFixed(2)}`,
        previousClose: "N/A",
        interval,
      }
    }
  } catch (error) {
    console.error("Stock API error:", error)
    // Return fallback data
    return {
      symbol,
      price: "N/A",
      change: "N/A",
      changePercent: "N/A",
      volume: "N/A",
      high: "N/A",
      low: "N/A",
      open: "N/A",
      previousClose: "N/A",
      interval,
    }
  }
}
