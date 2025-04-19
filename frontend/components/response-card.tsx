"use client"

import type { TravelResponse } from "@/components/travel-query-app"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { StampIcon as Passport, FileCheck, AlertTriangle, Loader2, Clock, Building } from "lucide-react"
import { motion } from "framer-motion"

interface ResponseCardProps {
  response: TravelResponse
  isLoading: boolean
}

export default function ResponseCard({ response, isLoading }: ResponseCardProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200 dark:border-slate-700">
        <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px] md:min-h-[300px]">
          <div className="relative">
            <Loader2 className="h-10 w-10 md:h-12 md:w-12 text-slate-400 animate-spin" />
            <div className="absolute inset-0 h-10 w-10 md:h-12 md:w-12 rounded-full border-t-2 border-slate-400 animate-ping opacity-20"></div>
          </div>
          <p className="mt-4 text-sm md:text-base text-slate-500 dark:text-slate-400">Analyzing your travel query...</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">This may take a few moments</p>
        </CardContent>
      </Card>
    )
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-slate-200 dark:border-slate-700 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 pb-4">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-lg md:text-xl">
            <span>Travel Information: {response.destination}</span>
            {response.origin && <CardDescription className="sm:ml-1">from {response.origin}</CardDescription>}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6 space-y-4 md:space-y-6">
          <motion.div className="space-y-2" custom={0} initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="flex items-center gap-2">
              <Passport className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <h3 className="font-medium text-slate-800 dark:text-slate-100">Visa Requirements</h3>
            </div>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 pl-7">{response.visaRequirements}</p>
          </motion.div>

          <motion.div className="space-y-2" custom={1} initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-green-500 dark:text-green-400" />
              <h3 className="font-medium text-slate-800 dark:text-slate-100">Required Documents</h3>
            </div>
            <ul className="list-disc pl-10 md:pl-12 space-y-1 text-sm md:text-base text-slate-600 dark:text-slate-300">
              {response.documents.map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="space-y-2" custom={2} initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h3 className="font-medium text-slate-800 dark:text-slate-100">Travel Advisories</h3>
            </div>
            <ul className="list-disc pl-10 md:pl-12 space-y-1 text-sm md:text-base text-slate-600 dark:text-slate-300">
              {response.advisories.map((advisory, index) => (
                <li key={index}>{advisory}</li>
              ))}
            </ul>
          </motion.div>

          {response.estimatedProcessingTime && (
            <motion.div className="space-y-2" custom={3} initial="hidden" animate="visible" variants={fadeInUp}>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                <h3 className="font-medium text-slate-800 dark:text-slate-100">Processing Time</h3>
              </div>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 pl-7">
                {response.estimatedProcessingTime}
              </p>
            </motion.div>
          )}

          {response.embassyInformation && (
            <motion.div className="space-y-2" custom={4} initial="hidden" animate="visible" variants={fadeInUp}>
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                <h3 className="font-medium text-slate-800 dark:text-slate-100">Embassy Information</h3>
              </div>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 pl-7">
                {response.embassyInformation}
              </p>
            </motion.div>
          )}

          <div className="text-xs text-slate-400 dark:text-slate-500 pt-2 text-right">
            Last updated: {new Date(response.timestamp).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
