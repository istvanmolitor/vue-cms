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
import MultiSelect from '@admin/components/ui/MultiSelect.vue'
import MediaFilePicker from '@media/components/MediaFilePicker.vue'
import { useRouter } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { pageService, type PageFormData, type ContentElement } from '../../services/pageService.ts'
import { authorService, type Author } from '../../services/authorService.ts'
import { pageGroupService, type PageGroup } from '../../services/pageGroupService.ts'
import EditContent from '../../components/EditContent.vue'

const router = useRouter()
const isSaving = ref(false)
const isLoadingAuthors = ref(true)
const isLoadingPageGroups = ref(true)
const errors = ref<any>({})
const authors = ref<Author[]>([])
const pageGroups = ref<PageGroup[]>([])

const form = reactive({
  title: '',
  slug: '',
  is_published: false,
  lead: '',
  layout: 'default',
  main_image_url: '',
  content_elements: [] as ContentElement[],
  author_ids: [] as number[],
  page_group_ids: [] as number[]
}) as PageFormData

const fetchAuthors = async () => {
  try {
    isLoadingAuthors.value = true
    const { data } = await authorService.getAll()
    authors.value = data.data
  } catch (error) {
    console.error('Hiba a szerzők betöltésekor:', error)
  } finally {
    isLoadingAuthors.value = false
  }
}

const fetchPageGroups = async () => {
  try {
    isLoadingPageGroups.value = true
    const { data } = await pageGroupService.getAll()
    pageGroups.value = data.data
  } catch (error) {
    console.error('Hiba az oldal csoportok betöltésekor:', error)
  } finally {
    isLoadingPageGroups.value = false
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
      author_ids: form.author_ids,
      page_group_ids: form.page_group_ids,
      content_elements: form.content_elements.map((element, index) => ({
        type: element.type,
        settings: element.settings,  // API expects 'settings' field
        sort: index,
        is_visible: element.is_visible
      }))
    }

    await pageService.create(payload)
    router.push('/cms/pages')
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
  router.push('/cms/pages')
}

onMounted(() => {
  fetchAuthors()
  fetchPageGroups()
})
</script>

<template>
  <AdminLayout page-title="Új oldal">
    <div class="flex items-center justify-between space-y-2 mb-4">
      <h2 class="text-3xl font-bold tracking-tight">Új oldal</h2>
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
              <label for="title" class="text-sm font-medium">Cím</label>
              <Input id="title" v-model="form.title" placeholder="Oldal címe" />
              <FieldError :errors="errors.title" />
            </div>
            <div class="space-y-2">
              <label for="slug" class="text-sm font-medium">Slug</label>
              <Input id="slug" v-model="form.slug" placeholder="oldal-cime" />
              <FieldError :errors="errors.slug" />
            </div>
            <div class="space-y-2">
              <label for="lead" class="text-sm font-medium">Bevezető szöveg</label>
              <Textarea id="lead" v-model="form.lead" placeholder="Rövid bevezető szöveg az oldalhoz" />
              <FieldError :errors="errors.lead" />
            </div>
            <div class="space-y-2">
              <label for="layout" class="text-sm font-medium">Sablon</label>
              <Input id="layout" v-model="form.layout" placeholder="default" />
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
              <label class="text-sm font-medium">Főkép</label>
              <MediaFilePicker
                v-model="form.main_image_url"
                :accept-types="['image/*']"
              />
              <FieldError :errors="errors.main_image_url" />
            </div>
            <hr class="my-6" />
            <div class="space-y-2">
              <MultiSelect
                v-if="!isLoadingAuthors"
                v-model="form.author_ids"
                :items="authors"
                label="Szerzők"
                placeholder="Válassz szerzőket..."
                search-placeholder="Szerző keresése név alapján..."
                empty-message="Nincsenek elérhető szerzők."
                label-field="name"
              />
              <div v-else class="text-sm text-[--color-muted-foreground]">
                Szerzők betöltése...
              </div>
              <FieldError :errors="errors.author_ids" />
            </div>
            <hr class="my-6" />
            <div class="space-y-2">
              <MultiSelect
                v-if="!isLoadingPageGroups"
                v-model="form.page_group_ids"
                :items="pageGroups"
                label="Oldal csoportok"
                placeholder="Válassz oldal csoportokat..."
                search-placeholder="Oldal csoport keresése név alapján..."
                empty-message="Nincsenek elérhető oldal csoportok."
                label-field="name"
              />
              <div v-else class="text-sm text-[--color-muted-foreground]">
                Oldal csoportok betöltése...
              </div>
              <FieldError :errors="errors.page_group_ids" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </AdminLayout>
</template>
