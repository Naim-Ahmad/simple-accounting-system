"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { JournalEntryForm } from "@/components/journal-entry-form"
import { Plus, Search, Eye, Calendar } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Mock data - replace with API calls
const mockJournalEntries = [
  {
    id: 1,
    date: "2024-01-15",
    description: "Office Rent Payment",
    lines: [
      { accountName: "Office Rent", type: "debit", amount: 25000 },
      { accountName: "Cash in Hand", type: "credit", amount: 25000 },
    ],
  },
  {
    id: 2,
    date: "2024-01-14",
    description: "Sales Revenue Collection",
    lines: [
      { accountName: "Cash in Hand", type: "debit", amount: 45000 },
      { accountName: "Sales Revenue", type: "credit", amount: 45000 },
    ],
  },
  {
    id: 3,
    date: "2024-01-13",
    description: "Equipment Purchase",
    lines: [
      { accountName: "Office Equipment", type: "debit", amount: 15000 },
      { accountName: "Bank Account", type: "credit", amount: 15000 },
    ],
  },
  {
    id: 4,
    date: "2024-01-12",
    description: "Utility Bill Payment",
    lines: [
      { accountName: "Utilities", type: "debit", amount: 3500 },
      { accountName: "Bank Account", type: "credit", amount: 3500 },
    ],
  },
]

export default function JournalEntriesPage() {
  const [journalEntries, setJournalEntries] = useState(mockJournalEntries)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [expandedEntries, setExpandedEntries] = useState(new Set())

  const filteredEntries = journalEntries.filter(
    (entry) =>
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.lines.some((line) => line.accountName.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddEntry = (entryData) => {
    const newEntry = {
      id: journalEntries.length + 1,
      ...entryData,
    }
    setJournalEntries([newEntry, ...journalEntries])
    setIsDialogOpen(false)
  }

  const toggleExpanded = (entryId) => {
    const newExpanded = new Set(expandedEntries)
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId)
    } else {
      newExpanded.add(entryId)
    }
    setExpandedEntries(newExpanded)
  }

  const getTotalAmount = (lines) => {
    return lines.reduce((sum, line) => sum + line.amount, 0) / 2 // Divide by 2 since debit = credit
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Journal Entries</h1>
          <p className="text-gray-600 mt-2">Record and manage accounting transactions</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Journal Entry</DialogTitle>
              <DialogDescription>Record a new accounting transaction with debits and credits.</DialogDescription>
            </DialogHeader>
            <JournalEntryForm onSubmit={handleAddEntry} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Total {filteredEntries.length} journal entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search entries or accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <Card key={entry.id} className="border-l-4 border-l-blue-500">
                <Collapsible>
                  <CollapsibleTrigger onClick={() => toggleExpanded(entry.id)} className="w-full">
                    <CardHeader className="hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {entry.date}
                          </div>
                          <div>
                            <CardTitle className="text-left text-lg">{entry.description}</CardTitle>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline" className="font-mono">
                            ৳{getTotalAmount(entry.lines).toLocaleString()}
                          </Badge>
                          <Eye className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Account</TableHead>
                              <TableHead className="text-right">Debit</TableHead>
                              <TableHead className="text-right">Credit</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {entry.lines.map((line, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{line.accountName}</TableCell>
                                <TableCell className="text-right font-mono">
                                  {line.type === "debit" ? `৳${line.amount.toLocaleString()}` : "-"}
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                  {line.type === "credit" ? `৳${line.amount.toLocaleString()}` : "-"}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="border-t-2 font-semibold bg-gray-50">
                              <TableCell>Total</TableCell>
                              <TableCell className="text-right font-mono">
                                ৳
                                {entry.lines
                                  .filter((line) => line.type === "debit")
                                  .reduce((sum, line) => sum + line.amount, 0)
                                  .toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                ৳
                                {entry.lines
                                  .filter((line) => line.type === "credit")
                                  .reduce((sum, line) => sum + line.amount, 0)
                                  .toLocaleString()}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
