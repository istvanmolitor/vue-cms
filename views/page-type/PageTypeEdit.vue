<script setup lang="ts">
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Input from '@admin/components/ui/Input.vue'
import Label from '@admin/components/ui/Label.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import FormButtons from '@admin/components/ui/button/FormButtons.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import LoadingSpinner from '@admin/components/ui/LoadingSpinner.vue'
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { pageTypeService, type PageTypeFormData } from '../../services/pageTypeService.ts'
import { toastService } from '@admin/lib/toastService'

const router = useRouter()
const route = useRoute()
const isSaving = ref(false)
const isLoading = ref(true)
const pageTypeId = route.params.id as string
const errors = ref<any>({})
const form = reactive({
  name: '',
  slug: '',
}) as PageTypeFormData

const fetchPageType = async () => {
  try {
    isLoading.value = true
    const { data } = await pageTypeService.getById(pageTypeId)
    form.name = data.data.name
    form.slug = data.data.slug
  } catch (error) {
    console.error('Hiba az oldal típus betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}

    await pageTypeService.update(pageTypeId, form)
    toastService.success('Oldal típus sikeresen frissítve')
    router.push('/admin/cms/page-type')
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    }
    console.error('Hiba az oldal típus frissítésekor:', error)
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push('/admin/cms/page-type')
}

onMounted(() => {
  fetchPageType()
})
</script>

<template>
  <AdminLayout page-title="Oldal típus szerkesztése">
    <div class="flex items-center justify-end space-y-2 mb-4">
      <Button variant="outline" @click="goBack">Vissza</Button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8"><LoadingSpinner label="Betöltés..." /></div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Oldal típus adatai</CardTitle>
        <CardDescription>Módosítsd az oldal típus adatait</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Név</Label>
          <Input
            id="name"
            v-model="form.name"
            placeholder="Típus neve"
          />
          <FieldError :errors="errors.name" />
        </div>
        <div class="space-y-2">
          <Label for="slug">Slug</Label>
          <Input
            id="slug"
            v-model="form.slug"
            placeholder="tipus-slug"
          />
          <FieldError :errors="errors.slug" />
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
