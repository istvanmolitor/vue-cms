<script setup lang="ts">
import { AdminLayout, EditButton, DeleteButton, CreateButton } from '@admin'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { pageTypeService } from '../../services/pageTypeService.ts'

const router = useRouter()
const table = ref()

const deletePageType = async (id: number) => {
  try {
    await pageTypeService.delete(id)
    table.value?.refresh()
  } catch (error) {
    console.error('Hiba az oldal típus törlésekor:', error)
  }
}

const editPageType = (id: number) => {
  router.push(`/admin/cms/page-type/${id}/edit`)
}
</script>

<template>
  <AdminLayout page-title="Oldal Típusok">
    <DataTable
      ref="table"
      url="/api/cms/page-types"
    >
      <template #actions>
        <CreateButton to="/admin/cms/page-type/create">Új típus</CreateButton>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editPageType((row as any).id)" />
        <DeleteButton @confirm="deletePageType((row as any).id)" />
      </template>
      <template #empty>
        Nincs megjeleníthető oldal típus.
      </template>
    </DataTable>
  </AdminLayout>
</template>
