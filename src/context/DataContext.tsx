import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { ClientData, ClientRequest, Resource } from '@/types'
import { getClientData } from '@/store/clientStore'
import { getRequestsByClient, addRequest as storeAddRequest, getAllResources } from '@/store/resourceStore'

export interface DataContextType {
  clientData: ClientData | null
  requests: ClientRequest[]
  resources: Resource[]
  isLoading: boolean
  refreshData: () => void
  addRequest: (request: Omit<ClientRequest, 'id' | 'clientSlug' | 'date' | 'status'>) => void
}

export const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ slug, children }: { slug: string; children: ReactNode }) {
  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [requests, setRequests] = useState<ClientRequest[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshData = useCallback(() => {
    setClientData(getClientData(slug))
    setRequests(getRequestsByClient(slug))
    setResources(getAllResources())
    setIsLoading(false)
  }, [slug])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  const addRequest = useCallback((request: Omit<ClientRequest, 'id' | 'clientSlug' | 'date' | 'status'>) => {
    storeAddRequest({
      ...request,
      clientSlug: slug,
      date: new Date().toISOString().split('T')[0],
      status: 'en_attente',
    })
    setRequests(getRequestsByClient(slug))
  }, [slug])

  return (
    <DataContext.Provider value={{ clientData, requests, resources, isLoading, refreshData, addRequest }}>
      {children}
    </DataContext.Provider>
  )
}
