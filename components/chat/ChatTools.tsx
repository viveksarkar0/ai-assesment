"use client";

import React from "react";
import { WeatherCard } from "@/components/tool-cards/WeatherCard";
import { F1Card } from "@/components/tool-cards/F1Card";
import { StockCard } from "@/components/tool-cards/StockCard";

interface ChatToolsProps {
  tool: any;
}

export function ChatTools({ tool }: ChatToolsProps) {
  if (!tool.result) return null;

  switch (tool.toolName) {
    case "getWeather": {
      const weatherData = {
        city: tool.result.name || tool.args?.location || "Unknown",
        country: "Country",
        temperature: tool.result.main?.temp
          ? `${Math.round(tool.result.main.temp)}°C`
          : "N/A",
        condition: tool.result.weather?.[0]?.main || "Clear",
        humidity: tool.result.main?.humidity
          ? `${tool.result.main.humidity}%`
          : "N/A",
        windSpeed: tool.result.wind?.speed
          ? `${tool.result.wind.speed} m/s`
          : "N/A",
        description: tool.result.weather?.[0]?.description || "clear sky",
      };
      return <WeatherCard data={weatherData} />;
    }

    case "getF1Results": {
      if (
        tool.args?.type === "next-race" &&
        tool.result?.MRData?.RaceTable?.Races?.length
      ) {
        const race = tool.result.MRData.RaceTable.Races[0];
        const scheduleData = {
          season: new Date(race.date).getFullYear().toString(),
          races: [
            {
              round: race.round,
              raceName: race.raceName,
              location: `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
              date: race.date,
              time: race.time || "",
            },
          ],
        };
        return <F1Card data={scheduleData} type="schedule" />;
      }

      if (
        tool.args?.type === "latest-race" &&
        tool.result?.MRData?.RaceTable?.Races?.length
      ) {
        const race = tool.result.MRData.RaceTable.Races[0];
        const latestRaceData = {
          raceName: race.raceName,
          round: race.round,
          date: race.date,
          results:
            race.Results?.map((res: any) => ({
              position: res.position,
              driver: `${res.Driver.givenName} ${res.Driver.familyName}`,
              constructor: res.Constructor.name,
              time: res.Time?.time || res.status,
              points: res.points,
            })) || [],
        };
        return <F1Card data={latestRaceData} type="latest-race" />;
      }

      if (
        tool.args?.type === "standings" &&
        tool.result?.MRData?.StandingsTable?.StandingsLists?.length
      ) {
        const standings = tool.result.MRData.StandingsTable.StandingsLists[0];
        const standingsData = {
          season: standings.season,
          drivers:
            standings.DriverStandings?.map((driver: any) => ({
              position: driver.position,
              driver: `${driver.Driver.givenName} ${driver.Driver.familyName}`,
              constructor: driver.Constructors?.[0]?.name || "",
              points: driver.points,
              wins: driver.wins,
            })) || [],
        };
        return <F1Card data={standingsData} type="standings" />;
      }

      // Fallback for F1 data
      return (
        <div className="p-4 bg-muted rounded-lg border">
          <h4 className="font-semibold mb-2">F1 Data (Debug)</h4>
          <pre className="text-sm overflow-auto max-h-48">
            {JSON.stringify(tool.result, null, 2)}
          </pre>
        </div>
      );
    }

    case "getStockPrice":
      return (
        <StockCard data={{ ...tool.result, symbol: tool.args?.symbol }} />
      );

    default:
      return (
        <div className="p-4 bg-muted rounded-lg border">
          <h4 className="font-semibold mb-2">Tool Result</h4>
          <pre className="text-sm overflow-auto max-h-48">
            {JSON.stringify(tool.result, null, 2)}
          </pre>
        </div>
      );
  }
}
