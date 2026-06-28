<script setup lang="ts">
import { AdminLayout, EditButton, DeleteButton, CreateButton, ShowButton } from '@admin'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import Icon from '@admin/components/ui/Icon.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { postService } from '../../services/postService.ts'

const router = useRouter()
const table = ref()

const deletePost = async (id: number) => {
  try {
    await postService.delete(id)
    table.value?.refresh()
  } catch (error) {
    console.error('Hiba a poszt törlésekor:', error)
  }
}

const editPost = (id: number) => {
  router.push(`/admin/cms/post/${id}/edit`)
}

const showPost = (url: string) => {
  window.open(url, '_blank')
}
</script>

<template>
  <AdminLayout page-title="Posztok">
    <DataTable
      ref="table"
      url="/api/cms/posts"
    >
      <template #main_image_url="{ row }">
        <div v-if="(row as any).main_image_url" class="w-12 h-12 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
          <img :src="(row as any).main_image_url" :alt="(row as any).title" class="w-full h-full object-cover" />
        </div>
        <div v-else class="w-12 h-12 rounded bg-gray-50 flex items-center justify-center text-gray-300">
          <Icon name="Image" :size="20" />
        </div>
      </template>

      <template #postGroups="{ row }">
        <div class="flex flex-wrap gap-1">
          <span
            v-for="group in (row as any).postGroups"
            :key="group.id"
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
          >
            {{ group.name }}
          </span>
          <span v-if="!(row as any).postGroups || (row as any).postGroups.length === 0" class="text-gray-400 text-xs italic">
            Nincs csoport
          </span>
        </div>
      </template>

      <template #actions>
        <CreateButton to="/admin/cms/post/create">Új poszt</CreateButton>
      </template>

      <template #row-actions="{ row }">
        <ShowButton v-if="(row as any).url" @click="showPost((row as any).url)" />
        <EditButton @click="editPost((row as any).id)" />
        <DeleteButton @confirm="deletePost((row as any).id)" />
      </template>
      <template #empty>
        Nincs megjeleníthető poszt.
      </template>
    </DataTable>
  </AdminLayout>
</template>
