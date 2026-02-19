<script setup lang="ts">
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Input from '@admin/components/ui/Input.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import FormButtons from '@admin/components/ui/button/FormButtons.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { contentRegionService, type ContentRegionFormData, type ContentElement } from '../../services/contentRegionService.ts'
import EditContent from '../../components/EditContent.vue'

const router = useRouter()
const route = useRoute()
const isSaving = ref(false)
const isLoading = ref(true)
const regionId = route.params.id as string
const errors = ref<any>({})

const form = reactive({
  name: '',
  content_elements: [] as ContentElement[]
}) as ContentRegionFormData

const fetchRegion = async () => {
  try {
    isLoading.value = true
    const { data } = await contentRegionService.getById(regionId)
    form.name = data.data.name
    // Load draft_content if it exists, otherwise fall back to published content
    form.content_elements = data.data.content?.content_elements || data.data.content?.content_elements || []
  } catch (error) {
    console.error('Hiba a régió betöltésekor:', error)
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
      name: form.name,
      content: {
        content_elements: form.content_elements.map((element, index) => ({
          type: element.type,
          settings: element.settings,  // API expects 'settings' field
          sort: index,
          is_visible: element.is_visible
        }))
      }
    }

    await contentRegionService.update(regionId, payload)
    router.push('/cms/regions')
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    }
    console.error('Hiba a régió frissítésekor:', error)
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push('/cms/regions')
}

onMounted(() => {
  fetchRegion()
})
</script>

<template>
  <AdminLayout>
    <div class="flex items-center justify-between space-y-2 mb-4">
      <h2 class="text-3xl font-bold tracking-tight">Régió szerkesztése</h2>
      <div class="flex gap-2">
        <Button variant="outline" @click="goBack">Vissza</Button>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      Betöltés...
    </div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Régió adatai</CardTitle>
        <CardDescription>Módosítsd a régió adatait</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <label for="name" class="text-sm font-medium">Név</label>
          <Input id="name" v-model="form.name" placeholder="Régió neve" />
          <FieldError :errors="errors.name" />
        </div>
        <hr class="my-6" />
        <EditContent v-model="form.content_elements" />
        <FieldError :errors="errors['content.content_elements']" />
        <FieldError :errors="errors.content" />
      </CardContent>
      <CardFooter>
        <FormButtons
          :is-saving="isSaving"
          save-text="Mentés"
          @save="handleSubmit"
          @cancel="goBack"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>
