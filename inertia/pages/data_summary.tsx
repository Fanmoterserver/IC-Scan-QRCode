// inertia/pages/data_summary.tsx
import { useState } from 'react'
import Layout from '../components/Layout'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface SummaryItem {
  id: number
  partPcb: string
  shift: string
  scanDate: string
  totalScan: number
}

interface DetailItem {
  id: number
  partPcb: string
  partIc: string
  productionName: string
  dc: string
  createdAt: string
}

interface Props {
  summaries: SummaryItem[]
}

export default function DataSummary({ summaries }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<SummaryItem | null>(null)
  const [details, setDetails] = useState<DetailItem[]>([])

  async function handleRowClick(item: SummaryItem) {
    setSelected(item)
    setSheetOpen(true)
    setLoading(true)
    setDetails([])

    const params = new URLSearchParams({
      partPcb: item.partPcb,
      shift: item.shift,
      date: item.scanDate,
    })
    const res = await fetch(`/data-summary/details?${params.toString()}`)
    const data = await res.json()
    setDetails(data)
    setLoading(false)
  }

  return (
    <Layout>
      <div className="flex justify-center p-6">
        <div className="w-full max-w-3xl">
          <h1 className="mb-6 text-center text-2xl font-bold">Data Summary</h1>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part PCB</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total Scan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-400">
                    No data yet
                  </TableCell>
                </TableRow>
              )}
              {summaries.map((s) => (
                <TableRow
                  key={s.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(s)}
                >
                  <TableCell>{s.partPcb}</TableCell>
                  <TableCell>{s.shift}</TableCell>
                  <TableCell>{s.scanDate}</TableCell>
                  <TableCell className="text-right font-semibold">{s.totalScan}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>
              {selected ? `${selected.partPcb} — Shift ${selected.shift} — ${selected.scanDate}` : ''}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 px-4">
            {loading && <p className="text-sm text-gray-400">Loading...</p>}
            {!loading && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Part IC</TableHead>
                    <TableHead>Production Name</TableHead>
                    <TableHead>D/C</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {details.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-400">
                        No records
                      </TableCell>
                    </TableRow>
                  )}
                  {details.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>{d.partIc}</TableCell>
                      <TableCell>{d.productionName}</TableCell>
                      <TableCell>{d.dc}</TableCell>
                      <TableCell>{d.createdAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </Layout>
  )
}