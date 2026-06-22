<script setup lang="ts">
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Input from '@admin/components/ui/Input.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
import Label from '@admin/components/ui/Label.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import FormButtons from '@admin/components/ui/button/FormButtons.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import MediaFilePicker from '@media/components/MediaFilePicker.vue'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { postGroupService, type PostGroupFormData } from '../../services/postGroupService.ts'
import { LayoutSelect } from '@theme'
import { toastService } from '@admin/lib/toastService'

const router = useRouter()
const isSaving = ref(false)
const errors = ref<any>({})
const form = reactive({
  name: '',
  slug: '',
  layout: '',
  lead: '',
  main_image_url: '',
  keywords: '',
}) as PostGroupFormData

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}

    const response: any = await postGroupService.create(form)
    toastService.success('Poszt csoport sikeresen létrehozva')

    const createdPostGroupId = response?.data?.data?.id ?? response?.data?.id ?? response?.id

    if (createdPostGroupId !== undefined && createdPostGroupId !== null) {
      await router.push({
        name: 'cms-post-group-edit',
        params: {
          id: String(createdPostGroupId),
        },
      })

      return
    }

    router.push('/admin/cms/post-group')
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    }
    console.error('Hiba a poszt csoport létrehozásakor:', error)
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push('/admin/cms/post-group')
}

</script>

<template>
  <AdminLayout page-title="Új poszt csoport">
    <div class="flex items-center justify-end space-y-2 mb-4">
      <Button variant="outline" @click="goBack">Vissza</Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Poszt csoport adatai</CardTitle>
        <CardDescription>Add meg az új poszt csoport adatait</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="name" class="text-sm font-medium">Név</Label>
          <Input
            id="name"
            v-model="form.name"
            placeholder="Csoport neve"
          />
          <FieldError :errors="errors.name" />
        </div>
        <div class="space-y-2">
          <Label for="slug" class="text-sm font-medium">Slug</Label>
          <Input
            id="slug"
            v-model="form.slug"
            placeholder="csoport-slug"
          />
          <FieldError :errors="errors.slug" />
        </div>
        <LayoutSelect v-model="form.layout" :errors="errors.layout" />
        <div class="space-y-2">
          <Label for="lead" class="text-sm font-medium">Bevezető szöveg</Label>
          <Textarea
            id="lead"
            v-model="form.lead"
            placeholder="Rövid bevezető szöveg a csoporthoz"
          />
          <FieldError :errors="errors.lead" />
        </div>
        <div class="space-y-2">
          <Label class="text-sm font-medium">Főkép</Label>
          <MediaFilePicker
            v-model="form.main_image_url"
            :accept-types="['image/*']"
          />
          <FieldError :errors="errors.main_image_url" />
        </div>
        <div class="space-y-2">
          <Label for="keywords" class="text-sm font-medium">Kulcsszavak</Label>
          <Input
            id="keywords"
            v-model="form.keywords"
            placeholder="kulcsszó1, kulcsszó2, ..."
          />
          <FieldError :errors="errors.keywords" />
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
