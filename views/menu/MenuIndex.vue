<script setup lang="ts">
import { AdminLayout, toastService, EditButton, DeleteButton } from '@admin'
import CreateButton from '@admin/components/ui/button/CreateButton.vue'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { menuService } from '../../services/menuService.ts'

const router = useRouter()
const table = ref()

const deleteMenu = async (id: number) => {
  try {
    await menuService.delete(id)
    toastService.success('Menü sikeresen törölve!')
    table.value?.refresh()
  } catch (error) {
    console.error('Hiba a menü törlésekor:', error)
    toastService.error('Hiba történt a törlés során.')
  }
}

const editMenu = (id: number) => {
  router.push(`/admin/cms/menu/${id}/edit`)
}
</script>

<template>
  <AdminLayout pageTitle="Menük">
    <DataTable
      ref="table"
      url="/api/cms/menus"
    >
      <template #actions>
        <CreateButton to="/admin/cms/menu/create">
          Új menü
        </CreateButton>
      </template>

      <template #language="{ row }">
        {{ (row as any).language?.code || '-' }}
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editMenu((row as any).id)" />
        <DeleteButton @confirm="deleteMenu((row as any).id)" />
      </template>

      <template #empty>
        Nincs megjeleníthető menü.
      </template>
    </DataTable>
  </AdminLayout>
</template>
