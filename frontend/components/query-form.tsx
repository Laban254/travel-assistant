"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plane, Send, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface QueryFormProps {
  onSubmit: (query: string) => void
  isLoading: boolean
}

const EXAMPLE_QUERIES = [
  "What documents do I need to travel from USA to Japan?",
  "Visa requirements for Indian citizens visiting Australia",
  "Do UK citizens need a visa to visit Canada?",
  "What vaccinations are required for traveling to Thailand from Germany?",
  "Travel advisories for Mexico for US citizens",
]

export default function QueryForm({ onSubmit, isLoading }: QueryFormProps) {
  const [query, setQuery] = useState("")
  const [showExamples, setShowExamples] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSubmit(query.trim())
    }
  }

  const handleExampleClick = (example: string) => {
    setQuery(example)
    setShowExamples(false)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [query])

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-800 rounded-lg shadow-md transition-all hover:shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
    >
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Plane className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          <h2 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-100">
            Ask about travel requirements
          </h2>
        </div>

        <div className="relative">
          <Textarea
            ref={textareaRef}
            placeholder="What documents do I need to travel from USA to Japan?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[100px] md:min-h-[120px] resize-none pr-10 focus-visible:ring-slate-400"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSubmit(e)
              }
            }}
          />
          <div className="absolute right-3 bottom-3">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              onClick={() => setShowExamples(!showExamples)}
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4" />
              <span className="sr-only">Show examples</span>
            </Button>
          </div>
        </div>

        {showExamples && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-50 dark:bg-slate-900 rounded-md p-3 space-y-2 overflow-x-auto"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Example queries:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_QUERIES.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  className="text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
                  onClick={() => handleExampleClick(example)}
                >
                  {example.length > 30 ? example.substring(0, 30) + "..." : example}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Press{" "}
            <kbd className="px-1.5 py-0.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded">
              ⌘
            </kbd>
            +
            <kbd className="px-1.5 py-0.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded">
              Enter
            </kbd>{" "}
            to submit
          </p>

          <Button type="submit" className="gap-2 w-full sm:w-auto" disabled={isLoading || !query.trim()}>
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Get Information
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
