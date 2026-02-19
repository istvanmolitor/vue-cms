<script setup lang="ts">
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import DataTable, { type Column } from '@admin/components/DataTable.vue'
import RowActions from '@admin/components/ui/RowActions.vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { pageGroupService, type PageGroup } from '../../services/pageGroupService.ts'
import type { Page } from '../../services/pageService.ts'
import { pageService } from '../../services/pageService.ts'

const router = useRouter()
const route = useRoute()
const pageGroupId = route.params.id as string
const pageGroup = ref<PageGroup | null>(null)
const isLoading = ref(true)

const columns: Column<Page>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'title', label: 'Cím', sortable: true },
  { key: 'slug', label: 'Slug', sortable: true },
  { key: 'created_at', label: 'Létrehozva', sortable: true },
]

const fetchPageGroup = async () => {
  try {
    isLoading.value = true
    const { data } = await pageGroupService.getById(pageGroupId)
    pageGroup.value = data.data
  } catch (error) {
    console.error('Hiba az oldal csoport betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push('/cms/page-groups')
}

const editPageGroup = () => {
  router.push(`/cms/page-groups/${pageGroupId}/edit`)
}

const editPage = (id: number) => {
  router.push(`/cms/pages/${id}/edit`)
}

const deletePage = async (id: number) => {
  if (!confirm('Biztosan törölni szeretnéd ezt az oldalt?')) {
    return
  }

  try {
    await pageService.delete(id)
    await fetchPageGroup()
  } catch (error) {
    console.error('Hiba az oldal törlésekor:', error)
  }
}

onMounted(() => {
  fetchPageGroup()
})
</script>

<template>
  <AdminLayout>
    <div class="flex items-center justify-between space-y-2 mb-4">
      <h2 class="text-3xl font-bold tracking-tight">Oldal csoport részletei</h2>
      <div class="flex gap-2">
        <Button variant="outline" @click="goBack">
          <Icon name="arrow-left" :size="16" class="mr-2" />
          Vissza
        </Button>
        <Button @click="editPageGroup">
          <Icon name="pencil" :size="16" class="mr-2" />
          Szerkesztés
        </Button>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      Betöltés...
    </div>

    <div v-else-if="pageGroup" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{{ pageGroup.name }}</CardTitle>
          <CardDescription>Slug: {{ pageGroup.slug }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Létrehozva</p>
              <p class="text-sm">{{ pageGroup.created_at }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Frissítve</p>
              <p class="text-sm">{{ pageGroup.updated_at }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Csoportban lévő oldalak</CardTitle>
          <CardDescription>
            {{ pageGroup.pages?.length || 0 }} oldal található ebben a csoportban
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            v-if="pageGroup.pages && pageGroup.pages.length > 0"
            :columns="columns"
            :data="pageGroup.pages"
            :loading="false"
          >
            <template #row-actions="{ row }">
              <RowActions
                @edit="editPage(row.id!)"
                @delete="deletePage(row.id!)"
              />
            </template>
          </DataTable>
          <div v-else class="text-center py-8 text-muted-foreground">
            Nincs oldal ebben a csoportban.
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-else class="text-center py-8">
      Az oldal csoport nem található.
    </div>
  </AdminLayout>
</template>

