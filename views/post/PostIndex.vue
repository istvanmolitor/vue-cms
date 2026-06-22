<script setup lang="ts">
import { AdminLayout, EditButton, DeleteButton, CreateButton } from '@admin'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/ui/dataTable/DataTable.vue'
import Icon from '@admin/components/ui/Icon.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { postService, type Post } from '../../services/postService.ts'

const router = useRouter()
const posts = ref<Post[]>([])
const isLoading = ref(false)
const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0
})

const columns: Column<Post>[] = [
  { key: 'main_image_url', label: 'Kép', width: '80px' },
  { key: 'title', label: 'Cím', sortable: true },
  { key: 'postGroups', label: 'Poszt csoportok' },
  { key: 'created_at', label: 'Létrehozva', sortable: true },
]

const fetchPosts = async (params: {
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
} = {}) => {
  try {
    isLoading.value = true
    const response = await postService.getAll(params)
    posts.value = response.data.data
    pagination.value = response.data.meta
  } catch (error) {
    console.error('Hiba a posztok betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const deletePost = async (id: number) => {
  try {
    await postService.delete(id)
    await fetchPosts({ page: pagination.value.current_page })
  } catch (error) {
    console.error('Hiba a poszt törlésekor:', error)
  }
}

const editPost = (id: number) => {
  router.push(`/admin/cms/post/${id}/edit`)
}

onMounted(() => {
  fetchPosts({
    page: 1,
    sort: 'created_at',
    direction: 'desc'
  })
})
</script>

<template>
  <AdminLayout page-title="Posztok">
    <DataTable
      :columns="columns"
      :data="posts"
      :loading="isLoading"
      :pagination="pagination"
      search-placeholder="Keresés cím vagy lead alapján..."
      default-sort="created_at"
      default-direction="desc"
      @fetch="fetchPosts"
    >
      <template #main_image_url="{ row }">
        <div v-if="row.main_image_url" class="w-12 h-12 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
          <img :src="row.main_image_url" :alt="row.title" class="w-full h-full object-cover" />
        </div>
        <div v-else class="w-12 h-12 rounded bg-gray-50 flex items-center justify-center text-gray-300">
          <Icon name="Image" :size="20" />
        </div>
      </template>

      <template #postGroups="{ row }">
        <div class="flex flex-wrap gap-1">
          <span
            v-for="group in row.postGroups"
            :key="group.id"
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
          >
            {{ group.name }}
          </span>
          <span v-if="!row.postGroups || row.postGroups.length === 0" class="text-gray-400 text-xs italic">
            Nincs csoport
          </span>
        </div>
      </template>

      <template #actions>
        <CreateButton to="/admin/cms/post/create">Új poszt</CreateButton>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editPost(row.id!)" />
        <DeleteButton @confirm="deletePost(row.id!)" />
      </template>
      <template #empty>
        Nincs megjeleníthető poszt.
      </template>
    </DataTable>
  </AdminLayout>
</template>
