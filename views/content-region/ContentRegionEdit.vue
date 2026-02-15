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
import { contentRegionService, type ContentRegionFormData, type ContentElement } from '../../services/contentRegionService.ts'
import EditContent from '../../components/EditContent.vue'

const router = useRouter()
const route = useRoute()
const isSaving = ref(false)
const isPublishing = ref(false)
const isResetting = ref(false)
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
    form.content_elements = data.data.draftContent?.content_elements || data.data.content?.content_elements || []
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

const handlePublish = async () => {
  try {
    isPublishing.value = true
    errors.value = {}

    await contentRegionService.approveDraft(regionId)

    // Show success message or redirect
    router.push('/cms/regions')
  } catch (error: any) {
    console.error('Hiba a draft publikálásakor:', error)
  } finally {
    isPublishing.value = false
  }
}

const handleReset = async () => {
  try {
    isResetting.value = true
    errors.value = {}

    await contentRegionService.resetDraft(regionId)

    // Reload the region data
    await fetchRegion()
  } catch (error: any) {
    console.error('Hiba a draft visszaállításakor:', error)
  } finally {
    isResetting.value = false
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
        <Button variant="default" @click="handlePublish" :disabled="isPublishing || isSaving || isResetting">
          {{ isPublishing ? 'Publikálás...' : 'Publikálás' }}
        </Button>
        <Button variant="outline" @click="handleReset" :disabled="isResetting || isSaving || isPublishing">
          {{ isResetting ? 'Visszaállítás...' : 'Visszaállítás' }}
        </Button>
        <Button variant="outline" @click="goBack">Vissza</Button>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      Betöltés...
    </div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Régió adatai</CardTitle>
        <CardDescription>Módosítsd a régió piszkozatát. A változások mentése után használd a "Publikálás" gombot a közzétételhez.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <label for="name" class="text-sm font-medium">Név</label>
          <Input id="name" v-model="form.name" placeholder="Régió neve" />
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
          save-text="Piszkozat mentése"
          @save="handleSubmit"
          @cancel="goBack"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>
