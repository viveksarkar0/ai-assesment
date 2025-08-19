import { getStockData } from "@/lib/api/stocks";

export async function GET() {
  try {
    // Test with AAPL stock
    const stockData = await getStockData("AAPL");

    return Response.json({
      success: true,
      apiKeyConfigured: !!process.env.ALPHAVANTAGE_API_KEY,
      testSymbol: "AAPL",
      data: stockData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      apiKeyConfigured: !!process.env.ALPHAVANTAGE_API_KEY,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
