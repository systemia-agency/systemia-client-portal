import type { Resource, ClientRequest } from '@/types'
import { getItem, setItem } from './localStorage'

const RESOURCES_KEY = 'systemia_resources'
const REQUESTS_KEY = 'systemia_requests'

// --- Resources (shared across all clients) ---

export function getAllResources(): Resource[] {
  return getItem<Resource[]>(RESOURCES_KEY, [])
}

export function addResource(resource: Omit<Resource, 'id'>): Resource {
  const resources = getAllResources()
  const newResource: Resource = { ...resource, id: `res-${Date.now()}` }
  resources.push(newResource)
  setItem(RESOURCES_KEY, resources)
  return newResource
}

export function updateResource(id: string, updates: Partial<Resource>): void {
  const resources = getAllResources()
  const idx = resources.findIndex(r => r.id === id)
  if (idx === -1) return
  Object.assign(resources[idx], updates)
  setItem(RESOURCES_KEY, resources)
}

export function deleteResource(id: string): void {
  setItem(RESOURCES_KEY, getAllResources().filter(r => r.id !== id))
}

// --- Requests (all clients) ---

export function getAllRequests(): ClientRequest[] {
  return getItem<ClientRequest[]>(REQUESTS_KEY, [])
}

export function getRequestsByClient(slug: string): ClientRequest[] {
  return getAllRequests().filter(r => r.clientSlug === slug)
}

export function addRequest(request: Omit<ClientRequest, 'id'>): ClientRequest {
  const requests = getAllRequests()
  const newReq: ClientRequest = { ...request, id: `req-${Date.now()}` }
  requests.push(newReq)
  setItem(REQUESTS_KEY, requests)
  return newReq
}

export function updateRequestStatus(id: string, status: ClientRequest['status']): void {
  const requests = getAllRequests()
  const idx = requests.findIndex(r => r.id === id)
  if (idx === -1) return
  requests[idx].status = status
  setItem(REQUESTS_KEY, requests)
}
