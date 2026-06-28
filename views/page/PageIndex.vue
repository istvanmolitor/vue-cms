<script setup lang="ts">
import { AdminLayout, EditButton, DeleteButton, CreateButton } from '@admin'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { pageService, type Page } from '../../services/pageService.ts'

const router = useRouter()
const pages = ref<Page[]>([])
const isLoading = ref(false)
const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0
})

const columns = ref<Column[]>([])

const fetchPages = async (params: {
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
} = {}) => {
  try {
    isLoading.value = true
    const response = await pageService.getAll(params)
    pages.value = response.data.data
    pagination.value = response.data.meta
    columns.value = (response.data.columns ?? []) as Column[]
  } catch (error) {
    console.error('Hiba a lapok betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const deletePage = async (id: number) => {
  try {
    await pageService.delete(id)
    await fetchPages({ page: pagination.value.current_page })
  } catch (error) {
    console.error('Hiba a lap törlésekor:', error)
  }
}

const editPage = (id: number) => {
  router.push(`/admin/cms/page/${id}/edit`)
}

onMounted(() => {
  fetchPages({
    page: 1,
    sort: 'title',
    direction: 'asc'
  })
})
</script>

<template>
  <AdminLayout page-title="Oldalak">
    <DataTable
      :columns="columns"
      :data="pages"
      :loading="isLoading"
      :pagination="pagination"
      search-placeholder="Keresés cím vagy lead alapján..."
      default-sort="title"
      default-direction="asc"
      @fetch="fetchPages"
    >
      <template #actions>
        <CreateButton to="/admin/cms/page/create">Új oldal</CreateButton>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editPage(row.id!)" />
        <DeleteButton @confirm="deletePage(row.id!)" />
      </template>
      <template #empty>
        Nincs megjeleníthető oldal.
      </template>
    </DataTable>
  </AdminLayout>
</template>
