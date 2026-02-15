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

export interface PageGroup {
  id: number
  name: string
  slug: string
  created_at?: string
  updated_at?: string
}

export interface PageGroupFormData {
  name: string
  slug: string
}

export interface SingleResponse<T> {
  data: T
}

export interface ListResponse<T> {
  data: T[]
}

export const pageGroupService = {
  getAll() {
    return api.get<ListResponse<PageGroup>>('/api/cms/page-groups')
  },
  getById(id: number | string) {
    return api.get<SingleResponse<PageGroup>>(`/api/cms/page-groups/${id}`)
  },
  create(data: PageGroupFormData) {
    return api.post<SingleResponse<PageGroup>>('/api/cms/page-groups', data)
  },
  update(id: number | string, data: PageGroupFormData) {
    return api.put<SingleResponse<PageGroup>>(`/api/cms/page-groups/${id}`, data)
  },
  delete(id: number | string) {
    return api.delete(`/api/cms/page-groups/${id}`)
  },
}

