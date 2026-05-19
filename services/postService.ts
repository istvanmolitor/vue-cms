import { createApiClient } from '@user/services/apiClient'
import type { Author } from './authorService'
import type { PostGroup } from './postGroupService'

const api = createApiClient()

export interface ContentElement {
  id?: number
  type: string
  settings: any
  sort: number
  content_elements: ContentElement[]
}

export interface Content {
  id?: number
  content_elements: ContentElement[]
}

export interface PostMeta {
  id: number
  post_id: number
  name: string
  meta_data: string
  created_at?: string
  updated_at?: string
}

export interface Post {
  id?: number
  title: string
  slug: string
  url?: string
  is_published?: boolean
  lead?: string
  layout?: string
  main_image_url?: string
  content?: Content | null
  authors?: Author[]
  postGroups?: PostGroup[]
  post_meta?: PostMeta[]
  created_at?: string
  updated_at?: string
}

export interface PostFormData {
  title: string
  slug: string
  is_published?: boolean
  lead?: string
  layout: string
  main_image_url?: string
  content_elements: ContentElement[]
  author_ids: number[]
  post_group_ids: number[]
}

export interface PostPayload {
  title: string
  slug: string
  is_published?: boolean
  lead?: string
  layout?: string
  main_image_url?: string
  author_ids?: number[]
  post_group_ids?: number[]
  content_elements: Array<{
    type: string
    settings: any
    sort: number
  }>
}

export interface SingleResponse<T> {
  data: T
}

export interface ListResponse<T> {
  data: T[]
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export const postService = {
  getAll(params?: { search?: string; sort?: string; direction?: string; page?: number }) {
    return api.get<PaginatedResponse<Post>>('/api/cms/posts', { params })
  },
  getById(id: number | string) {
    return api.get<SingleResponse<Post>>(`/api/cms/posts/${id}`)
  },
  getBySlug(slug: string) {
    return api.get<SingleResponse<Post>>(`/api/cms/post/slug/${slug}`)
  },
  create(payload: PostPayload) {
    const { content_elements, author_ids, post_group_ids, ...rest } = payload
    const data = {
      ...rest,
      author_ids,
      post_group_ids,
      content: {
        content_elements
      }
    }
    return api.post<SingleResponse<Post>>('/api/cms/posts', data)
  },
  update(id: number | string, payload: PostPayload) {
    const { content_elements, author_ids, post_group_ids, ...rest } = payload
    const data = {
      ...rest,
      author_ids,
      post_group_ids,
      content: {
        content_elements
      }
    }
    return api.put<SingleResponse<Post>>(`/api/cms/posts/${id}`, data)
  },
  delete(id: number | string) {
    return api.delete(`/api/cms/posts/${id}`)
  },
}
