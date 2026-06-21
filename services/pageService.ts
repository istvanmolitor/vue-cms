import { createApiClient } from '@user/services/apiClient'

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

export interface PageMeta {
  id: number
  page_id: number
  name: string
  meta_data: string
  created_at?: string
  updated_at?: string
}

export interface Page {
  id?: number
  title: string
  slug: string
  url?: string
  is_published?: boolean
  lead?: string
  layout?: string
  main_image_url?: string
  keywords?: string
  content?: Content | null
  meta_data?: PageMeta[]
  created_at?: string
  updated_at?: string
}

export interface PageFormData {
  title: string
  slug: string
  is_published?: boolean
  lead?: string
  layout: string
  main_image_url?: string
  keywords?: string
  content_elements: ContentElement[]
}

export interface PagePayload {
  title: string
  slug: string
  is_published?: boolean
  lead?: string
  layout?: string
  main_image_url?: string
  keywords?: string
  content_elements: Array<{
    type: string
    settings: any  // API expects 'settings' not 'content'
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

export const pageService = {
  getAll(params?: { search?: string; sort?: string; direction?: string; page?: number }) {
    return api.get<PaginatedResponse<Page>>('/api/cms/pages', { params })
  },
  getById(id: number | string) {
    return api.get<SingleResponse<Page>>(`/api/cms/pages/${id}`)
  },
  getBySlug(slug: string) {
    return api.get<SingleResponse<Page>>(`/api/cms/slug/${slug}`)
  },
  create(payload: PagePayload) {
    const { content_elements, ...rest } = payload
    const data = {
      ...rest,
      content: {
        content_elements
      }
    }
    return api.post<SingleResponse<Page>>('/api/cms/pages', data)
  },
  update(id: number | string, payload: PagePayload) {
    const { content_elements, ...rest } = payload
    const data = {
      ...rest,
      content: {
        content_elements
      }
    }
    return api.put<SingleResponse<Page>>(`/api/cms/pages/${id}`, data)
  },
  delete(id: number | string) {
    return api.delete(`/api/cms/pages/${id}`)
  },
  approveDraft(id: number | string) {
    return api.post<SingleResponse<Page>>(`/api/cms/pages/${id}/approve-draft`)
  },
  resetDraft(id: number | string) {
    return api.post<SingleResponse<Page>>(`/api/cms/pages/${id}/reset-draft`)
  },
}
