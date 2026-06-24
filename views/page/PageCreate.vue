<script setup lang="ts">
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Input from '@admin/components/ui/Input.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
import Checkbox from '@admin/components/ui/Checkbox.vue'
import Label from '@admin/components/ui/Label.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import FormButtons from '@admin/components/ui/button/FormButtons.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import MediaFilePicker from '@media/components/MediaFilePicker.vue'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { pageService, type PageFormData, type ContentElement } from '../../services/pageService.ts'
import EditContent from '../../components/EditContent.vue'
import PageTypeSelect from '../../components/PageTypeSelect.vue'
import LanguageSelector from '@language/components/LanguageSelector.vue'
import { LayoutSelect } from '@theme'
import { toastService } from '@admin/lib/toastService'

const router = useRouter()
const isSaving = ref(false)
const errors = ref<any>({})

const form = reactive({
  title: '',
  slug: '',
  is_published: false,
  lead: '',
  layout: '',
  main_image_url: '',
  language_id: null as number | null,
  page_type_id: null as number | null,
  content_elements: [] as ContentElement[],
}) as PageFormData

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}

    const payload = {
      title: form.title,
      slug: form.slug,
      is_published: form.is_published,
      lead: form.lead,
      layout: form.layout,
      main_image_url: form.main_image_url,
      language_id: form.language_id,
      page_type_id: form.page_type_id,
      content_elements: form.content_elements.map((element, index) => ({
        type: element.type,
        settings: element.settings,
        sort: index,
        content_elements: element.content_elements || []
      }))
    }

    const response: any = await pageService.create(payload)
    toastService.success('Oldal sikeresen létrehozva')
    const createdPageId = response?.data?.data?.id ?? response?.data?.id ?? response?.id

    if (createdPageId !== undefined && createdPageId !== null) {
      await router.push({
        name: 'cms-page-edit',
        params: {
          id: String(createdPageId),
        },
      })

      return
    }

    await router.push('/admin/cms/page')
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response?.data?.errors ?? {}
    } else {
      toastService.error('Hiba az oldal létrehozásakor')
    }
    console.error('Hiba az oldal létrehozásakor:', error)
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push('/admin/cms/page')
}
</script>

<template>
  <AdminLayout page-title="Új oldal">
    <div class="flex items-center justify-end space-y-2 mb-4">
      <span>
        <FormButtons
            :is-saving="isSaving"
            @save="handleSubmit"
            @cancel="goBack"
        />
      </span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Tartalom elemei</CardTitle>
          </CardHeader>
          <CardContent>
            <EditContent v-model="form.content_elements" :errors="errors" />
            <FieldError :errors="errors['content.content_elements']" />
            <FieldError :errors="errors.content" />
          </CardContent>
        </Card>
      </div>

      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Oldal adatai</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <Checkbox id="is_published" v-model="form.is_published" />
                <Label for="is_published" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Publikálva
                </Label>
              </div>
              <FieldError :errors="errors.is_published" />
            </div>
            <div class="space-y-2">
              <Label for="title" class="text-sm font-medium">Cím</Label>
              <Input id="title" v-model="form.title" placeholder="Oldal címe" />
              <FieldError :errors="errors.title" />
            </div>
            <div class="space-y-2">
              <Label for="slug" class="text-sm font-medium">Slug</Label>
              <Input id="slug" v-model="form.slug" placeholder="oldal-cime" />
              <FieldError :errors="errors.slug" />
            </div>
            <PageTypeSelect v-model="form.page_type_id" :errors="errors.page_type_id" />
            <div class="space-y-2">
              <Label class="text-sm font-medium">Nyelv <span class="text-destructive">*</span></Label>
              <LanguageSelector v-model="form.language_id" :required="true" :auto-select-default="true" />
              <FieldError :errors="errors.language_id" />
            </div>
            <div class="space-y-2">
              <Label for="lead" class="text-sm font-medium">Bevezető szöveg</Label>
              <Textarea id="lead" v-model="form.lead" placeholder="Rövid bevezető szöveg az oldalhoz" />
              <FieldError :errors="errors.lead" />
            </div>
            <LayoutSelect v-model="form.layout" :errors="errors.layout" :required="true" />
            <hr class="my-6" />
            <div class="space-y-2">
              <Label class="text-sm font-medium">Főkép</Label>
              <MediaFilePicker
                v-model="form.main_image_url"
                :accept-types="['image/*']"
              />
              <FieldError :errors="errors.main_image_url" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </AdminLayout>
</template>
