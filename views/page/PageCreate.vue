<script setup lang="ts">
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Input from '@admin/components/ui/Input.vue'
import Select from '@admin/components/ui/Select.vue'
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
import { reactive, ref, onMounted } from 'vue'
import { pageService, type PageFormData, type ContentElement } from '../../services/pageService.ts'
import { layoutService, type Layout } from '../../services/layoutService.ts'
import EditContent from '../../components/EditContent.vue'
import { toastService } from '@admin/lib/toastService'

const router = useRouter()
const isSaving = ref(false)
const isLoadingLayouts = ref(true)
const errors = ref<any>({})
const layouts = ref<Record<string, Layout>>({})

const form = reactive({
  title: '',
  slug: '',
  is_published: false,
  lead: '',
  layout: 'default',
  main_image_url: '',
  content_elements: [] as ContentElement[],
}) as PageFormData

const fetchLayouts = async () => {
  try {
    isLoadingLayouts.value = true
    const { data } = await layoutService.getAll()
    layouts.value = data.data
  } catch (error) {
    console.error('Hiba a sablonok betöltésekor:', error)
  } finally {
    isLoadingLayouts.value = false
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
      is_published: form.is_published,
      lead: form.lead,
      layout: form.layout,
      main_image_url: form.main_image_url,
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
      errors.value = error.response.data.errors
    }
    console.error('Hiba az oldal létrehozásakor:', error)
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push('/admin/cms/page')
}

onMounted(() => {
  fetchLayouts()
})
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
      <!-- Left column: Content elements (2 units wide) -->
      <div class="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Tartalom elemei</CardTitle>
          </CardHeader>
          <CardContent>
            <EditContent v-model="form.content_elements" />
            <FieldError :errors="errors['content.content_elements']" />
            <FieldError :errors="errors.content" />
          </CardContent>
        </Card>
      </div>

      <!-- Right column: Page settings (1 unit wide) -->
      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Oldal adatai</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
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
            <div class="space-y-2">
              <Label for="lead" class="text-sm font-medium">Bevezető szöveg</Label>
              <Textarea id="lead" v-model="form.lead" placeholder="Rövid bevezető szöveg az oldalhoz" />
              <FieldError :errors="errors.lead" />
            </div>
            <div class="space-y-2">
              <Label for="layout" class="text-sm font-medium">Sablon</Label>
              <Select
                id="layout"
                v-model="form.layout"
                :options="Object.entries(layouts).map(([key, layout]) => ({ value: key, label: layout.name }))"
                placeholder="Válassz sablont..."
              />
              <FieldError :errors="errors.layout" />
            </div>
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <Checkbox id="is_published" v-model:checked="form.is_published" />
                <Label for="is_published" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Publikálva
                </Label>
              </div>
              <FieldError :errors="errors.is_published" />
            </div>
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
