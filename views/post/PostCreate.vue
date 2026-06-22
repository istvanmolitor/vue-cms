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
import MultiSelect from '@admin/components/ui/MultiSelect.vue'
import MediaFilePicker from '@media/components/MediaFilePicker.vue'
import { useRouter } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { postService, type PostFormData, type ContentElement } from '../../services/postService.ts'
import { authorService, type Author } from '../../services/authorService.ts'
import { postGroupService, type PostGroup } from '../../services/postGroupService.ts'
import { postTypeService, type PostType } from '../../services/postTypeService.ts'
import { layoutService, type Layout } from '../../services/layoutService.ts'
import EditContent from '../../components/EditContent.vue'
import { toastService } from '@admin/lib/toastService'

const router = useRouter()
const isSaving = ref(false)
const isLoadingAuthors = ref(true)
const isLoadingPostGroups = ref(true)
const isLoadingPostTypes = ref(true)
const isLoadingLayouts = ref(true)
const errors = ref<any>({})
const authors = ref<Author[]>([])
const postGroups = ref<PostGroup[]>([])
const postTypes = ref<PostType[]>([])
const layouts = ref<Record<string, Layout>>({})

const form = reactive({
  title: '',
  slug: '',
  is_published: false,
  lead: '',
  layout: 'default',
  main_image_url: '',
  content_elements: [] as ContentElement[],
  author_ids: [] as number[],
  post_group_ids: [] as number[],
  post_type_id: null as number | null
}) as PostFormData

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

const fetchPostGroups = async () => {
  try {
    isLoadingPostGroups.value = true
    const { data } = await postGroupService.getAll()
    postGroups.value = data.data
  } catch (error) {
    console.error('Hiba a poszt csoportok betöltésekor:', error)
  } finally {
    isLoadingPostGroups.value = false
  }
}

const fetchPostTypes = async () => {
  try {
    isLoadingPostTypes.value = true
    const { data } = await postTypeService.getAll()
    postTypes.value = data.data
  } catch (error) {
    console.error('Hiba a poszt típusok betöltésekor:', error)
  } finally {
    isLoadingPostTypes.value = false
  }
}

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

    const payload = {
      title: form.title,
      slug: form.slug,
      is_published: form.is_published,
      lead: form.lead,
      layout: form.layout,
      main_image_url: form.main_image_url,
      author_ids: form.author_ids,
      post_group_ids: form.post_group_ids,
      post_type_id: form.post_type_id,
      content_elements: form.content_elements.map((element, index) => ({
        type: element.type,
        settings: element.settings,
        sort: index,
        content_elements: element.content_elements || []
      }))
    }

    const response: any = await postService.create(payload)
    toastService.success('Poszt sikeresen létrehozva')

    const createdPostId = response?.data?.data?.id ?? response?.data?.id ?? response?.id

    if (createdPostId !== undefined && createdPostId !== null) {
      await router.push({
        name: 'cms-post-edit',
        params: {
          id: String(createdPostId),
        },
      })

      return
    }

    router.push('/admin/cms/post')
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    }
    console.error('Hiba a poszt létrehozásakor:', error)
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push('/admin/cms/post')
}

onMounted(() => {
  fetchAuthors()
  fetchPostGroups()
  fetchPostTypes()
  fetchLayouts()
})
</script>

<template>
  <AdminLayout page-title="Új poszt">
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
            <EditContent v-model="form.content_elements" />
            <FieldError :errors="errors['content.content_elements']" />
            <FieldError :errors="errors.content" />
          </CardContent>
        </Card>
      </div>

      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Poszt adatai</CardTitle>
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
              <Input id="title" v-model="form.title" placeholder="Poszt címe" />
              <FieldError :errors="errors.title" />
            </div>
            <div class="space-y-2">
              <Label for="slug" class="text-sm font-medium">Slug</Label>
              <Input id="slug" v-model="form.slug" placeholder="poszt-cime" />
              <FieldError :errors="errors.slug" />
            </div>
            <div class="space-y-2">
              <Label class="text-sm font-medium">Poszt típus</Label>
              <Select
                v-if="!isLoadingPostTypes"
                v-model="form.post_type_id"
                :options="postTypes"
                label-field="name"
                value-field="id"
                placeholder="Válassz típust..."
                :clearable="true"
              />
              <div v-else class="text-sm text-[--color-muted-foreground]">
                Poszt típusok betöltése...
              </div>
              <FieldError :errors="errors.post_type_id" />
            </div>
            <div class="space-y-2">
              <Label for="lead" class="text-sm font-medium">Bevezető szöveg</Label>
              <Textarea id="lead" v-model="form.lead" placeholder="Rövid bevezető szöveg a poszthoz" />
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
                v-if="!isLoadingPostGroups"
                v-model="form.post_group_ids"
                :items="postGroups"
                label="Poszt csoportok"
                placeholder="Válassz poszt csoportokat..."
                search-placeholder="Poszt csoport keresése név alapján..."
                empty-message="Nincsenek elérhető poszt csoportok."
                label-field="name"
              />
              <div v-else class="text-sm text-[--color-muted-foreground]">
                Poszt csoportok betöltése...
              </div>
              <FieldError :errors="errors.post_group_ids" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </AdminLayout>
</template>
