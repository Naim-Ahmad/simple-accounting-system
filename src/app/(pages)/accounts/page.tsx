"use client"

import { AccountForm } from "@/components/account-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Filter, Plus, Search, Trash2 } from "lucide-react"
import { useState } from "react"

// Mock data - replace with API calls
const mockAccounts = [
  { id: 1, name: "Cash in Hand", type: "Asset", balance: 50000 },
  { id: 2, name: "Bank Account", type: "Asset", balance: 200000 },
  { id: 3, name: "Accounts Receivable", type: "Asset", balance: 75000 },
  { id: 4, name: "Office Equipment", type: "Asset", balance: 150000 },
  { id: 5, name: "Accounts Payable", type: "Liability", balance: 30000 },
  { id: 6, name: "Bank Loan", type: "Liability", balance: 100000 },
  { id: 7, name: "Owner Equity", type: "Equity", balance: 300000 },
  { id: 8, name: "Sales Revenue", type: "Revenue", balance: 180000 },
  { id: 9, name: "Office Rent", type: "Expense", balance: 25000 },
  { id: 10, name: "Utilities", type: "Expense", balance: 8000 },
]

const accountTypeColors = {
  Asset: "bg-blue-100 text-blue-800",
  Liability: "bg-red-100 text-red-800",
  Equity: "bg-green-100 text-green-800",
  Revenue: "bg-purple-100 text-purple-800",
  Expense: "bg-orange-100 text-orange-800",
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(mockAccounts)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || account.type === filterType
    return matchesSearch && matchesType
  })

  const handleAddAccount = (accountData) => {
    const newAccount = {
      id: accounts.length + 1,
      ...accountData,
      balance: 0,
    }
    setAccounts([...accounts, newAccount])
    setIsDialogOpen(false)
  }

  const handleEditAccount = (account) => {
    setEditingAccount(account)
    setIsDialogOpen(true)
  }

  const handleUpdateAccount = (accountData) => {
    setAccounts(accounts.map((acc) => (acc.id === editingAccount.id ? { ...acc, ...accountData } : acc)))
    setEditingAccount(null)
    setIsDialogOpen(false)
  }

  const handleDeleteAccount = (accountId) => {
    if (confirm("Are you sure you want to delete this account?")) {
      setAccounts(accounts.filter((acc) => acc.id !== accountId))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chart of Accounts</h1>
          <p className="text-gray-600 mt-2">Manage your accounting structure</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAccount(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingAccount ? "Edit Account" : "Add New Account"}</DialogTitle>
              <DialogDescription>
                {editingAccount
                  ? "Update the account information below."
                  : "Create a new account for your chart of accounts."}
              </DialogDescription>
            </DialogHeader>
            <AccountForm
              account={editingAccount}
              onSubmit={editingAccount ? handleUpdateAccount : handleAddAccount}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingAccount(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accounts Overview</CardTitle>
          <CardDescription>Total {filteredAccounts.length} accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Asset">Assets</SelectItem>
                <SelectItem value="Liability">Liabilities</SelectItem>
                <SelectItem value="Equity">Equity</SelectItem>
                <SelectItem value="Revenue">Revenue</SelectItem>
                <SelectItem value="Expense">Expenses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>
                      <Badge className={accountTypeColors[account.type]}>{account.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">৳{account.balance.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditAccount(account)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAccount(account.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
