import { useForm, router } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DataTable } from '@/components/data-table'
import { Trash } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

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
    post('/master-data', {
      onSuccess: () => {
        toast.success('Master data added')
        reset()
      },
      onError: () => {
        toast.error('Failed to add master data')
      },
    })
  }

  function handleDelete(id: number) {
    router.delete(`/master-data/${id}`, {
      onSuccess: () => toast.success('Deleted successfully'),
      onError: () => toast.error('Failed to delete'),
    })
  }
  
  const columns: ColumnDef<MasterDataItem>[] = [
    { accessorKey: 'partPcb', header: 'Part PCB' },
    { accessorKey: 'partIc', header: 'Part IC' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => {
        const item = row.original
        return (
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  disabled={item.is_used}
                  variant="outline"
                  className="cursor-pointer"
                  size="sm"
                />
              }
            >
              <Trash className="w-4 h-4" />
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this row.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600 font-semibold text-white"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      },
    },
  ]

  return (
    <Layout>
      <div className="flex h-full justify-center p-6">
        <div className="flex h-full flex-col w-full max-w-3xl">
          <h1 className="mb-8 text-2xl font-bold text-center">Master Data</h1>

          <form onSubmit={handleSubmit} className="mb-6 flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="partPcb" className="mb-2 block">
                Part PCB
              </Label>
              <Input
                id="partPcb"
                value={data.partPcb}
                onChange={(e) => setData('partPcb', e.target.value)}
              />
              {errors.partPcb && <p className="text-sm text-red-500">{errors.partPcb}</p>}
            </div>
            <div className="flex-1">
              <Label htmlFor="partIc" className="mb-2 block">
                Part IC
              </Label>
              <Input
                id="partIc"
                value={data.partIc}
                onChange={(e) => setData('partIc', e.target.value)}
              />
              {errors.partIc && <p className="text-sm text-red-500">{errors.partIc}</p>}
            </div>
            <Button
              type="submit"
              disabled={processing}
              className="bg-[#1e88e5] hover:bg-[#1976d2] cursor-pointer"
            >
              Add
            </Button>
          </form>

          <DataTable
            columns={columns}
            data={items}
            searchPlaceholder="Search Part PCB or Part IC"
          />
        </div>
      </div>
    </Layout>
  )
}
