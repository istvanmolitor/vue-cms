<script setup lang="ts">
import { AdminLayout, EditButton, DeleteButton, CreateButton } from '@admin'
import DataTable, { type Column } from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { authorService, type Author } from '../../services/authorService.ts'

const router = useRouter()
const authors = ref<Author[]>([])
const isLoading = ref(false)

const columns: Column<Author>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Név', sortable: true },
  { key: 'profile_url', label: 'Profil URL', sortable: false },
  { key: 'created_at', label: 'Létrehozva', sortable: true },
]

const fetchAuthors = async () => {
  try {
    isLoading.value = true
    const response = await authorService.getAll()
    authors.value = response.data.data
  } catch (error) {
    console.error('Hiba a szerzők betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const deleteAuthor = async (id: number) => {
  try {
    await authorService.delete(id)
    await fetchAuthors()
  } catch (error) {
    console.error('Hiba a szerző törlésekor:', error)
  }
}

const editAuthor = (id: number) => {
  router.push(`/admin/cms/author/${id}/edit`)
}

onMounted(() => {
  fetchAuthors()
})
</script>

<template>
  <AdminLayout page-title="Szerzők">

    <DataTable
      :columns="columns"
      :data="authors"
      :loading="isLoading"
      @fetch="fetchAuthors"
    >
      <template #actions>
        <CreateButton to="/admin/cms/author/create">Új szerző</CreateButton>
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

