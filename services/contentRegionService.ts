import axios from 'axios'
import config from '@config'

const api = axios.create({
  baseURL: config.SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export interface ContentElement {
  id?: number
  type: string
  settings: any
  sort: number
  is_visible: boolean
}

export interface Content {
  id?: number
  content_elements: ContentElement[]
}

export interface ContentRegion {
  id?: number
  name: string
  content?: Content | null
  draftContent?: Content | null
}

export interface ContentRegionFormData {
  name: string
  content_elements: ContentElement[]
}

export interface ContentRegionPayload {
  name: string
  content: {
    content_elements: Array<{
      type: string
      settings: any  // API expects 'settings' not 'content'
      sort: number
      is_visible: boolean
    }>
  }
}

export interface SingleResponse<T> {
  data: T
}

export interface ListResponse<T> {
  data: T[]
}

export const contentRegionService = {
  getAll() {
    return api.get<ListResponse<ContentRegion>>('/api/cms/regions')
  },
  getById(id: number | string) {
    return api.get<SingleResponse<ContentRegion>>(`/api/cms/regions/${id}`)
  },
  create(region: ContentRegionPayload) {
    return api.post<SingleResponse<ContentRegion>>('/api/cms/regions', region)
  },
  update(id: number | string, region: ContentRegionPayload) {
    return api.put<SingleResponse<ContentRegion>>(`/api/cms/regions/${id}`, region)
  },
  delete(id: number | string) {
    return api.delete(`/api/cms/regions/${id}`)
  },
  approveDraft(id: number | string) {
    return api.post<SingleResponse<ContentRegion>>(`/api/cms/regions/${id}/approve-draft`)
  },
  resetDraft(id: number | string) {
    return api.post<SingleResponse<ContentRegion>>(`/api/cms/regions/${id}/reset-draft`)
  },
}
