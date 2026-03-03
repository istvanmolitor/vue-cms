<script setup lang="ts">
import { AdminLayout, EditButton, DeleteButton, IconButton, CreateButton } from '@admin'
import DataTable, { type Column } from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { pageGroupService, type PageGroup } from '../../services/pageGroupService.ts'

const router = useRouter()
const pageGroups = ref<PageGroup[]>([])
const isLoading = ref(false)

const columns: Column<PageGroup>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Név', sortable: true },
  { key: 'slug', label: 'Slug', sortable: true },
  { key: 'created_at', label: 'Létrehozva', sortable: true },
]

const fetchPageGroups = async () => {
  try {
    isLoading.value = true
    const response = await pageGroupService.getAll()
    pageGroups.value = response.data.data
  } catch (error) {
    console.error('Hiba az oldal csoportok betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const deletePageGroup = async (id: number) => {
  try {
    await pageGroupService.delete(id)
    await fetchPageGroups()
  } catch (error) {
    console.error('Hiba az oldal csoport törlésekor:', error)
  }
}

const editPageGroup = (id: number) => {
  router.push(`/cms/page-groups/${id}/edit`)
}

const showPageGroup = (id: number) => {
  router.push(`/cms/page-groups/${id}`)
}

onMounted(() => {
  fetchPageGroups()
})
</script>

<template>
  <AdminLayout page-title="Oldal Csoportok">
    <DataTable
      :columns="columns"
      :data="pageGroups"
      :loading="isLoading"
      @fetch="fetchPageGroups"
    >
      <template #actions>
        <CreateButton to="/cms/page-groups/create">Új csoport</CreateButton>
      </template>

      <template #row-actions="{ row }">
        <IconButton icon="eye" @click="showPageGroup(row.id!)" />
        <EditButton @click="editPageGroup(row.id!)" />
        <DeleteButton @confirm="deletePageGroup(row.id!)" />
      </template>
      <template #empty>
        Nincs megjeleníthető oldal csoport.
      </template>
    </DataTable>
  </AdminLayout>
</template>

