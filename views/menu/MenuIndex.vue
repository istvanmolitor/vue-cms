<script setup lang="ts">
import { AdminLayout, toastService, EditButton, DeleteButton } from '@admin'
import CreateButton from '@admin/components/ui/button/CreateButton.vue'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { menuService, type Menu } from '../../services/menuService.ts'

const router = useRouter()
const menus = ref<Menu[]>([])
const isLoading = ref(false)
const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0
})

const columns: Column<Menu>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Név', sortable: true },
  { key: 'language', label: 'Nyelv', sortable: false },
  { key: 'created_at', label: 'Létrehozva', sortable: true },
]

const fetchMenus = async (params: {
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
}) => {
  try {
    isLoading.value = true
    const response = await menuService.getAll(params)
    menus.value = response.data.data
    if (response.data.meta) {
      pagination.value = response.data.meta
    }
  } catch (error) {
    console.error('Hiba a menük betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const deleteMenu = async (id: number) => {
  try {
    await menuService.delete(id)
    toastService.success('Menü sikeresen törölve!')
    await fetchMenus({ page: pagination.value.current_page })
  } catch (error) {
    console.error('Hiba a menü törlésekor:', error)
    toastService.error('Hiba történt a törlés során.')
  }
}

const editMenu = (id: number) => {
  router.push(`/admin/cms/menu/${id}/edit`)
}

onMounted(async () => {
  await fetchMenus({
    page: 1,
    sort: 'name',
    direction: 'asc'
  })
})
</script>

<template>
  <AdminLayout pageTitle="Menük">
    <DataTable
      :columns="columns"
      :data="menus"
      :loading="isLoading"
      :pagination="pagination"
      search-placeholder="Keresés név alapján..."
      default-sort="name"
      default-direction="asc"
      @fetch="fetchMenus"
    >
      <template #actions>
        <CreateButton to="/admin/cms/menu/create">
          Új menü
        </CreateButton>
      </template>

      <template #language="{ row }">
        {{ row.language?.code || '-' }}
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editMenu(row.id!)" />
        <DeleteButton @confirm="deleteMenu(row.id!)" />
      </template>

      <template #empty>
        Nincs megjeleníthető menü.
      </template>
    </DataTable>
  </AdminLayout>
</template>
