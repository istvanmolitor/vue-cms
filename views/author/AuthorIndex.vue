<script setup lang="ts">
import { AdminLayout, EditButton, DeleteButton, CreateButton } from '@admin'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { authorService } from '../../services/authorService.ts'

const router = useRouter()
const table = ref()

const deleteAuthor = async (id: number) => {
  try {
    await authorService.delete(id)
    table.value?.refresh()
  } catch (error) {
    console.error('Hiba a szerző törlésekor:', error)
  }
}

const editAuthor = (id: number) => {
  router.push(`/admin/cms/author/${id}/edit`)
}
</script>

<template>
  <AdminLayout page-title="Szerzők">

    <DataTable
      ref="table"
      url="/api/cms/authors"
    >
      <template #actions>
        <CreateButton to="/admin/cms/author/create">Új szerző</CreateButton>
      </template>

      <template #profile_url="{ row }">
        <img v-if="(row as any).profile_url" :src="(row as any).profile_url" :alt="(row as any).name" class="h-10 w-10 rounded-full object-cover" />
        <span v-else class="text-muted-foreground">—</span>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editAuthor((row as any).id)" />
        <DeleteButton @confirm="deleteAuthor((row as any).id)" />
      </template>
      <template #empty>
        Nincs megjeleníthető szerző.
      </template>
    </DataTable>
  </AdminLayout>
</template>
