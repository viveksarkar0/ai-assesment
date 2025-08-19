import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getWeatherData } from "@/lib/api/weather";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();

  try {
    // Get the last user message
    const lastMessage = messages[messages.length - 1]?.content || "";

    // Mock AI responses with tool calling simulation
    let response = "";
    let toolResult = null;

    // Check for weather requests
    if (
      lastMessage.toLowerCase().includes("weather") ||
      lastMessage.toLowerCase().includes("temp") ||
      lastMessage.toLowerCase().includes("temperature")
    ) {
      const location = extractLocation(lastMessage) || "Delhi";
      try {
        const weatherData = await getWeatherData(location);
        toolResult = {
          toolName: "getWeather",
          args: { location },
          result: {
            name: weatherData.city,
            country: weatherData.country,
            main: {
              temp: parseInt(weatherData.temperature),
              humidity: parseInt(weatherData.humidity),
            },
            weather: [
              {
                main: weatherData.condition,
                description: weatherData.description,
              },
            ],
            wind: {
              speed:
                Math.round((parseFloat(weatherData.windSpeed) / 3.6) * 10) / 10,
            }, // Convert to m/s and round
          },
        };
        response = `Sure! Here's what the weather looks like in ${weatherData.city}, ${weatherData.country} right now:`;
      } catch (error) {
        console.error("Weather API error:", error);
        toolResult = {
          toolName: "getWeather",
          args: { location },
          result: {
            name: location,
            error: "Weather data unavailable",
            main: { temp: "N/A", humidity: "N/A" },
            weather: [
              { main: "Unknown", description: "weather data unavailable" },
            ],
            wind: { speed: "N/A" },
          },
        };
        response = `Hmm, I'm having trouble getting the weather info for ${location} right now. Could you try asking again in a moment?`;
      }
    }
    // Check for F1 requests
    else if (
      lastMessage.toLowerCase().includes("f1") ||
      lastMessage.toLowerCase().includes("formula")
    ) {
      // Determine F1 query type
      let f1Type = "next-race";
      if (
        lastMessage.toLowerCase().includes("result") ||
        lastMessage.toLowerCase().includes("latest")
      ) {
        f1Type = "latest-race";
      } else if (lastMessage.toLowerCase().includes("standing")) {
        f1Type = "standings";
      }

      toolResult = {
        toolName: "getF1Results",
        args: { type: f1Type },
        result:
          f1Type === "latest-race"
            ? {
                MRData: {
                  RaceTable: {
                    Races: [
                      {
                        raceName: "Dutch Grand Prix",
                        round: "15",
                        date: "2024-08-25",
                        Circuit: {
                          circuitName: "Circuit Zandvoort",
                          Location: {
                            locality: "Zandvoort",
                            country: "Netherlands",
                          },
                        },
                        Results: [
                          {
                            position: "1",
                            Driver: {
                              givenName: "Max",
                              familyName: "Verstappen",
                            },
                            Constructor: { name: "Red Bull Racing" },
                            Time: { time: "1:30:45.123" },
                            points: "25",
                          },
                          {
                            position: "2",
                            Driver: {
                              givenName: "Lando",
                              familyName: "Norris",
                            },
                            Constructor: { name: "McLaren" },
                            Time: { time: "+22.896" },
                            points: "18",
                          },
                          {
                            position: "3",
                            Driver: {
                              givenName: "Charles",
                              familyName: "Leclerc",
                            },
                            Constructor: { name: "Ferrari" },
                            Time: { time: "+25.439" },
                            points: "15",
                          },
                        ],
                      },
                    ],
                  },
                },
              }
            : f1Type === "standings"
              ? {
                  MRData: {
                    StandingsTable: {
                      StandingsLists: [
                        {
                          season: "2024",
                          DriverStandings: [
                            {
                              position: "1",
                              Driver: {
                                givenName: "Max",
                                familyName: "Verstappen",
                              },
                              Constructors: [{ name: "Red Bull Racing" }],
                              points: "393",
                              wins: "9",
                            },
                            {
                              position: "2",
                              Driver: {
                                givenName: "Lando",
                                familyName: "Norris",
                              },
                              Constructors: [{ name: "McLaren" }],
                              points: "331",
                              wins: "3",
                            },
                            {
                              position: "3",
                              Driver: {
                                givenName: "Charles",
                                familyName: "Leclerc",
                              },
                              Constructors: [{ name: "Ferrari" }],
                              points: "307",
                              wins: "2",
                            },
                          ],
                        },
                      ],
                    },
                  },
                }
              : {
                  MRData: {
                    RaceTable: {
                      Races: [
                        {
                          raceName: "Singapore Grand Prix",
                          round: "18",
                          Circuit: {
                            circuitName: "Marina Bay Street Circuit",
                            Location: {
                              locality: "Singapore",
                              country: "Singapore",
                            },
                          },
                          date: "2024-09-22",
                          time: "12:00:00Z",
                        },
                      ],
                    },
                  },
                },
      };
      response =
        f1Type === "latest-race"
          ? `Here are the latest Formula 1 race results:`
          : f1Type === "standings"
            ? `Here are the current F1 driver standings:`
            : `Here's the next Formula 1 race information:`;
    }
    // Check for stock requests
    else if (
      lastMessage.toLowerCase().includes("stock") ||
      lastMessage.toLowerCase().includes("price")
    ) {
      const symbol = extractStockSymbol(lastMessage) || "AAPL";
      toolResult = {
        toolName: "getStockPrice",
        args: { symbol },
        result: {
          results: [
            {
              c: 150.25,
              h: 152.1,
              l: 149.8,
              o: 151.0,
              v: 45000000,
            },
          ],
        },
      };
      response = `Here's the stock information for ${symbol}:`;
    } else {
      // Handle location corrections first (only if previous message was about weather)
      const correctedLocation = extractLocationCorrection(
        lastMessage,
        messages,
      );
      if (correctedLocation && isWeatherContext(messages)) {
        try {
          const weatherData = await getWeatherData(correctedLocation);
          toolResult = {
            toolName: "getWeather",
            args: { location: correctedLocation },
            result: {
              name: weatherData.city,
              country: weatherData.country,
              main: {
                temp: parseInt(weatherData.temperature),
                humidity: parseInt(weatherData.humidity),
              },
              weather: [
                {
                  main: weatherData.condition,
                  description: weatherData.description,
                },
              ],
              wind: {
                speed:
                  Math.round((parseFloat(weatherData.windSpeed) / 3.6) * 10) /
                  10,
              },
            },
          };
          response = `Got it! You meant ${weatherData.city}, ${weatherData.country}. Here's what the weather is like there:`;
        } catch (error) {
          console.error("Weather API error:", error);
          response = `I'm having trouble getting the weather info for ${correctedLocation} right now. Mind trying again?`;
        }
      }
      // Handle greetings and general conversation
      else {
        const lowerMessage = lastMessage.toLowerCase();

        if (
          lowerMessage.includes("hi") ||
          lowerMessage.includes("hello") ||
          lowerMessage.includes("hey")
        ) {
          response = `Hey there! 👋 I'm here to help out. What's on your mind today?`;
        } else if (
          lowerMessage.includes("how are you") ||
          lowerMessage.includes("how do you do")
        ) {
          response = `I'm doing awesome, thanks for asking! 😊 What can I help you with today?`;
        } else if (lowerMessage.includes("good morning")) {
          response = `Good morning! I hope you're having a wonderful day. How can I help you today?`;
        } else if (lowerMessage.includes("good afternoon")) {
          response = `Good afternoon! How can I assist you today?`;
        } else if (lowerMessage.includes("good evening")) {
          response = `Good evening! What can I help you with tonight?`;
        } else if (
          lowerMessage.includes("thank") ||
          lowerMessage.includes("thanks")
        ) {
          response = `You're totally welcome! Happy to help anytime. What else can I do for you?`;
        } else if (
          lowerMessage.includes("bye") ||
          lowerMessage.includes("goodbye") ||
          lowerMessage.includes("see you")
        ) {
          response = `See you later! Feel free to come back and chat anytime. Have an awesome day! 👋`;
        } else if (
          lowerMessage.includes("help") ||
          lowerMessage.includes("what can you do")
        ) {
          response = `I can help you with:

🌤️ **Weather Information** - Ask "What's the weather in [city]?"
🏎️ **Formula 1 Updates** - Ask "Next F1 race" or "F1 standings"
📈 **Stock Prices** - Ask "[SYMBOL] stock price"

I can also have general conversations and answer questions. What would you like to explore?`;
        } else if (
          lowerMessage.includes("optimize") ||
          lowerMessage.includes("improve") ||
          lowerMessage.includes("enhancement") ||
          lowerMessage.includes("better") ||
          lowerMessage.includes("fix")
        ) {
          response = `Great! I'm always working to improve. Here are some recent optimizations I've implemented:

✅ **Instant Message Display** - Your messages now appear immediately when sent
✅ **Thinking Indicator** - Shows when I'm processing your request
✅ **Better City Recognition** - Improved handling of city names like "Dehradun"
✅ **Smarter Responses** - More contextual and helpful replies
✅ **Background Processing** - Database operations don't block the chat

Is there something specific you'd like me to optimize or improve? I'm here to help make your experience better!`;
        } else if (
          lowerMessage.includes("america") ||
          lowerMessage.includes("american") ||
          lowerMessage.includes("usa") ||
          lowerMessage.includes("united states")
        ) {
          response = `I can help with information about American cities too! I know about major US cities like New York, Los Angeles, Chicago, Houston, Miami, Seattle, and many more.

🌤️ **Weather**: Try "What's the weather in New York?" or "Miami weather"
🏎️ **Formula 1**: Ask about F1 races and standings
📈 **Stocks**: US stock prices like "AAPL stock price"

What would you like to know about?`;
        } else if (
          lowerMessage.includes("dont know") ||
          lowerMessage.includes("don't know") ||
          lowerMessage.includes("you know") ||
          lowerMessage.includes("do you know")
        ) {
          response = `You're right, I'm always learning! I have good knowledge about:

🌍 **Weather** - Current conditions for cities worldwide
🏎️ **Formula 1** - Race results, standings, and schedules
📈 **Stocks** - Real-time stock prices and market data
💬 **General Topics** - I can chat about many subjects

Is there something specific you'd like me to help you learn about or find information on?`;
        } else {
          // For unclear requests, provide a friendly and conversational response
          response = `I'm here to chat and help! I can tell you about weather anywhere in the world, Formula 1 updates, stock prices, or we can just have a conversation about whatever's on your mind. What interests you?`;
        }
      }
    }

    // Create streaming response with tool results
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        // First send the text response
        const chunks = response.split(" ");
        let i = 0;

        const sendChunk = () => {
          if (i < chunks.length) {
            controller.enqueue(encoder.encode(chunks[i] + " "));
            i++;
            setTimeout(sendChunk, 30); // Faster typing speed
          } else {
            // After text, send tool result if available
            if (toolResult) {
              setTimeout(() => {
                controller.enqueue(
                  encoder.encode(
                    `\n\nTOOL_RESULT:${JSON.stringify(toolResult)}`,
                  ),
                );
                controller.close();
              }, 200);
            } else {
              controller.close();
            }
          }
        };

        sendChunk();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response("Sorry, I encountered an error. Please try again.", {
      headers: { "Content-Type": "text/plain" },
    });
  }
}

function isWeatherContext(messages: any[]): boolean {
  // Check if any of the last 3 messages mentioned weather
  const recentMessages = messages.slice(-3);
  return recentMessages.some(
    (msg) => msg.content && msg.content.toLowerCase().includes("weather"),
  );
}

function extractLocationCorrection(
  message: string,
  messages: any[],
): string | null {
  const lowerMessage = message.toLowerCase();

  // Only process if message seems like a location correction
  if (
    !lowerMessage.includes("not") &&
    !lowerMessage.includes("no") &&
    !lowerMessage.includes("meant") &&
    !lowerMessage.includes("actually")
  ) {
    return null;
  }

  // Check for clear correction patterns with weather context
  const correctionPatterns = [
    /not\s+[a-zA-Z\s]+,?\s+([a-zA-Z\s]+)/i, // "not new york, dehradun"
    /no,?\s*([a-zA-Z\s]+)\s+weather/i, // "no, dehradun weather"
    /i?\s*meant?\s+([a-zA-Z\s]+)/i, // "i meant dehradun"
    /actually\s+([a-zA-Z\s]+)/i, // "actually dehradun"
  ];

  for (const pattern of correctionPatterns) {
    const match = lowerMessage.match(pattern);
    if (match) {
      const location = match[1];
      if (location) {
        const cleanLocation = location
          .trim()
          .replace(/\b(weather|of|in|for|at)\b/gi, "")
          .trim();
        if (cleanLocation && cleanLocation.length > 2) {
          // Check if it's a valid city name
          const cityMatch = cleanLocation.match(
            /\b(dehradhun|dehradun|delhi|mumbai|bangalore|kolkata|chennai|hyderabad|pune|ahmedabad|jaipur|lucknow|kanpur|nagpur|indore|thane|bhopal|visakhapatnam|pimpri|patna|vadodara|ghaziabad|ludhiana|agra|nashik|faridabad|meerut|rajkot|kalyan|vasai|varanasi|srinagar|aurangabad|dhanbad|amritsar|navi|allahabad|ranchi|howrah|coimbatore|jabalpur|gwalior|vijayawada|jodhpur|madurai|raipur|kota|guwahati|chandigarh|solapur|hubballi|tiruchirappalli|bareilly|moradabad|mysore|tiruppur|gurgaon|aligarh|jalandhar|bhubaneswar|salem|warangal|guntur|bhiwandi|saharanpur|gorakhpur|bikaner|amravati|noida|jamshedpur|bhilai|cuttack|firozabad|kochi|nellore|bhavnagar|durgapur|asansol|rourkela|nanded|kolhapur|ajmer|akola|gulbarga|jamnagar|ujjain|loni|siliguri|jhansi|ulhasnagar|jammu|sangli|mangalore|erode|belgaum|ambattur|tirunelveli|malegaon|gaya|jalgaon|udaipur|maheshtala|london|paris|tokyo|beijing|moscow|sydney|toronto|vancouver|seattle|chicago|miami|boston|atlanta|dallas|houston|phoenix|denver|las vegas|san francisco|los angeles|new york|washington|philadelphia|detroit|minneapolis|orlando|cleveland|pittsburgh|cincinnati|kansas city|nashville|memphis|milwaukee|baltimore|sacramento|portland|san diego|san jose|jacksonville|charlotte|indianapolis|columbus|fort worth|san antonio|austin|el paso|fresno|oklahoma city|louisville|tucson|albuquerque|mesa|virginia beach|colorado springs|omaha|raleigh|long beach|virginia beach)\b/i,
          );
          if (cityMatch) {
            return correctCityName(cityMatch[1]);
          }
        }
      }
    }
  }

  return null;
}

function extractLocation(message: string): string | null {
  const patterns = [
    /what'?s\s+the\s+weather.*?like.*?in\s+([^?!.]+)/i,
    /what'?s\s+the\s+weather.*?in\s+([^?!.]+)/i,
    /what'?s\s+the\s+temp.*?in\s+([^?!.]+)/i,
    /what\s+temp.*?is\s+([^?!.]+)/i,
    /what.*?temperature.*?in\s+([^?!.]+)/i,
    /temperature.*?in\s+([^?!.]+)/i,
    /temp.*?is\s+([^?!.]+)/i,
    /temp.*?in\s+([^?!.]+)/i,
    /weather\s+like\s+in\s+([^?!.]+)/i,
    /weather\s+in\s+([^?!.]+)/i,
    /weather\s+for\s+([^?!.]+)/i,
    /weather\s+at\s+([^?!.]+)/i,
    /weather\s+of\s+([^?!.]+)/i,
    /weather\s+like\s+([^?!.]+)/i,
    /weather\s+([a-zA-Z\s]+?)(?:\?|$)/i,
    /([a-zA-Z\s]{3,})\s+weather/i,
    /([a-zA-Z\s]{3,})\s+temp(?:erature)?/i,
    /know\s+([a-zA-Z\s]+)\s+weather/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      let location = match[1].trim();
      // Clean up common words and punctuation
      location = location
        .replace(
          /\b(the|weather|temp|temperature|of|in|for|at|like|is|are|today|now|currently|what)\b/gi,
          "",
        )
        .replace(/[?!.,;:]/g, "")
        .replace(/\s+/g, " ")
        .trim();
      if (location && location.length > 1) {
        return correctCityName(location);
      }
    }
  }

  // Fallback: look for city names anywhere in the message
  const cityMatch = message.match(
    /\b(dehradhun|dehradun|delhi|mumbai|bangalore|kolkata|chennai|hyderabad|pune|ahmedabad|jaipur|lucknow|kanpur|nagpur|indore|thane|bhopal|visakhapatnam|pimpri|patna|vadodara|ghaziabad|ludhiana|agra|nashik|faridabad|meerut|rajkot|kalyan|vasai|varanasi|srinagar|aurangabad|dhanbad|amritsar|navi|allahabad|ranchi|howrah|coimbatore|jabalpur|gwalior|vijayawada|jodhpur|madurai|raipur|kota|guwahati|chandigarh|solapur|hubballi|tiruchirappalli|bareilly|moradabad|mysore|tiruppur|gurgaon|aligarh|jalandhar|bhubaneswar|salem|warangal|guntur|bhiwandi|saharanpur|gorakhpur|bikaner|amravati|noida|jamshedpur|bhilai|cuttack|firozabad|kochi|nellore|bhavnagar|durgapur|asansol|rourkela|nanded|kolhapur|ajmer|akola|gulbarga|jamnagar|ujjain|loni|siliguri|jhansi|ulhasnagar|jammu|sangli|mangalore|erode|belgaum|ambattur|tirunelveli|malegaon|gaya|jalgaon|udaipur|maheshtala|london|paris|tokyo|beijing|moscow|sydney|toronto|vancouver|seattle|chicago|miami|boston|atlanta|dallas|houston|phoenix|denver|las vegas|san francisco|los angeles|new york|washington|philadelphia|detroit|minneapolis|orlando|cleveland|pittsburgh|cincinnati|kansas city|nashville|memphis|milwaukee|baltimore|sacramento|portland|san diego|san jose|jacksonville|charlotte|indianapolis|columbus|fort worth|san antonio|austin|el paso|fresno|oklahoma city|louisville|tucson|albuquerque|mesa|virginia beach|colorado springs|omaha|raleigh|long beach)\b/i,
  );

  if (cityMatch) {
    return correctCityName(cityMatch[1]);
  }

  return null;
}

function correctCityName(city: string): string {
  const cityCorrections: Record<string, string> = {
    dehradhun: "Dehradun",
    dehradun: "Dehradun",
    delhi: "Delhi",
    mumbai: "Mumbai",
    bangalore: "Bangalore",
    kolkata: "Kolkata",
    chennai: "Chennai",
    hyderabad: "Hyderabad",
    pune: "Pune",
    ahmedabad: "Ahmedabad",
    jaipur: "Jaipur",
    lucknow: "Lucknow",
    kanpur: "Kanpur",
    nagpur: "Nagpur",
    indore: "Indore",
    thane: "Thane",
    bhopal: "Bhopal",
    visakhapatnam: "Visakhapatnam",
    patna: "Patna",
    vadodara: "Vadodara",
    ghaziabad: "Ghaziabad",
    ludhiana: "Ludhiana",
    agra: "Agra",
    nashik: "Nashik",
    faridabad: "Faridabad",
    meerut: "Meerut",
    rajkot: "Rajkot",
    varanasi: "Varanasi",
    srinagar: "Srinagar",
    aurangabad: "Aurangabad",
    dhanbad: "Dhanbad",
    amritsar: "Amritsar",
    allahabad: "Allahabad",
    ranchi: "Ranchi",
    howrah: "Howrah",
    coimbatore: "Coimbatore",
    jabalpur: "Jabalpur",
    gwalior: "Gwalior",
    vijayawada: "Vijayawada",
    jodhpur: "Jodhpur",
    madurai: "Madurai",
    raipur: "Raipur",
    kota: "Kota",
    guwahati: "Guwahati",
    chandigarh: "Chandigarh",
    solapur: "Solapur",
    hubballi: "Hubballi",
    tiruchirappalli: "Tiruchirappalli",
    bareilly: "Bareilly",
    moradabad: "Moradabad",
    mysore: "Mysore",
    tiruppur: "Tiruppur",
    gurgaon: "Gurgaon",
    aligarh: "Aligarh",
    jalandhar: "Jalandhar",
    bhubaneswar: "Bhubaneswar",
    salem: "Salem",
    warangal: "Warangal",
    guntur: "Guntur",
    bhiwandi: "Bhiwandi",
    saharanpur: "Saharanpur",
    gorakhpur: "Gorakhpur",
    bikaner: "Bikaner",
    amravati: "Amravati",
    noida: "Noida",
    jamshedpur: "Jamshedpur",
    bhilai: "Bhilai",
    cuttack: "Cuttack",
    firozabad: "Firozabad",
    kochi: "Kochi",
    nellore: "Nellore",
    bhavnagar: "Bhavnagar",
    durgapur: "Durgapur",
    asansol: "Asansol",
    rourkela: "Rourkela",
    nanded: "Nanded",
    kolhapur: "Kolhapur",
    ajmer: "Ajmer",
    akola: "Akola",
    gulbarga: "Gulbarga",
    jamnagar: "Jamnagar",
    ujjain: "Ujjain",
    loni: "Loni",
    siliguri: "Siliguri",
    jhansi: "Jhansi",
    ulhasnagar: "Ulhasnagar",
    jammu: "Jammu",
    sangli: "Sangli",
    mangalore: "Mangalore",
    erode: "Erode",
    belgaum: "Belgaum",
    ambattur: "Ambattur",
    tirunelveli: "Tirunelveli",
    malegaon: "Malegaon",
    gaya: "Gaya",
    jalgaon: "Jalgaon",
    udaipur: "Udaipur",
    maheshtala: "Maheshtala",
    // American cities
    "new york": "New York",
    "los angeles": "Los Angeles",
    chicago: "Chicago",
    houston: "Houston",
    phoenix: "Phoenix",
    philadelphia: "Philadelphia",
    "san antonio": "San Antonio",
    "san diego": "San Diego",
    dallas: "Dallas",
    "san jose": "San Jose",
    austin: "Austin",
    jacksonville: "Jacksonville",
    "fort worth": "Fort Worth",
    columbus: "Columbus",
    charlotte: "Charlotte",
    "san francisco": "San Francisco",
    indianapolis: "Indianapolis",
    seattle: "Seattle",
    denver: "Denver",
    washington: "Washington",
    boston: "Boston",
    "el paso": "El Paso",
    detroit: "Detroit",
    nashville: "Nashville",
    memphis: "Memphis",
    portland: "Portland",
    "oklahoma city": "Oklahoma City",
    "las vegas": "Las Vegas",
    louisville: "Louisville",
    baltimore: "Baltimore",
    milwaukee: "Milwaukee",
    albuquerque: "Albuquerque",
    tucson: "Tucson",
    fresno: "Fresno",
    sacramento: "Sacramento",
    "kansas city": "Kansas City",
    mesa: "Mesa",
    atlanta: "Atlanta",
    "colorado springs": "Colorado Springs",
    raleigh: "Raleigh",
    omaha: "Omaha",
    miami: "Miami",
    "long beach": "Long Beach",
    "virginia beach": "Virginia Beach",
    minneapolis: "Minneapolis",
    cleveland: "Cleveland",
    "new orleans": "New Orleans",
    orlando: "Orlando",
    // International cities
    london: "London",
    paris: "Paris",
    tokyo: "Tokyo",
    beijing: "Beijing",
    moscow: "Moscow",
    sydney: "Sydney",
    toronto: "Toronto",
    vancouver: "Vancouver",
  };

  const lowerCity = city.toLowerCase().trim();
  return (
    cityCorrections[lowerCity] ||
    city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()
  );
}

function extractStockSymbol(message: string): string | null {
  const patterns = [
    /([A-Z]{1,5}) stock/i,
    /([A-Z]{1,5}) price/i,
    /stock ([A-Z]{1,5})/i,
    /price ([A-Z]{1,5})/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      return match[1].toUpperCase();
    }
  }
  return null;
}
