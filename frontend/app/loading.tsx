import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <Loader2 className="h-16 w-16 text-slate-400 animate-spin" />
      <p className="mt-6 text-slate-600 dark:text-slate-300 text-lg">Loading Travel Assistant...</p>
    </div>
  )
}
