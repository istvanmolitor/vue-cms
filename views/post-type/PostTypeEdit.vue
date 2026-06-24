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
import { postTypeService, type PostTypeFormData } from '../../services/postTypeService.ts'
import { toastService } from '@admin/lib/toastService'

const router = useRouter()
const route = useRoute()
const isSaving = ref(false)
const isLoading = ref(true)
const postTypeId = route.params.id as string
const errors = ref<any>({})
const form = reactive({
  name: '',
  slug: '',
}) as PostTypeFormData

const fetchPostType = async () => {
  try {
    isLoading.value = true
    const { data } = await postTypeService.getById(postTypeId)
    form.name = data.data.name
    form.slug = data.data.slug
  } catch (error) {
    console.error('Hiba a poszt típus betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}

    await postTypeService.update(postTypeId, form)
    toastService.success('Poszt típus sikeresen frissítve')
    router.push('/admin/cms/post-type')
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    }
    console.error('Hiba a poszt típus frissítésekor:', error)
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push('/admin/cms/post-type')
}

onMounted(() => {
  fetchPostType()
})
</script>

<template>
  <AdminLayout page-title="Poszt típus szerkesztése">
    <div class="flex items-center justify-end space-y-2 mb-4">
      <Button variant="outline" @click="goBack">Vissza</Button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8"><LoadingSpinner label="Betöltés..." /></div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Poszt típus adatai</CardTitle>
        <CardDescription>Módosítsd a poszt típus adatait</CardDescription>
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
