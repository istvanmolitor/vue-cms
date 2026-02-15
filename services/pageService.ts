import axios from 'axios'
import config from '@config'
import type { Author } from './authorService'
import type { PageGroup } from './pageGroupService'

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

export interface ContentElement {
  id?: number
  type: string
  settings: any
  sort: number
  is_visible: boolean
}

export interface Content {
  id?: number
  content_elements: ContentElement[]
}

export interface Page {
  id?: number
  title: string
  slug: string
  main_image_url?: string
  content?: Content | null
  draftContent?: Content | null
  authors?: Author[]
  pageGroups?: PageGroup[]
  created_at?: string
  updated_at?: string
}

export interface PageFormData {
  title: string
  slug: string
  main_image_url?: string
  content_elements: ContentElement[]
  author_ids: number[]
  page_group_ids: number[]
}

export interface PagePayload {
  title: string
  slug: string
  main_image_url?: string
  author_ids?: number[]
  page_group_ids?: number[]
  content_elements: Array<{
    type: string
    settings: any  // API expects 'settings' not 'content'
    sort: number
    is_visible: boolean
  }>
}

export interface SingleResponse<T> {
  data: T
}

export interface ListResponse<T> {
  data: T[]
}

export const pageService = {
  getAll() {
    return api.get<ListResponse<Page>>('/api/cms/pages')
  },
  getById(id: number | string) {
    return api.get<SingleResponse<Page>>(`/api/cms/pages/${id}`)
  },
  getBySlug(slug: string) {
    return api.get<SingleResponse<Page>>(`/api/cms/slug/${slug}`)
  },
  create(payload: PagePayload) {
    const { content_elements, author_ids, page_group_ids, ...rest } = payload
    const data = {
      ...rest,
      author_ids,
      page_group_ids,
      content: {
        content_elements
      }
    }
    return api.post<SingleResponse<Page>>('/api/cms/pages', data)
  },
  update(id: number | string, payload: PagePayload) {
    const { content_elements, author_ids, page_group_ids, ...rest } = payload
    const data = {
      ...rest,
      author_ids,
      page_group_ids,
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
