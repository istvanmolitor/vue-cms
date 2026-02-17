<script setup lang="ts">
import AdminLayout from '@admin/components/layout/DashboardLayout.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Input from '@admin/components/ui/Input.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
import Checkbox from '@admin/components/ui/Checkbox.vue'
import Label from '@admin/components/ui/Label.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import FormButtons from '@admin/components/ui/button/FormButtons.vue'
import MultiSelect from '@admin/components/ui/MultiSelect.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import Icon from '@admin/components/ui/Icon.vue'
import MediaFilePicker from '@media/components/MediaFilePicker.vue'
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { pageService, type PageFormData, type ContentElement } from '../../services/pageService.ts'
import { authorService, type Author } from '../../services/authorService.ts'
import { pageGroupService, type PageGroup } from '../../services/pageGroupService.ts'
import EditContent from '../../components/EditContent.vue'

const router = useRouter()
const route = useRoute()
const isSaving = ref(false)
const isLoading = ref(true)
const isLoadingAuthors = ref(true)
const isLoadingPageGroups = ref(true)
const pageId = route.params.id as string
const errors = ref<any>({})
const authors = ref<Author[]>([])
const pageGroups = ref<PageGroup[]>([])
const pageUrl = ref<string | null>(null)

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
    // Load authors
    form.author_ids = data.data.authors?.map(author => author.id) || []
    // Load page groups
    form.page_group_ids = data.data.pageGroups?.map(pageGroup => pageGroup.id) || []
    // Store page URL
    pageUrl.value = data.data.url || null
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
      author_ids: form.author_ids,
      page_group_ids: form.page_group_ids,
      content_elements: form.content_elements.map((element, index) => ({
        type: element.type,
        settings: element.settings,  // API expects 'settings' field
        sort: index,
        is_visible: element.is_visible
      }))
    }

    await pageService.update(pageId, payload)
    router.push('/cms/pages')
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
  router.push('/cms/pages')
}

const viewPage = () => {
  if (pageUrl.value) {
    window.open(pageUrl.value, '_blank')
  }
}

onMounted(() => {
  fetchAuthors()
  fetchPageGroups()
  fetchPage()
})
</script>

<template>
  <AdminLayout>
    <div class="flex items-center justify-between space-y-2 mb-4">
      <h2 class="text-3xl font-bold tracking-tight">Oldal szerkesztése</h2>
      <div class="flex gap-2">
        <Button v-if="pageUrl" variant="outline" @click="viewPage">
          <Icon name="eye" :size="16" class="mr-2" />
          Megtekintés
        </Button>
        <Button variant="outline" @click="goBack">Vissza</Button>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      Betöltés...
    </div>

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
            <CardTitle>Oldal beállításai</CardTitle>
            <CardDescription>Az oldal alapvető adatai és tulajdonságai</CardDescription>
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
          <CardFooter>
            <FormButtons
              :is-saving="isSaving"
              save-text="Mentés"
              @save="handleSubmit"
              @cancel="goBack"
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  </AdminLayout>
</template>
