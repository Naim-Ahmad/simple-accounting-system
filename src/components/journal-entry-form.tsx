"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock accounts - replace with API call
const mockAccounts = [
  { id: 1, name: "Cash in Hand", type: "Asset" },
  { id: 2, name: "Bank Account", type: "Asset" },
  { id: 3, name: "Accounts Receivable", type: "Asset" },
  { id: 4, name: "Office Equipment", type: "Asset" },
  { id: 5, name: "Accounts Payable", type: "Liability" },
  { id: 6, name: "Bank Loan", type: "Liability" },
  { id: 7, name: "Owner Equity", type: "Equity" },
  { id: 8, name: "Sales Revenue", type: "Revenue" },
  { id: 9, name: "Office Rent", type: "Expense" },
  { id: 10, name: "Utilities", type: "Expense" },
]

interface JournalEntryFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function JournalEntryForm({ onSubmit, onCancel }: JournalEntryFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    lines: [
      { accountId: "", accountName: "", type: "debit", amount: "" },
      { accountId: "", accountName: "", type: "credit", amount: "" },
    ],
  })
  const [errors, setErrors] = useState({})

  const addLine = () => {
    setFormData({
      ...formData,
      lines: [...formData.lines, { accountId: "", accountName: "", type: "debit", amount: "" }],
    })
  }

  const removeLine = (index) => {
    if (formData.lines.length > 2) {
      const newLines = formData.lines.filter((_, i) => i !== index)
      setFormData({ ...formData, lines: newLines })
    }
  }

  const updateLine = (index, field, value) => {
    const newLines = [...formData.lines]
    newLines[index] = { ...newLines[index], [field]: value }

    // If account is selected, update account name
    if (field === "accountId") {
      const account = mockAccounts.find((acc) => acc.id.toString() === value)
      newLines[index].accountName = account ? account.name : ""
    }

    setFormData({ ...formData, lines: newLines })
  }

  const getTotalDebit = () => {
    return formData.lines
      .filter((line) => line.type === "debit")
      .reduce((sum, line) => sum + (Number.parseFloat(line.amount) || 0), 0)
  }

  const getTotalCredit = () => {
    return formData.lines
      .filter((line) => line.type === "credit")
      .reduce((sum, line) => sum + (Number.parseFloat(line.amount) || 0), 0)
  }

  const isBalanced = () => {
    const debitTotal = getTotalDebit()
    const creditTotal = getTotalCredit()
    return debitTotal > 0 && creditTotal > 0 && debitTotal === creditTotal
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (formData.lines.length < 2) {
      newErrors.lines = "At least 2 lines are required"
    }

    const hasDebit = formData.lines.some((line) => line.type === "debit" && Number.parseFloat(line.amount) > 0)
    const hasCredit = formData.lines.some((line) => line.type === "credit" && Number.parseFloat(line.amount) > 0)

    if (!hasDebit || !hasCredit) {
      newErrors.balance = "Must have at least one debit and one credit entry"
    }

    if (!isBalanced()) {
      newErrors.balance = "Total debits must equal total credits"
    }

    formData.lines.forEach((line, index) => {
      if (!line.accountId) {
        newErrors[`line_${index}_account`] = "Account is required"
      }
      if (!line.amount || Number.parseFloat(line.amount) <= 0) {
        newErrors[`line_${index}_amount`] = "Amount must be greater than 0"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      const processedData = {
        ...formData,
        lines: formData.lines.map((line) => ({
          ...line,
          amount: Number.parseFloat(line.amount),
        })),
      }
      onSubmit(processedData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="e.g., Office rent payment for January"
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Journal Lines
            <Button type="button" variant="outline" size="sm" onClick={addLine}>
              <Plus className="h-4 w-4 mr-1" />
              Add Line
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.lines.map((line, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
              <div className="col-span-4 space-y-2">
                <Label>Account</Label>
                <Select value={line.accountId} onValueChange={(value) => updateLine(index, "accountId", value)}>
                  <SelectTrigger className={errors[`line_${index}_account`] ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        {account.name} ({account.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`line_${index}_account`] && (
                  <p className="text-xs text-red-500">{errors[`line_${index}_account`]}</p>
                )}
              </div>

              <div className="col-span-3 space-y-2">
                <Label>Type</Label>
                <Select value={line.type} onValueChange={(value) => updateLine(index, "type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debit">Debit</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-4 space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={line.amount}
                  onChange={(e) => updateLine(index, "amount", e.target.value)}
                  placeholder="0.00"
                  className={errors[`line_${index}_amount`] ? "border-red-500" : ""}
                />
                {errors[`line_${index}_amount`] && (
                  <p className="text-xs text-red-500">{errors[`line_${index}_amount`]}</p>
                )}
              </div>

              <div className="col-span-1">
                {formData.lines.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLine(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm">
              <span className="font-medium">Total Debit: </span>
              <span className="font-mono">৳{getTotalDebit().toLocaleString()}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Total Credit: </span>
              <span className="font-mono">৳{getTotalCredit().toLocaleString()}</span>
            </div>
            <div className={`text-sm font-medium ${isBalanced() ? "text-green-600" : "text-red-600"}`}>
              {isBalanced() ? "✓ Balanced" : "✗ Not Balanced"}
            </div>
          </div>

          {(errors.lines || errors.balance) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.lines || errors.balance}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isBalanced()}>
          Create Entry
        </Button>
      </div>
    </form>
  )
}
