import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f2f2f2]">
      <div className="mx-auto flex min-h-screen w-full max-w-400">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <Topbar />
          <main className="space-y-4 p-4 md:p-5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
