  // inertia/pages/scan_qrcode.tsx
  import { useForm, usePage, router } from '@inertiajs/react'
  import { useEffect, useMemo, useRef, useState } from 'react'
  import Layout from '../components/Layout'
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select'
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table'

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
  if (confirm('Delete this scan record?')) {
    router.delete(`/scan-qrcode/${id}`)
  }
}

    return (
      <Layout>
        <div className="flex justify-center p-6">
          <div className="w-full max-w-4xl">
            <h1 className="mb-8 text-center text-2xl font-bold">Scan QR Code</h1>

            {props.error && (
              <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-600">
                {props.error}
              </div>
            )}

            <form className="space-y-6">
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
            </form>

            <div className="mt-10">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Part PCB</TableHead>
                    <TableHead>Part IC</TableHead>
                    <TableHead>Production Name</TableHead>
                    <TableHead>D/C</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="w-16" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-400">
                        No scans yet
                      </TableCell>
                    </TableRow>
                  )}
                  {records.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell>{h.partPcb}</TableCell>
                      <TableCell>{h.partIc}</TableCell>
                      <TableCell>{h.productionName}</TableCell>
                      <TableCell>{h.dc}</TableCell>
                      <TableCell>{h.shift}</TableCell>
                      <TableCell className="font-semibold">{h.createdAt}</TableCell>
                      <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteRecord(h.id)}>
                             Delete
                          </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
