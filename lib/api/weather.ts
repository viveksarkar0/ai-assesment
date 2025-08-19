interface WeatherData {
  city: string
  country: string
  temperature: string
  condition: string
  humidity: string
  windSpeed: string
  description: string
}

export async function getWeatherData(city: string, country?: string): Promise<WeatherData> {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
      console.log("[v0] Using demo weather data - API key not configured")
      return {
        city,
        country: country || "Demo",
        temperature: "22°C",
        condition: "Partly Cloudy",
        humidity: "65%",
        windSpeed: "12 km/h",
        description: "partly cloudy with light winds",
      }
    }

    const query = country ? `${city},${country}` : city
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${apiKey}&units=metric`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      city: data.name,
      country: data.sys.country,
      temperature: `${Math.round(data.main.temp)}°C`,
      condition: data.weather[0].main,
      humidity: `${data.main.humidity}%`,
      windSpeed: `${Math.round(data.wind.speed * 3.6)} km/h`,
      description: data.weather[0].description,
    }
  } catch (error) {
    console.error("Weather API error:", error)
    // Return fallback data
    return {
      city,
      country: country || "Unknown",
      temperature: "N/A",
      condition: "Unknown",
      humidity: "N/A",
      windSpeed: "N/A",
      description: "Weather data unavailable",
    }
  }
}
