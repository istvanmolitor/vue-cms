import { createApiClient } from '@user/services/apiClient'

const api = createApiClient()

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

export interface ContentRegion {
  id?: number
  name: string
  content?: Content | null
}

export interface ContentRegionFormData {
  name: string
  content_elements: ContentElement[]
}

export interface ContentRegionPayload {
  name: string
  content: {
    content_elements: Array<{
      type: string
      settings: any  // API expects 'settings' not 'content'
      sort: number
      is_visible: boolean
    }>
  }
}

export interface SingleResponse<T> {
  data: T
}

export interface ListResponse<T> {
  data: T[]
}

export const contentRegionService = {
  getAll() {
    return api.get<ListResponse<ContentRegion>>('/api/cms/regions')
  },
  getById(id: number | string) {
    return api.get<SingleResponse<ContentRegion>>(`/api/cms/regions/${id}`)
  },
  create(region: ContentRegionPayload) {
    return api.post<SingleResponse<ContentRegion>>('/api/cms/regions', region)
  },
  update(id: number | string, region: ContentRegionPayload) {
    return api.put<SingleResponse<ContentRegion>>(`/api/cms/regions/${id}`, region)
  },
  delete(id: number | string) {
    return api.delete(`/api/cms/regions/${id}`)
  },
  approveDraft(id: number | string) {
    return api.post<SingleResponse<ContentRegion>>(`/api/cms/regions/${id}/approve-draft`)
  },
  resetDraft(id: number | string) {
    return api.post<SingleResponse<ContentRegion>>(`/api/cms/regions/${id}/reset-draft`)
  },
}
