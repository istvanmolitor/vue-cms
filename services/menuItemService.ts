import { createApiClient } from '@user/services/apiClient'
import type { SingleResponse, ListResponse } from './menuService'

const api = createApiClient()

export interface MenuItem {
  id: number
  menu_id: number
  label: Record<string, string>
  url: Record<string, string>
  sort: number
  is_external: boolean
  icon: string | null
  parent_id: number | null
  children?: MenuItem[]
  created_at?: string
  updated_at?: string
}

export interface MenuItemFormData {
  menu_id?: number
  label: Record<string, string>
  url: Record<string, string>
  sort?: number
  is_external?: boolean
  icon?: string | null
  parent_id?: number | null
}

export const menuItemService = {
  getAll(params?: { menu_id?: number | string }) {
    return api.get<ListResponse<MenuItem>>('/api/cms/menu-items', { params })
  },
  getById(id: number | string) {
    return api.get<SingleResponse<MenuItem>>(`/api/cms/menu-items/${id}`)
  },
  create(formData: MenuItemFormData) {
    return api.post<SingleResponse<MenuItem>>('/api/cms/menu-items', formData)
  },
  update(id: number | string, formData: MenuItemFormData) {
    return api.put<SingleResponse<MenuItem>>(`/api/cms/menu-items/${id}`, formData)
  },
  delete(id: number | string) {
    return api.delete(`/api/cms/menu-items/${id}`)
  },
}
