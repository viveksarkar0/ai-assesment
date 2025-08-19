import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, CloudSun, Car, TrendingUp } from "lucide-react"
import Link from "next/link"
// import { AuthTest } from "@/components/AuthTest";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Navbar />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Your AI Assistant
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get instant weather updates, F1 race information, and stock market data through intelligent conversations
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/chat">
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Chatting
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>

        {/* Auth Test Section */}
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <CloudSun className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Real-time Weather</CardTitle>
              <CardDescription>Get current weather conditions and forecasts for any city worldwide</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                <Car className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>F1 Race Data</CardTitle>
              <CardDescription>Access live F1 standings, race results, and upcoming race schedules</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Stock Market</CardTitle>
              <CardDescription>Get real-time stock prices, market data, and financial insights</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Demo Section */}
        <div className="bg-muted/30 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">See it in action</h2>
            <p className="text-muted-foreground">Try these example queries to get started</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-background rounded-lg p-4 border">
              <p className="text-sm font-medium text-muted-foreground mb-2">Weather</p>
              <p className="text-sm">"What's the weather like in Tokyo?"</p>
            </div>
            <div className="bg-background rounded-lg p-4 border">
              <p className="text-sm font-medium text-muted-foreground mb-2">Formula 1</p>
              <p className="text-sm">"Show me the current F1 standings"</p>
            </div>
            <div className="bg-background rounded-lg p-4 border">
              <p className="text-sm font-medium text-muted-foreground mb-2">Stocks</p>
              <p className="text-sm">"What's Apple's stock price today?"</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="text-muted-foreground">Sign in with your Google or GitHub account to begin</p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/chat">Get Started Now</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
