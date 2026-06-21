<script setup lang="ts">
import { AdminLayout, EditButton, DeleteButton, CreateButton } from '@admin'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { authorService, type Author } from '../../services/authorService.ts'

const router = useRouter()
const authors = ref<Author[]>([])
const isLoading = ref(false)
const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0
})

const columns: Column<Author>[] = [
  { key: 'profile_url', label: 'Kép', sortable: false, width: '80px' },
  { key: 'name', label: 'Név', sortable: true },
  { key: 'nickname', label: 'Becenév', sortable: true },
  { key: 'created_at', label: 'Létrehozva', sortable: true },
]

const fetchAuthors = async (params: {
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
} = {}) => {
  try {
    isLoading.value = true
    const response = await authorService.getAll(params)
    authors.value = response.data.data
    pagination.value = response.data.meta
  } catch (error) {
    console.error('Hiba a szerzők betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const deleteAuthor = async (id: number) => {
  try {
    await authorService.delete(id)
    await fetchAuthors({ page: pagination.value.current_page })
  } catch (error) {
    console.error('Hiba a szerző törlésekor:', error)
  }
}

const editAuthor = (id: number) => {
  router.push(`/admin/cms/author/${id}/edit`)
}

onMounted(() => {
  fetchAuthors({
    page: 1,
    sort: 'name',
    direction: 'asc'
  })
})
</script>

<template>
  <AdminLayout page-title="Szerzők">

    <DataTable
      :columns="columns"
      :data="authors"
      :loading="isLoading"
      :pagination="pagination"
      search-placeholder="Keresés név alapján..."
      default-sort="name"
      default-direction="asc"
      @fetch="fetchAuthors"
    >
      <template #actions>
        <CreateButton to="/admin/cms/author/create">Új szerző</CreateButton>
      </template>

      <template #profile_url="{ row }">
        <img v-if="row.profile_url" :src="row.profile_url" :alt="row.name" class="h-10 w-10 rounded-full object-cover" />
        <span v-else class="text-muted-foreground">—</span>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editAuthor(row.id!)" />
        <DeleteButton @confirm="deleteAuthor(row.id!)" />
      </template>
      <template #empty>
        Nincs megjeleníthető szerző.
      </template>
    </DataTable>
  </AdminLayout>
</template>

