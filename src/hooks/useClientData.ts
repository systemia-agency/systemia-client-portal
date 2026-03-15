import { useContext } from 'react'
import { DataContext, type DataContextType } from '@/context/DataContext'

export function useClientData(): DataContextType {
  const context = useContext(DataContext)
  if (!context) throw new Error('useClientData must be used within a DataProvider')
  return context
}
