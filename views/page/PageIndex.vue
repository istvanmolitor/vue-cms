<script setup lang="ts">
import { AdminLayout, EditButton, DeleteButton, CreateButton } from '@admin'
import DataTable, { type Column } from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { pageService, type Page } from '../../services/pageService.ts'

const router = useRouter()
const pages = ref<Page[]>([])
const isLoading = ref(false)

const columns: Column<Page>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'title', label: 'Cím', sortable: true },
  { key: 'slug', label: 'Slug', sortable: true },
  { key: 'created_at', label: 'Létrehozva', sortable: true },
]

const fetchPages = async () => {
  try {
    isLoading.value = true
    const response = await pageService.getAll()
    pages.value = response.data.data
  } catch (error) {
    console.error('Hiba a lapok betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const deletePage = async (id: number) => {
  try {
    await pageService.delete(id)
    await fetchPages()
  } catch (error) {
    console.error('Hiba a lap törlésekor:', error)
  }
}

const editPage = (id: number) => {
  router.push(`/cms/pages/${id}/edit`)
}

onMounted(() => {
  fetchPages()
})
</script>

<template>
  <AdminLayout page-title="Oldalak">
    <DataTable
      :columns="columns"
      :data="pages"
      :loading="isLoading"
      @fetch="fetchPages"
    >
      <template #actions>
        <CreateButton to="/cms/pages/create">Új oldal</CreateButton>
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
