<script setup lang="ts">
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'
import RowActions from '@admin/components/ui/RowActions.vue'
import DataTable, { type Column } from '@admin/components/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { pageService, type Page } from '../../services/pageService.ts'

const router = useRouter()
const pages = ref<Page[]>([])
const isLoading = ref(false)

const columns: Column<Page>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'title', label: 'Cím', sortable: true },
  { key: 'slug', label: 'Slug', sortable: true },
  { key: 'created_at', label: 'Létrehozva', sortable: true },
]

const fetchPages = async () => {
  try {
    isLoading.value = true
    const response = await pageService.getAll()
    pages.value = response.data.data
  } catch (error) {
    console.error('Hiba a lapok betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const deletePage = async (id: number) => {
  try {
    await pageService.delete(id)
    await fetchPages()
  } catch (error) {
    console.error('Hiba a lap törlésekor:', error)
  }
}

const editPage = (id: number) => {
  router.push(`/cms/pages/${id}/edit`)
}

onMounted(() => {
  fetchPages()
})
</script>

<template>
  <AdminLayout>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-3xl font-bold tracking-tight">Oldalak</h2>
      <Button @click="router.push('/cms/pages/create')">
        <Icon name="plus" :size="16" class="mr-2" />
        Új oldal
      </Button>
    </div>

    <DataTable
      :columns="columns"
      :data="pages"
      :loading="isLoading"
      @fetch="fetchPages"
    >
      <template #row-actions="{ row }">
        <RowActions
          @edit="editPage(row.id!)"
          @delete="deletePage(row.id!)"
        />
      </template>
      <template #empty>
        Nincs megjeleníthető oldal.
      </template>
    </DataTable>
  </AdminLayout>
</template>
