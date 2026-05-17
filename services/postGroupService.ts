import { createApiClient } from '@user/services/apiClient'
import type { Post } from './postService'

const api = createApiClient()

export interface PostGroup {
  id: number
  name: string
  slug: string
  layout?: string
  posts?: Post[]
  created_at?: string
  updated_at?: string
}

export interface PostGroupFormData {
  name: string
  slug: string
  layout: string
}

export interface SingleResponse<T> {
  data: T
}

export interface ListResponse<T> {
  data: T[]
}

export const postGroupService = {
  getAll() {
    return api.get<ListResponse<PostGroup>>('/api/cms/post-groups')
  },
  getById(id: number | string) {
    return api.get<SingleResponse<PostGroup>>(`/api/cms/post-groups/${id}`)
  },
  create(data: PostGroupFormData) {
    return api.post<SingleResponse<PostGroup>>('/api/cms/post-groups', data)
  },
  update(id: number | string, data: PostGroupFormData) {
    return api.put<SingleResponse<PostGroup>>(`/api/cms/post-groups/${id}`, data)
  },
  delete(id: number | string) {
    return api.delete(`/api/cms/post-groups/${id}`)
  },
}
