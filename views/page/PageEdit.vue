<script setup lang="ts">
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Input from '@admin/components/ui/Input.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
import Checkbox from '@admin/components/ui/Checkbox.vue'
import Label from '@admin/components/ui/Label.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import FormButtons from '@admin/components/ui/button/FormButtons.vue'
import Select from '@admin/components/ui/Select.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import Icon from '@admin/components/ui/Icon.vue'
import MediaFilePicker from '@media/components/MediaFilePicker.vue'
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { pageService, type PageFormData, type ContentElement, type PageMeta } from '../../services/pageService.ts'
import { layoutService, type Layout } from '../../services/layoutService.ts'
import EditContent from '../../components/EditContent.vue'
import { toastService } from '@admin/lib/toastService'
import LoadingSpinner from '@admin/components/ui/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const isSaving = ref(false)
const isLoading = ref(true)
const isLoadingLayouts = ref(true)
const pageId = route.params.id as string
const errors = ref<any>({})
const layouts = ref<Record<string, Layout>>({})
const pageUrl = ref<string | null>(null)
const pageMetaData = ref<PageMeta[]>([])

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

const fetchPage = async () => {
  try {
    isLoading.value = true
    const { data } = await pageService.getById(pageId)
    form.title = data.data.title
    form.slug = data.data.slug
    form.is_published = data.data.is_published || false
    form.lead = data.data.lead || ''
    form.layout = data.data.layout || 'default'
    form.main_image_url = data.data.main_image_url || ''
    // Load draft_content if it exists, otherwise fall back to published content
    form.content_elements = data.data.content?.content_elements || data.data.content?.content_elements || []
    // Store page URL
    pageUrl.value = data.data.url || null
    pageMetaData.value = data.data.meta_data || []
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

    await pageService.update(pageId, payload)
    toastService.success('Oldal sikeresen frissítve')
    router.push('/admin/cms/page')
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
  router.push('/admin/cms/page')
}

const viewPage = () => {
  if (pageUrl.value) {
    window.open(pageUrl.value, '_blank')
  }
}

onMounted(() => {
  fetchLayouts()
  fetchPage()
})
</script>

<template>
  <AdminLayout page-title="Oldal szerkesztése">
    <div class="flex items-center justify-end space-y-2 mb-4">
      <div class="flex gap-2">
        <Button v-if="pageUrl" variant="outline" @click="viewPage">
          <Icon name="eye" :size="16" class="mr-2" />
          Megtekintés
        </Button>
        <FormButtons
            :is-saving="isSaving"
            @save="handleSubmit"
            @cancel="goBack"
        />
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8"><LoadingSpinner label="Betöltés..." /></div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left column: Content elements (2 units wide) -->
      <div class="lg:col-span-2 space-y-6">
          <EditContent v-model="form.content_elements" />
          <FieldError :errors="errors['content.content_elements']" />
          <FieldError :errors="errors.content" />
      </div>

      <!-- Right column: Page settings (1 unit wide) -->
      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Oldal adatai</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <Checkbox id="is_published" v-model:checked="form.is_published" />
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

        <Card>
          <CardHeader>
            <CardTitle>Meta adatok</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="pageMetaData.length === 0" class="text-sm text-[--color-muted-foreground]">
              Nincs meta adat.
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="metaItem in pageMetaData"
                :key="metaItem.id"
                class="rounded-md border p-3"
              >
                <p class="text-xs font-medium uppercase tracking-wide text-[--color-muted-foreground]">{{ metaItem.name }}</p>
                <p class="mt-1 break-all text-sm">{{ metaItem.meta_data }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </AdminLayout>
</template>
