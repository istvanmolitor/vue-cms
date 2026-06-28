<script setup lang="ts">
import { AdminLayout, EditButton, DeleteButton, CreateButton } from '@admin'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { pageService } from '../../services/pageService.ts'

const router = useRouter()
const table = ref()

const deletePage = async (id: number) => {
  try {
    await pageService.delete(id)
    table.value?.refresh()
  } catch (error) {
    console.error('Hiba a lap törlésekor:', error)
  }
}

const editPage = (id: number) => {
  router.push(`/admin/cms/page/${id}/edit`)
}
</script>

<template>
  <AdminLayout page-title="Oldalak">
    <DataTable
      ref="table"
      url="/api/cms/pages"
    >
      <template #actions>
        <CreateButton to="/admin/cms/page/create">Új oldal</CreateButton>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editPage((row as any).id)" />
        <DeleteButton @confirm="deletePage((row as any).id)" />
      </template>
      <template #empty>
        Nincs megjeleníthető oldal.
      </template>
    </DataTable>
  </AdminLayout>
</template>
