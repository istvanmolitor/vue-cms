import { createApiClient } from '@user/services/apiClient'

const api = createApiClient()

export interface Menu {
  id: number
  name: string
  created_at?: string
  updated_at?: string
}

export interface MenuFormData {
  name: string
}

export interface SingleResponse<T> {
  data: T
}

export interface ListResponse<T> {
  data: T[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export const menuService = {
  getAll(params?: any) {
    return api.get<ListResponse<Menu>>('/api/cms/menus', { params })
  },
  getById(id: number | string) {
    return api.get<SingleResponse<Menu>>(`/api/cms/menus/${id}`)
  },
  create(formData: MenuFormData) {
    return api.post<SingleResponse<Menu>>('/api/cms/menus', formData)
  },
  update(id: number | string, formData: MenuFormData) {
    return api.put<SingleResponse<Menu>>(`/api/cms/menus/${id}`, formData)
  },
  delete(id: number | string) {
    return api.delete(`/api/cms/menus/${id}`)
  },
}
