<script setup lang="ts">
import { AdminLayout, EditButton, DeleteButton, CreateButton } from '@admin'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { postTypeService } from '../../services/postTypeService.ts'

const router = useRouter()
const table = ref()

const deletePostType = async (id: number) => {
  try {
    await postTypeService.delete(id)
    table.value?.refresh()
  } catch (error) {
    console.error('Hiba a poszt típus törlésekor:', error)
  }
}

const editPostType = (id: number) => {
  router.push(`/admin/cms/post-type/${id}/edit`)
}
</script>

<template>
  <AdminLayout page-title="Poszt Típusok">
    <DataTable
      ref="table"
      url="/api/cms/post-types"
    >
      <template #actions>
        <CreateButton to="/admin/cms/post-type/create">Új típus</CreateButton>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editPostType((row as any).id)" />
        <DeleteButton @confirm="deletePostType((row as any).id)" />
      </template>
      <template #empty>
        Nincs megjeleníthető poszt típus.
      </template>
    </DataTable>
  </AdminLayout>
</template>
