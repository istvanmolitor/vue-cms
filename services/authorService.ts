import { createApiClient } from '@user/services/apiClient'

const api = createApiClient()

export interface Author {
  id: number
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


