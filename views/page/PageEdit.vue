<script setup lang="ts">
import AdminLayout from '@admin/components/layout/DashboardLayout.vue'
import Button from '@admin/components/ui/Button.vue'
import Input from '@admin/components/ui/Input.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import FormButtons from '@admin/components/ui/FormButtons.vue'
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { pageService, type PageFormData, type ContentElement } from '../../services/pageService.ts'
import EditContent from '../../components/EditContent.vue'

const router = useRouter()
const route = useRoute()
const isSaving = ref(false)
const isLoading = ref(true)
const pageId = route.params.id as string
const errors = ref<any>({})

const form = reactive({
  title: '',
  slug: '',
  content_elements: [] as ContentElement[]
}) as PageFormData

const fetchPage = async () => {
  try {
    isLoading.value = true
    const { data } = await pageService.getById(pageId)
    form.title = data.data.title
    form.slug = data.data.slug
    form.content_elements = data.data.content?.content_elements || []
  } catch (error) {
    console.error('Hiba az oldal betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}

    // Transform data to match API expectations
    const payload = {
      title: form.title,
      slug: form.slug,
      content_elements: form.content_elements.map((element, index) => ({
        type: element.type,
        settings: element.settings,  // API expects 'settings' field
        sort: index,
        is_visible: element.is_visible
      }))
    }

    await pageService.update(pageId, payload)
    router.push('/cms/pages')
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    }
    console.error('Hiba az oldal frissítésekor:', error)
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push('/cms/pages')
}

onMounted(() => {
  fetchPage()
})
</script>

<template>
  <AdminLayout>
    <div class="flex items-center justify-between space-y-2 mb-4">
      <h2 class="text-3xl font-bold tracking-tight">Oldal szerkesztése</h2>
      <Button variant="outline" @click="goBack">Vissza</Button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      Betöltés...
    </div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Oldal adatai</CardTitle>
        <CardDescription>Módosítsd az oldal adatait.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <label for="title" class="text-sm font-medium">Cím</label>
          <Input id="title" v-model="form.title" placeholder="Oldal címe" />
        </div>
        <div class="space-y-2">
          <label for="slug" class="text-sm font-medium">Slug</label>
          <Input id="slug" v-model="form.slug" placeholder="oldal-cime" />
        </div>
        <hr class="my-6" />
        <EditContent v-model="form.content_elements" />
        <div v-if="errors['content.content_elements']" class="text-sm font-medium text-destructive mt-2">
          Legalább egy tartalmi elemet meg kell adni.
        </div>
      </CardContent>
      <CardFooter>
        <FormButtons
          :is-saving="isSaving"
          @save="handleSubmit"
          @cancel="goBack"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>
