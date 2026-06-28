<script setup lang="ts">
import { AdminLayout, EditButton, DeleteButton, IconButton, CreateButton } from '@admin'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { postGroupService } from '../../services/postGroupService.ts'

const router = useRouter()
const table = ref()

const deletePostGroup = async (id: number) => {
  try {
    await postGroupService.delete(id)
    table.value?.refresh()
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
</script>

<template>
  <AdminLayout page-title="Poszt Csoportok">
    <DataTable
      ref="table"
      url="/api/cms/post-groups"
    >
      <template #actions>
        <CreateButton to="/admin/cms/post-group/create">Új csoport</CreateButton>
      </template>

      <template #row-actions="{ row }">
        <IconButton icon="eye" @click="showPostGroup((row as any).id)" />
        <EditButton @click="editPostGroup((row as any).id)" />
        <DeleteButton @confirm="deletePostGroup((row as any).id)" />
      </template>
      <template #empty>
        Nincs megjeleníthető poszt csoport.
      </template>
    </DataTable>
  </AdminLayout>
</template>
