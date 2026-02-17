<script setup lang="ts">
import AdminLayout from '@admin/components/layout/DashboardLayout.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'
import RowActions from '@admin/components/ui/RowActions.vue'
import DataTable, { type Column } from '@admin/components/DataTable.vue'
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
  router.push(`/cms/authors/${id}/edit`)
}

onMounted(() => {
  fetchAuthors()
})
</script>

<template>
  <AdminLayout>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-3xl font-bold tracking-tight">Szerzők</h2>
      <Button @click="router.push('/cms/authors/create')">
        <Icon name="plus" :size="16" class="mr-2" />
        Új szerző
      </Button>
    </div>

    <DataTable
      :columns="columns"
      :data="authors"
      :loading="isLoading"
      @fetch="fetchAuthors"
    >
      <template #row-actions="{ row }">
        <RowActions
          @edit="editAuthor(row.id!)"
          @delete="deleteAuthor(row.id!)"
        />
      </template>
      <template #empty>
        Nincs megjeleníthető szerző.
      </template>
    </DataTable>
  </AdminLayout>
</template>

