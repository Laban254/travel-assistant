import { NextResponse } from "next/server"

// Define the expected response structure
interface TravelResponse {
  destination: string
  origin?: string
  visaRequirements: string
  documents: string[]
  advisories: string[]
  estimatedProcessingTime?: string
  embassyInformation?: string
  timestamp: string
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required and must be a non-empty string" }, { status: 400 })
    }

    const originDestinationRegex =
      /(?:from|travel(?:ing)? from)\s+([a-zA-Z\s]+)\s+(?:to|visit(?:ing)?)\s+([a-zA-Z\s]+)/i
    const destinationRegex = /(?:to|visit(?:ing)?)\s+([a-zA-Z\s]+)/i

    let origin: string | undefined
    let destination: string | undefined

    const originDestinationMatch = query.match(originDestinationRegex)
    if (originDestinationMatch) {
      origin = originDestinationMatch[1].trim()
      destination = originDestinationMatch[2].trim()
    } else {
      const destinationMatch = query.match(destinationRegex)
      if (destinationMatch) {
        destination = destinationMatch[1].trim()
      }
    }

    // If we couldn't extract a destination, use a fallback
    if (!destination) {
      destination = "Unknown destination"
    }

    const mockResponse: TravelResponse = {
      destination,
      origin,
      visaRequirements: `Tourist visa required for stays up to 90 days in ${destination}`,
      documents: [
        "Valid passport with at least 6 months validity",
        "Completed visa application form",
        "Proof of accommodation",
        "Return flight ticket",
        "Travel insurance",
        "Proof of sufficient funds",
      ],
      advisories: [
        "Check local COVID-19 restrictions before travel",
        "Register with your embassy upon arrival",
        "Carry photocopies of important documents",
        "Be aware of local customs and regulations",
      ],
      estimatedProcessingTime: "2-4 weeks for standard processing",
      embassyInformation: `${destination} Embassy can be contacted at embassy@${destination.toLowerCase().replace(/\s+/g, "")}.gov`,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("Error processing query:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process travel query" },
      { status: 500 },
    )
  }
}
