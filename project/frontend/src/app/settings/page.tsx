'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, router])

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
      toast.success('Logged out successfully')
      router.push('/login')
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and application preferences</p>
        </div>

        {/* Profile Section */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <input
                type="text"
                value={user?.id || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Format
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Data Management</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <div>
                <h3 className="font-medium text-blue-900">Export Data</h3>
                <p className="text-sm text-blue-700">Download your financial data as CSV</p>
              </div>
              <button className="btn-secondary">
                📥 Export
              </button>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
              <div>
                <h3 className="font-medium text-yellow-900">Backup Data</h3>
                <p className="text-sm text-yellow-700">Create a backup of your account</p>
              </div>
              <button className="btn-secondary">
                💾 Backup
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <div>
                <h3 className="font-medium text-green-900">Change Password</h3>
                <p className="text-sm text-green-700">Update your account password</p>
              </div>
              <button className="btn-secondary">
                🔒 Change
              </button>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
              <div>
                <h3 className="font-medium text-purple-900">Two-Factor Authentication</h3>
                <p className="text-sm text-purple-700">Add extra security to your account</p>
              </div>
              <button className="btn-secondary">
                🛡️ Enable
              </button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Application Version:</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated:</span>
              <span>September 2025</span>
            </div>
            <div className="flex justify-between">
              <span>Database:</span>
              <span>SQLite</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card border-red-200">
          <h2 className="text-xl font-semibold mb-4 text-red-900">Danger Zone</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
              <div>
                <h3 className="font-medium text-red-900">Logout</h3>
                <p className="text-sm text-red-700">Sign out of your account</p>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                🚪 Logout
              </button>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-red-100 rounded-lg">
              <div>
                <h3 className="font-medium text-red-900">Delete Account</h3>
                <p className="text-sm text-red-700">Permanently delete your account and all data</p>
              </div>
              <button 
                onClick={() => alert('This feature is not implemented yet')}
                className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800"
              >
                ⚠️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
