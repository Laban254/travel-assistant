"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import QueryForm from "@/components/query-form"
import ResponseCard from "@/components/response-card"
import QueryHistory from "@/components/query-history"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"

// Define the response type
export type TravelResponse = {
  destination: string
  origin?: string
  visaRequirements: string
  documents: string[]
  advisories: string[]
  estimatedProcessingTime?: string
  embassyInformation?: string
  timestamp: string
}

// Define the query history item type
export type QueryHistoryItem = {
  id: string
  query: string
  response: TravelResponse
  timestamp: string
}

export default function TravelQueryApp() {
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<TravelResponse | null>(null)
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const { toast } = useToast()

  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Load query history from localStorage on initial render
  useEffect(() => {
    const savedHistory = localStorage.getItem("travelQueryHistory")
    if (savedHistory) {
      try {
        setQueryHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Failed to parse saved history:", e)
      }
    }
  }, [])

  // Save query history to localStorage whenever it changes
  useEffect(() => {
    if (queryHistory.length > 0) {
      localStorage.setItem("travelQueryHistory", JSON.stringify(queryHistory))
    }
  }, [queryHistory])

  const handleSubmitQuery = async (query: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get travel information")
      }

      const data = await response.json()
      setResponse(data)

      // Add to query history
      const historyItem: QueryHistoryItem = {
        id: Date.now().toString(),
        query,
        response: data,
        timestamp: new Date().toISOString(),
      }

      setQueryHistory((prev) => [historyItem, ...prev])

      // Show success toast
      toast({
        title: "Information retrieved",
        description: `Travel information for ${data.destination} has been loaded.`,
      })
    } catch (error) {
      console.error("Error fetching data:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get travel information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadFromHistory = (item: QueryHistoryItem) => {
    setResponse(item.response)
    setError(null)

    toast({
      title: "Loaded from history",
      description: `Showing results for: ${item.query}`,
    })
  }

  const clearHistory = () => {
    setQueryHistory([])
    localStorage.removeItem("travelQueryHistory")
    toast({
      title: "History cleared",
      description: "Your query history has been cleared.",
    })
  }

  return (
    <div className="min-h-screen">
      {/* Main content area */}
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <header className="mb-6 md:mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-slate-800 dark:text-slate-100">
            Travel Query Assistant
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Get detailed information about visa requirements, necessary documents, and travel advisories for your next
            international trip.
          </p>
        </header>

        {/* Responsive layout with grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content */}
          <div className="lg:col-span-8 space-y-6">
            <QueryForm onSubmit={handleSubmitQuery} isLoading={isLoading} />

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
                <p className="font-medium">Error retrieving information</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            {response && <ResponseCard response={response} isLoading={isLoading} />}

            {!response && !isLoading && !error && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 md:p-8 text-center border border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-300">
                  Submit a travel query to see information about visa requirements, necessary documents, and travel
                  advisories.
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Try queries like:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSubmitQuery("What do I need to travel from USA to Japan?")}
                    >
                      USA to Japan
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSubmitQuery("Visa requirements for traveling from India to Australia")}
                    >
                      India to Australia
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSubmitQuery("Documents needed for UK citizens visiting Canada")}
                    >
                      UK to Canada
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* History sidebar - visible on desktop */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-6">
              <QueryHistory history={queryHistory} onSelectItem={loadFromHistory} onClearHistory={clearHistory} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile history sheet */}
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg bg-white dark:bg-slate-800 z-50"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open history</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Query History</h2>
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
            <div className="p-4">
              <QueryHistory
                history={queryHistory}
                onSelectItem={(item) => {
                  loadFromHistory(item)
                  // Close the sheet on mobile after selecting an item
                  document.querySelector("[data-radix-collection-item]")?.click()
                }}
                onClearHistory={clearHistory}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
