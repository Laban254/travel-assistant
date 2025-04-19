"use client"

import type { QueryHistoryItem } from "@/components/travel-query-app"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { History, MapPin, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { motion } from "framer-motion"

interface QueryHistoryProps {
  history: QueryHistoryItem[]
  onSelectItem: (item: QueryHistoryItem) => void
  onClearHistory: () => void
}

export default function QueryHistory({ history, onSelectItem, onClearHistory }: QueryHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 md:p-6 h-full border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <History className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          <h2 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-100">Query History</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-6 md:py-8 text-center">
          <div className="bg-slate-100 dark:bg-slate-700 rounded-full p-3 mb-3">
            <History className="h-6 w-6 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Your previous queries will appear here.</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Try submitting a query to get started.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 h-full border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          <h2 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-100">Query History</h2>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-500">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Clear history</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear history?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your query history. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onClearHistory} className="bg-red-500 hover:bg-red-600">
                Clear
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <ScrollArea className="h-[calc(100vh-220px)] md:h-[calc(100vh-240px)]">
        <div className="space-y-2 md:space-y-3 pr-3">
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Button
                variant="ghost"
                className="w-full justify-start text-left h-auto py-2 md:py-3 px-3 md:px-4 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-lg"
                onClick={() => onSelectItem(item)}
              >
                <div className="flex flex-col items-start gap-1 w-full">
                  <div className="flex items-center gap-1 text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200 truncate w-full">
                    <MapPin className="h-3 w-3 md:h-3.5 md:w-3.5 shrink-0 text-slate-500 dark:text-slate-400" />
                    <span className="truncate">{item.query}</span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(item.timestamp).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {item.response.destination}
                    </span>
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
