import { useForm, router } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'
import Layout from '../components/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DataTable } from '@/components/data-table'

interface MasterDataItem {
  id: number
  partPcb: string
  partIc: string
}

interface Props {
  items: MasterDataItem[]
}

export default function MasterData({ items }: Props) {
  const { data, setData, post, processing, errors, reset } = useForm({
    partPcb: '',
    partIc: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/master-data', { onSuccess: () => reset() })
  }

  function handleDelete(id: number) {
    if (confirm('Delete this item?')) {
      router.delete(`/master-data/${id}`)
    }
  }

  const columns: ColumnDef<MasterDataItem>[] = [
    { accessorKey: 'partPcb', header: 'Part PCB' },
    { accessorKey: 'partIc', header: 'Part IC' },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original.id)}>
          Delete
        </Button>
      ),
    },
  ]

  return (
    <Layout>
      <div className="flex justify-center p-6">
        <div className="w-full max-w-3xl">
          <h1 className="mb-4 text-2xl font-bold text-center">Master Data</h1>

          <form onSubmit={handleSubmit} className="mb-6 flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="partPcb">Part PCB</Label>
              <Input
                id="partPcb"
                value={data.partPcb}
                onChange={(e) => setData('partPcb', e.target.value)}
              />
              {errors.partPcb && <p className="text-sm text-red-500">{errors.partPcb}</p>}
            </div>
            <div className="flex-1">
              <Label htmlFor="partIc">Part IC</Label>
              <Input
                id="partIc"
                value={data.partIc}
                onChange={(e) => setData('partIc', e.target.value)}
              />
              {errors.partIc && <p className="text-sm text-red-500">{errors.partIc}</p>}
            </div>
            <Button type="submit" disabled={processing}>
              Add
            </Button>
          </form>

          <DataTable columns={columns} data={items} />
        </div>
      </div>
    </Layout>
  )
}