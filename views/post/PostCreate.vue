<script setup lang="ts">
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import InputField from '@admin/components/ui/InputField.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
import Label from '@admin/components/ui/Label.vue'
import CheckboxField from '@admin/components/ui/CheckboxField.vue'
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
import EditContent from '../../components/EditContent.vue'
import PostTypeSelect from '../../components/PostTypeSelect.vue'
import LanguageSelector from '@language/components/LanguageSelector.vue'
import { LayoutSelect } from '@theme'
import { toastService } from '@admin/lib/toastService'

const router = useRouter()
const isSaving = ref(false)
const isLoadingAuthors = ref(true)
const isLoadingPostGroups = ref(true)
const errors = ref<any>({})
const authors = ref<Author[]>([])
const postGroups = ref<PostGroup[]>([])

const form = reactive({
  title: '',
  slug: '',
  is_published: false,
  lead: '',
  layout: '',
  main_image_url: '',
  language_id: null as number | null,
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
      errors.value = error.response?.data?.errors ?? {}
    } else {
      toastService.error('Hiba a poszt létrehozásakor')
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
            <EditContent v-model="form.content_elements" :errors="errors" />
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
            <CheckboxField id="is_published" label="Publikálva" v-model="form.is_published" :errors="errors.is_published" />
            <InputField id="title" label="Cím" v-model="form.title" placeholder="Poszt címe" :errors="errors.title" />
            <InputField id="slug" label="Slug" v-model="form.slug" placeholder="poszt-cime" :errors="errors.slug" />
            <PostTypeSelect v-model="form.post_type_id" :errors="errors.post_type_id" />
            <div class="space-y-2">
              <Label>Nyelv <span class="text-destructive">*</span></Label>
              <LanguageSelector v-model="form.language_id" :required="true" :auto-select-default="true" />
              <FieldError :errors="errors.language_id" />
            </div>
            <div class="space-y-2">
              <Label for="lead">Bevezető szöveg</Label>
              <Textarea id="lead" v-model="form.lead" placeholder="Rövid bevezető szöveg a poszthoz" />
              <FieldError :errors="errors.lead" />
            </div>
            <LayoutSelect v-model="form.layout" :errors="errors.layout" :required="true" />
            <hr class="my-6" />
            <div class="space-y-2">
              <Label>Főkép</Label>
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
