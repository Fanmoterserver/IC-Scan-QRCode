import { useForm, usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Login() {
  const { props } = usePage<{ error?: string }>()
  const { data, setData, post, processing } = useForm({ fullName: '', password: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/login')
  }

  return (
    <div className="flex min-h-screen justify-center bg-gray-50 pt-24">
      <Card className="h-fit w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl pt-2">IC Scan QR Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-6">
          {props.error && (
            <div className="rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-600">
              {props.error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="mb-2 block">Full Name</Label>
              <Input
                type="text"
                value={data.fullName}
                onChange={(e) => setData('fullName', e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-2 block">Password</Label>
              <Input
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={processing}>
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
