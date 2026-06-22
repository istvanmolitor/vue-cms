import { createApiClient } from '@user/services/apiClient'

const api = createApiClient()

export interface PostType {
  id: number
  name: string
  slug: string
  created_at?: string
  updated_at?: string
}

export interface PostTypeFormData {
  name: string
  slug: string
}

export interface SingleResponse<T> {
  data: T
}

export interface ListResponse<T> {
  data: T[]
}

export const postTypeService = {
  getAll() {
    return api.get<ListResponse<PostType>>('/api/cms/post-types')
  },
  getById(id: number | string) {
    return api.get<SingleResponse<PostType>>(`/api/cms/post-types/${id}`)
  },
  create(data: PostTypeFormData) {
    return api.post<SingleResponse<PostType>>('/api/cms/post-types', data)
  },
  update(id: number | string, data: PostTypeFormData) {
    return api.put<SingleResponse<PostType>>(`/api/cms/post-types/${id}`, data)
  },
  delete(id: number | string) {
    return api.delete(`/api/cms/post-types/${id}`)
  },
}
