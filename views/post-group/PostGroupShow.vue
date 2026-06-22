<script setup lang="ts">
import { AdminLayout, Button, Icon, Card, CardContent, CardDescription, CardHeader, CardTitle, EditButton, DeleteButton, LoadingSpinner } from '@admin'
import DataTable, { type Column } from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { postGroupService, type PostGroup } from '../../services/postGroupService.ts'
import type { Post } from '../../services/postService.ts'
import { postService } from '../../services/postService.ts'

const router = useRouter()
const route = useRoute()
const postGroupId = route.params.id as string
const postGroup = ref<PostGroup | null>(null)
const isLoading = ref(true)

const columns: Column<Post>[] = [
  { key: 'title', label: 'Cím', sortable: true },
  { key: 'slug', label: 'Slug', sortable: true },
  { key: 'created_at', label: 'Létrehozva', sortable: true },
]

const fetchPostGroup = async () => {
  try {
    isLoading.value = true
    const { data } = await postGroupService.getById(postGroupId)
    postGroup.value = data.data
  } catch (error) {
    console.error('Hiba a poszt csoport betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push('/admin/cms/post-group')
}

const editPostGroup = () => {
  router.push(`/admin/cms/post-group/${postGroupId}/edit`)
}

const editPost = (id: number) => {
  router.push(`/admin/cms/post/${id}/edit`)
}

const deletePost = async (id: number) => {
  if (!confirm('Biztosan törölni szeretnéd ezt a posztot?')) {
    return
  }

  try {
    await postService.delete(id)
    await fetchPostGroup()
  } catch (error) {
    console.error('Hiba a poszt törlésekor:', error)
  }
}

onMounted(() => {
  fetchPostGroup()
})
</script>

<template>
  <AdminLayout page-title="Poszt csoport részletei">
    <div class="flex items-center justify-end space-y-2 mb-4">
      <div class="flex gap-2">
        <Button variant="outline" @click="goBack">
          <Icon name="arrow-left" :size="16" class="mr-2" />
          Vissza
        </Button>
        <Button @click="editPostGroup">
          <Icon name="pencil" :size="16" class="mr-2" />
          Szerkesztés
        </Button>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8"><LoadingSpinner label="Betöltés..." /></div>

    <div v-else-if="postGroup" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{{ postGroup.name }}</CardTitle>
          <CardDescription>Slug: {{ postGroup.slug }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Létrehozva</p>
              <p class="text-sm">{{ postGroup.created_at }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Frissítve</p>
              <p class="text-sm">{{ postGroup.updated_at }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Csoportban lévő posztok</CardTitle>
          <CardDescription>
            {{ postGroup.posts?.length || 0 }} poszt található ebben a csoportban
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            v-if="postGroup.posts && postGroup.posts.length > 0"
            :columns="columns"
            :data="postGroup.posts"
            :loading="false"
          >
            <template #row-actions="{ row }">
              <EditButton @click="editPost(row.id!)" />
              <DeleteButton @confirm="deletePost(row.id!)" />
            </template>
          </DataTable>
          <div v-else class="text-center py-8 text-muted-foreground">
            Nincs poszt ebben a csoportban.
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-else class="text-center py-8">
      A poszt csoport nem található.
    </div>
  </AdminLayout>
</template>
