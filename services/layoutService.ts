import { createApiClient } from '@user/services/apiClient'

const api = createApiClient()

export interface Layout {
  name: string
  template: string
}

export interface LayoutsResponse {
  data: Record<string, Layout>
}

export const layoutService = {
  getAll() {
    return api.get<LayoutsResponse>('/api/cms/layouts')
  }
}
