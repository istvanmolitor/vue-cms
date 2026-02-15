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
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { contentRegionService, type ContentRegionFormData, type ContentElement } from '../../services/contentRegionService.ts'
import EditContent from '../../components/EditContent.vue'

const router = useRouter()
const isSaving = ref(false)
const errors = ref<any>({})

const form = reactive({
  name: '',
  content_elements: [] as ContentElement[]
}) as ContentRegionFormData

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

    await contentRegionService.create(payload)
    router.push('/cms/regions')
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    }
    console.error('Hiba a régió létrehozásakor:', error)
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push('/cms/regions')
}
</script>

<template>
  <AdminLayout>
    <div class="flex items-center justify-between space-y-2 mb-4">
      <h2 class="text-3xl font-bold tracking-tight">Új régió</h2>
      <Button variant="outline" @click="goBack">Vissza</Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Régió adatai</CardTitle>
        <CardDescription>Add meg az új tartalom régió adatait a létrehozáshoz.</CardDescription>
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
          @save="handleSubmit"
          @cancel="goBack"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>
