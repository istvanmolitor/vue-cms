<script setup lang="ts">
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'
import RowActions from '@admin/components/ui/RowActions.vue'
import DataTable, { type Column } from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { pageGroupService, type PageGroup } from '../../services/pageGroupService.ts'

const router = useRouter()
const pageGroups = ref<PageGroup[]>([])
const isLoading = ref(false)

const columns: Column<PageGroup>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Név', sortable: true },
  { key: 'slug', label: 'Slug', sortable: true },
  { key: 'created_at', label: 'Létrehozva', sortable: true },
]

const fetchPageGroups = async () => {
  try {
    isLoading.value = true
    const response = await pageGroupService.getAll()
    pageGroups.value = response.data.data
  } catch (error) {
    console.error('Hiba az oldal csoportok betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const deletePageGroup = async (id: number) => {
  try {
    await pageGroupService.delete(id)
    await fetchPageGroups()
  } catch (error) {
    console.error('Hiba az oldal csoport törlésekor:', error)
  }
}

const editPageGroup = (id: number) => {
  router.push(`/cms/page-groups/${id}/edit`)
}

const showPageGroup = (id: number) => {
  router.push(`/cms/page-groups/${id}`)
}

onMounted(() => {
  fetchPageGroups()
})
</script>

<template>
  <AdminLayout page-title="Oldal Csoportok">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-3xl font-bold tracking-tight">Oldal Csoportok</h2>
      <Button @click="router.push('/cms/page-groups/create')">
        <Icon name="plus" :size="16" class="mr-2" />
        Új csoport
      </Button>
    </div>

    <DataTable
      :columns="columns"
      :data="pageGroups"
      :loading="isLoading"
      @fetch="fetchPageGroups"
    >
      <template #row-actions="{ row }">
        <RowActions
          :show-show="true"
          @show="showPageGroup(row.id!)"
          @edit="editPageGroup(row.id!)"
          @delete="deletePageGroup(row.id!)"
        />
      </template>
      <template #empty>
        Nincs megjeleníthető oldal csoport.
      </template>
    </DataTable>
  </AdminLayout>
</template>

