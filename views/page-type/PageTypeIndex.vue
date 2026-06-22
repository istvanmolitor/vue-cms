<script setup lang="ts">
import { AdminLayout, EditButton, DeleteButton, CreateButton } from '@admin'
import DataTable, { type Column } from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { pageTypeService, type PageType } from '../../services/pageTypeService.ts'

const router = useRouter()
const pageTypes = ref<PageType[]>([])
const isLoading = ref(false)

const columns: Column<PageType>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Név', sortable: true },
  { key: 'slug', label: 'Slug', sortable: true },
  { key: 'created_at', label: 'Létrehozva', sortable: true },
]

const fetchPageTypes = async () => {
  try {
    isLoading.value = true
    const response = await pageTypeService.getAll()
    pageTypes.value = response.data.data
  } catch (error) {
    console.error('Hiba az oldal típusok betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const deletePageType = async (id: number) => {
  try {
    await pageTypeService.delete(id)
    await fetchPageTypes()
  } catch (error) {
    console.error('Hiba az oldal típus törlésekor:', error)
  }
}

const editPageType = (id: number) => {
  router.push(`/admin/cms/page-type/${id}/edit`)
}

onMounted(() => {
  fetchPageTypes()
})
</script>

<template>
  <AdminLayout page-title="Oldal Típusok">
    <DataTable
      :columns="columns"
      :data="pageTypes"
      :loading="isLoading"
      @fetch="fetchPageTypes"
    >
      <template #actions>
        <CreateButton to="/admin/cms/page-type/create">Új típus</CreateButton>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editPageType(row.id!)" />
        <DeleteButton @confirm="deletePageType(row.id!)" />
      </template>
      <template #empty>
        Nincs megjeleníthető oldal típus.
      </template>
    </DataTable>
  </AdminLayout>
</template>
