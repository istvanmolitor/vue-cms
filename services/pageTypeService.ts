import { createApiClient } from '@user/services/apiClient'

const api = createApiClient()

export interface PageType {
  id: number
  name: string
  slug: string
  created_at?: string
  updated_at?: string
}

export interface PageTypeFormData {
  name: string
  slug: string
}

export interface SingleResponse<T> {
  data: T
}

export interface ListResponse<T> {
  data: T[]
}

export const pageTypeService = {
  getAll() {
    return api.get<ListResponse<PageType>>('/api/cms/page-types')
  },
  getById(id: number | string) {
    return api.get<SingleResponse<PageType>>(`/api/cms/page-types/${id}`)
  },
  create(data: PageTypeFormData) {
    return api.post<SingleResponse<PageType>>('/api/cms/page-types', data)
  },
  update(id: number | string, data: PageTypeFormData) {
    return api.put<SingleResponse<PageType>>(`/api/cms/page-types/${id}`, data)
  },
  delete(id: number | string) {
    return api.delete(`/api/cms/page-types/${id}`)
  },
}
