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
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { postTypeService, type PostTypeFormData } from '../../services/postTypeService.ts'
import { toastService } from '@admin/lib/toastService'

const router = useRouter()
const isSaving = ref(false)
const errors = ref<any>({})
const form = reactive({
  name: '',
  slug: '',
}) as PostTypeFormData

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}

    const response: any = await postTypeService.create(form)
    toastService.success('Poszt típus sikeresen létrehozva')

    const createdId = response?.data?.data?.id ?? response?.data?.id ?? response?.id

    if (createdId !== undefined && createdId !== null) {
      await router.push({
        name: 'cms-post-type-edit',
        params: { id: String(createdId) },
      })
      return
    }

    router.push('/admin/cms/post-type')
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    }
    console.error('Hiba a poszt típus létrehozásakor:', error)
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push('/admin/cms/post-type')
}
</script>

<template>
  <AdminLayout page-title="Új poszt típus">
    <div class="flex items-center justify-end space-y-2 mb-4">
      <Button variant="outline" @click="goBack">Vissza</Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Poszt típus adatai</CardTitle>
        <CardDescription>Add meg az új poszt típus adatait</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="name" class="text-sm font-medium">Név</Label>
          <Input
            id="name"
            v-model="form.name"
            placeholder="Típus neve"
          />
          <FieldError :errors="errors.name" />
        </div>
        <div class="space-y-2">
          <Label for="slug" class="text-sm font-medium">Slug</Label>
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
