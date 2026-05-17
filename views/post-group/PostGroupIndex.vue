<script setup lang="ts">
import { AdminLayout, EditButton, DeleteButton, IconButton, CreateButton } from '@admin'
import DataTable, { type Column } from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { postGroupService, type PostGroup } from '../../services/postGroupService.ts'

const router = useRouter()
const postGroups = ref<PostGroup[]>([])
const isLoading = ref(false)

const columns: Column<PostGroup>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Név', sortable: true },
  { key: 'slug', label: 'Slug', sortable: true },
  { key: 'created_at', label: 'Létrehozva', sortable: true },
]

const fetchPostGroups = async () => {
  try {
    isLoading.value = true
    const response = await postGroupService.getAll()
    postGroups.value = response.data.data
  } catch (error) {
    console.error('Hiba a poszt csoportok betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const deletePostGroup = async (id: number) => {
  try {
    await postGroupService.delete(id)
    await fetchPostGroups()
  } catch (error) {
    console.error('Hiba a poszt csoport törlésekor:', error)
  }
}

const editPostGroup = (id: number) => {
  router.push(`/admin/cms/post-group/${id}/edit`)
}

const showPostGroup = (id: number) => {
  router.push(`/admin/cms/post-group/${id}`)
}

onMounted(() => {
  fetchPostGroups()
})
</script>

<template>
  <AdminLayout page-title="Poszt Csoportok">
    <DataTable
      :columns="columns"
      :data="postGroups"
      :loading="isLoading"
      @fetch="fetchPostGroups"
    >
      <template #actions>
        <CreateButton to="/admin/cms/post-group/create">Új csoport</CreateButton>
      </template>

      <template #row-actions="{ row }">
        <IconButton icon="eye" @click="showPostGroup(row.id!)" />
        <EditButton @click="editPostGroup(row.id!)" />
        <DeleteButton @confirm="deletePostGroup(row.id!)" />
      </template>
      <template #empty>
        Nincs megjeleníthető poszt csoport.
      </template>
    </DataTable>
  </AdminLayout>
</template>
