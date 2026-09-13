// inertia/pages/data_summary.tsx
import { useState } from 'react'
import Layout from '../components/Layout'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import * as XLSX from 'xlsx'
import toast from 'react-hot-toast'
import { Download } from 'lucide-react'
import { Button } from '~/components/ui/button'

interface SummaryItem {
  id: number
  partPcb: string
  shift: string
  scanDate: string
  totalScan: number
}

interface DetailItem {
  id: number
  scanPcb: string
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

  async function handleExport(item: SummaryItem) {
    const params = new URLSearchParams({
      partPcb: item.partPcb,
      shift: item.shift,
      date: item.scanDate,
    })
    const res = await fetch(`/data-summary/details?${params.toString()}`)
    const details: DetailItem[] = await res.json()

    if (details.length === 0) {
      toast.error('No records to export')
      return
    }

    const rows = details.map((d) => ({
      'Scan PCB': d.scanPcb,
      'Shift': item.shift,
      'Part IC': d.partIc,
      'Production Name': d.productionName,
      'D/C': d.dc,
      'Created At': d.createdAt,
    }))

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Scan Records')

    const fileName = `${item.partPcb}_Shift${item.shift}_${item.scanDate}.xlsx`
    XLSX.writeFile(workbook, fileName)
  }

  const columns: ColumnDef<SummaryItem>[] = [
    { accessorKey: 'partPcb', header: 'Part PCB' },
    { accessorKey: 'shift', header: 'Shift' },
    { accessorKey: 'scanDate', header: 'Date' },
    {
      accessorKey: 'totalScan',
      header: 'Total Scan',
      cell: ({ row }) => <div className="text-left font-semibold">{row.original.totalScan}</div>,
    },
    {
      id: 'export',
      header: 'Export',
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation() // prevent triggering the row's onRowClick (opening the Sheet)
            handleExport(row.original)
          }}
        >
          <Download className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  const detailColumns: ColumnDef<DetailItem>[] = [
    {
      accessorKey: 'scanPcb',
      header: 'Scan PCB',
      cell: ({ row }) => (
        <div className="max-w-50 overflow-x-auto whitespace-nowrap">{row.original.scanPcb}</div>
      ),
    },
    { accessorKey: 'partIc', header: 'Part IC' },
    { accessorKey: 'productionName', header: 'Production Name' },
    { accessorKey: 'dc', header: 'D/C' },
    { accessorKey: 'createdAt', header: 'Created At' },
  ]

  return (
    <Layout>
      <div className="flex justify-center p-6">
        <div className="w-full max-w-3xl">
          <h1 className="mb-8 text-center text-2xl font-bold">Data Summary</h1>

          <DataTable
            columns={columns}
            data={summaries}
            searchPlaceholder="Search Part PCB or Shift"
            onRowClick={handleRowClick}
          />
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[50vw]! max-w-none! p-0">
          <SheetHeader>
            <SheetTitle>
              {selected
                ? `${selected.partPcb} — Shift ${selected.shift} — ${selected.scanDate}`
                : ''}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 px-4">
            {loading && <p className="text-sm text-gray-400">Loading...</p>}
            {!loading && <DataTable columns={detailColumns} data={details} showSearch={false} />}
          </div>
        </SheetContent>
      </Sheet>
    </Layout>
  )
}
