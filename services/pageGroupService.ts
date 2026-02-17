import { createApiClient } from '@user/services/apiClient'
import type { Page } from './pageService'

const api = createApiClient()

export interface PageGroup {
  id: number
  name: string
  slug: string
  pages?: Page[]
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

