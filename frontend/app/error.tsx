"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-6">
        <AlertTriangle className="h-12 w-12 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Something went wrong</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-6 text-center max-w-md">
        We encountered an error while loading the Travel Assistant. Please try again.
      </p>
      <Button onClick={reset} variant="default">
        Try again
      </Button>
    </div>
  )
}
