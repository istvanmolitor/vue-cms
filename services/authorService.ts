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

export interface Author {
  id?: number
  name: string
  profile_url?: string | null
  created_at?: string
  updated_at?: string
}

export interface AuthorFormData {
  name: string
  profile_url?: string
}

export interface SingleResponse<T> {
  data: T
}

export interface ListResponse<T> {
  data: T[]
}

export const authorService = {
  getAll() {
    return api.get<ListResponse<Author>>('/api/cms/authors')
  },
  getById(id: number | string) {
    return api.get<SingleResponse<Author>>(`/api/cms/authors/${id}`)
  },
  create(formData: AuthorFormData) {
    const data = {
      ...formData,
      profile_url: formData.profile_url || null
    }
    return api.post<SingleResponse<Author>>('/api/cms/authors', data)
  },
  update(id: number | string, formData: AuthorFormData) {
    const data = {
      ...formData,
      profile_url: formData.profile_url || null
    }
    return api.put<SingleResponse<Author>>(`/api/cms/authors/${id}`, data)
  },
  delete(id: number | string) {
    return api.delete(`/api/cms/authors/${id}`)
  },
}


