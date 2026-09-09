// inertia/pages/scan_qrcode.tsx
import { useForm, usePage, router } from '@inertiajs/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import Layout from '../components/Layout'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Check, ChevronsUpDown } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'

interface MasterDataItem {
  id: number
  partPcb: string
  partIc: string
}

interface ScanRecordItem {
  id: number
  partPcb: string
  partIc: string
  productionName: string
  dc: string
  shift: string
  createdAt: string
}

interface Props {
  masterData: MasterDataItem[]
  records: ScanRecordItem[]
}

export default function ScanQrCode({ masterData, records }: Props) {
  const { props } = usePage<{ error?: string }>()
  const { data, setData, post, processing, reset } = useForm({
    partPcb: '',
    partIc: '',
    productionName: '',
    dc: '',
    shift: '',
  })

  const [rawPcbScan, setRawPcbScan] = useState('')
  const [pcbPopoverOpen, setPcbPopoverOpen] = useState(false)

  const correctPartIc = useMemo(
    () => masterData.find((m) => m.partPcb === data.partPcb)?.partIc ?? null,
    [masterData, data.partPcb]
  )

  const scannedPcbCode = rawPcbScan.split(',')[0]?.trim() ?? ''
  const pcbMatch = data.partPcb !== '' && scannedPcbCode !== '' && scannedPcbCode === data.partPcb
  const icMatch =
    data.partIc !== '' && correctPartIc !== null && data.partIc.trim() === correctPartIc
  const productionNameValid = data.productionName.trim().length === 14
  const dcValid = data.dc.trim().length === 4

  const canSubmit =
    data.partPcb !== '' &&
    data.shift !== '' &&
    pcbMatch &&
    icMatch &&
    productionNameValid &&
    dcValid

  const scanInputRef = useRef<HTMLInputElement>(null)

  function handleScanKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const fullValue = scanInputRef.current?.value ?? ''
      const firstSegment = fullValue.split(',')[0]?.trim() ?? ''

      setRawPcbScan(fullValue)

      if (scanInputRef.current) {
        scanInputRef.current.value = firstSegment
      }
    }
  }

  const hasSubmittedRef = useRef(false)

  useEffect(() => {
    if (canSubmit && !processing && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true
      post('/scan-qrcode', {
        onSuccess: () => {
          reset('partIc', 'productionName', 'dc')
          setRawPcbScan('')
          if (scanInputRef.current) {
            scanInputRef.current.value = ''
          }
          hasSubmittedRef.current = false
        },
        onError: () => {
          hasSubmittedRef.current = false
        },
      })
    }
  }, [canSubmit, processing])

  function handleDeleteRecord(id: number) {
    router.delete(`/scan-qrcode/${id}`)
  }

  const columns: ColumnDef<ScanRecordItem>[] = [
    { accessorKey: 'partPcb', header: 'Part PCB' },
    { accessorKey: 'partIc', header: 'Part IC' },
    { accessorKey: 'productionName', header: 'Production Name' },
    { accessorKey: 'dc', header: 'D/C' },
    { accessorKey: 'shift', header: 'Shift' },
    { accessorKey: 'createdAt', header: 'Created At' },
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
                  onClick={() => handleDeleteRecord(item.id)}
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
        <div className="flex h-full w-full max-w-4xl flex-col">
          <h1 className="mb-8 text-center text-2xl font-bold">Scan QR Code</h1>

          {props.error && (
            <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-600">
              {props.error}
            </div>
          )}

          <div className="space-y-6">
            <div className="flex flex-wrap justify-around">
              <div className="w-64">
                <Label className="mb-2 block">Part PCB</Label>
                <Popover open={pcbPopoverOpen} onOpenChange={setPcbPopoverOpen}>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={pcbPopoverOpen}
                        className="w-full justify-between font-normal"
                      />
                    }
                  >
                    {data.partPcb || 'Select Part PCB'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0">
                    <Command>
                      <CommandInput placeholder="Search Part PCB..." />
                      <CommandList>
                        <CommandEmpty>No Part PCB found.</CommandEmpty>
                        <CommandGroup>
                          {masterData.map((m) => (
                            <CommandItem
                              key={m.id}
                              value={m.partPcb}
                              onSelect={(value) => {
                                setData('partPcb', value)
                                setPcbPopoverOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  data.partPcb === m.partPcb ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              {m.partPcb}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="w-32">
                <Label className="mb-2 block">Shift</Label>
                <Select value={data.shift} onValueChange={(value) => setData('shift', value ?? '')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Shift" />
                  </SelectTrigger>
                  <SelectContent
                    alignItemWithTrigger={false}
                    className="w-(--anchor-width) min-w-0"
                  >
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap justify-between mt-6">
              <div className="w-48">
                <Label className="mb-2 block">Scan PCB</Label>
                <Input
                  ref={scanInputRef}
                  autoFocus
                  // value={scannedPcbCode}
                  defaultValue=""
                  onKeyDown={handleScanKeyDown}
                  placeholder="Scan here..."
                />
                {scannedPcbCode !== '' && !pcbMatch && (
                  <p className="mt-1 text-xs text-red-500">Does not match selected Part PCB</p>
                )}
              </div>

              <div className="w-40">
                <Label className="mb-2 block">Part IC</Label>
                <Input
                  value={data.partIc}
                  onChange={(e) => setData('partIc', e.target.value)}
                  placeholder="Scan or enter"
                />
                {data.partIc !== '' && !icMatch && (
                  <p className="mt-1 text-xs text-red-500">Incorrect Part IC for this PCB</p>
                )}
              </div>

              <div className="w-48">
                <Label className="mb-2 block">Production Name</Label>
                <Input
                  value={data.productionName}
                  onChange={(e) => setData('productionName', e.target.value)}
                  placeholder="14 characters"
                />
                {data.productionName !== '' && !productionNameValid && (
                  <p className="mt-1 text-xs text-red-500">
                    Must be exactly 14 characters ({data.productionName.length}/14)
                  </p>
                )}
              </div>

              <div className="w-32">
                <Label className="mb-2 block">D/C</Label>
                <Input
                  value={data.dc}
                  onChange={(e) => setData('dc', e.target.value)}
                  placeholder="4 characters"
                />
                {data.dc !== '' && !dcValid && (
                  <p className="mt-1 text-xs text-red-500">
                    Must be exactly 4 characters ({data.dc.length}/4)
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 min-h-0 flex-1">
            <DataTable columns={columns} data={records} showSearch={false} />
          </div>
        </div>
      </div>
    </Layout>
  )
}
