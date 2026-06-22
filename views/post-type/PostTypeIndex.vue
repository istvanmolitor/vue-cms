<script setup lang="ts">
import { AdminLayout, EditButton, DeleteButton, CreateButton } from '@admin'
import DataTable, { type Column } from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { postTypeService, type PostType } from '../../services/postTypeService.ts'

const router = useRouter()
const postTypes = ref<PostType[]>([])
const isLoading = ref(false)

const columns: Column<PostType>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Név', sortable: true },
  { key: 'slug', label: 'Slug', sortable: true },
  { key: 'created_at', label: 'Létrehozva', sortable: true },
]

const fetchPostTypes = async () => {
  try {
    isLoading.value = true
    const response = await postTypeService.getAll()
    postTypes.value = response.data.data
  } catch (error) {
    console.error('Hiba a poszt típusok betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const deletePostType = async (id: number) => {
  try {
    await postTypeService.delete(id)
    await fetchPostTypes()
  } catch (error) {
    console.error('Hiba a poszt típus törlésekor:', error)
  }
}

const editPostType = (id: number) => {
  router.push(`/admin/cms/post-type/${id}/edit`)
}

onMounted(() => {
  fetchPostTypes()
})
</script>

<template>
  <AdminLayout page-title="Poszt Típusok">
    <DataTable
      :columns="columns"
      :data="postTypes"
      :loading="isLoading"
      @fetch="fetchPostTypes"
    >
      <template #actions>
        <CreateButton to="/admin/cms/post-type/create">Új típus</CreateButton>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editPostType(row.id!)" />
        <DeleteButton @confirm="deletePostType(row.id!)" />
      </template>
      <template #empty>
        Nincs megjeleníthető poszt típus.
      </template>
    </DataTable>
  </AdminLayout>
</template>
