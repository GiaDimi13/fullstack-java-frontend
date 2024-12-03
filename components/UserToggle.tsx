'use client'

import { useAppContext } from './providers'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function UserToggle() {
  const { userRole, setUserRole } = useAppContext()

  return (
    <div className="flex items-center space-x-2 mb-4">
      <Switch
        id="user-toggle"
        checked={userRole === 'admin'}
        onCheckedChange={(checked) => setUserRole(checked ? 'admin' : 'customer')}
      />
      <Label htmlFor="user-toggle">
        {userRole === 'admin' ? 'Business Administrator' : 'Customer'}
      </Label>
    </div>
  )
}

