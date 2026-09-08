// inertia/pages/data_summary.tsx
import { useState } from 'react'
import Layout from '../components/Layout'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

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

  const columns: ColumnDef<SummaryItem>[] = [
    { accessorKey: 'partPcb', header: 'Part PCB' },
    { accessorKey: 'shift', header: 'Shift' },
    { accessorKey: 'scanDate', header: 'Date' },
    {
      accessorKey: 'totalScan',
      header: 'Total Scan',
      cell: ({ row }) => <div className="text-left font-semibold">{row.original.totalScan}</div>,
    },
  ]

  const detailColumns: ColumnDef<DetailItem>[] = [
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
