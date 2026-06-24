<script setup lang="ts">
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Input from '@admin/components/ui/Input.vue'
import InputField from '@admin/components/ui/InputField.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import FormButtons from '@admin/components/ui/button/FormButtons.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import Label from '@admin/components/ui/Label.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
import MediaFilePicker from '@media/components/MediaFilePicker.vue'
import { useRouter } from 'vue-router'
import { reactive, ref, watch } from 'vue'
import { authorService, type AuthorFormData } from '../../services/authorService.ts'
import { toastService } from '@admin/lib/toastService'

const router = useRouter()
const isSaving = ref(false)
const errors = ref<any>({})

const isSlugManuallyEdited = ref(false)

const slugify = (text: string): string => {
  const map: Record<string, string> = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ö': 'o', 'ő': 'o',
    'ú': 'u', 'ü': 'u', 'ű': 'u',
  }
  return text
    .toLowerCase()
    .split('')
    .map(c => map[c] ?? c)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const form = reactive({
  name: '',
  slug: '',
  nickname: '',
  email: '',
  phone: '',
  position: '',
  bio: '',
  profile_url: ''
}) as AuthorFormData

watch(() => form.name, (newName) => {
  if (!isSlugManuallyEdited.value) {
    form.slug = slugify(newName)
  }
})

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}

    const response: any = await authorService.create(form)
    toastService.success('Szerző sikeresen létrehozva')

    const createdAuthorId = response?.data?.data?.id ?? response?.data?.id ?? response?.id

    if (createdAuthorId !== undefined && createdAuthorId !== null) {
      await router.push({
        name: 'cms-author-edit',
        params: {
          id: String(createdAuthorId),
        },
      })

      return
    }

    router.push('/admin/cms/author')
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    }
    console.error('Hiba a szerző létrehozásakor:', error)
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push('/admin/cms/author')
}
</script>

<template>
  <AdminLayout page-title="Új szerző">
    <div class="flex items-center justify-end space-y-2 mb-4">
      <Button variant="outline" @click="goBack">Vissza</Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Szerző adatai</CardTitle>
        <CardDescription>Add meg az új szerző adatait</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <InputField id="name" label="Név" v-model="form.name" placeholder="Szerző neve" :errors="errors.name" />
        <div class="space-y-2">
          <Label for="slug">Slug</Label>
          <Input
            id="slug"
            v-model="form.slug"
            placeholder="szerzo-neve"
            @input="isSlugManuallyEdited = true"
          />
          <FieldError :errors="errors.slug" />
        </div>
        <InputField id="nickname" label="Becenév" v-model="form.nickname" placeholder="Becenév" :errors="errors.nickname" />
        <InputField id="email" label="E-mail" v-model="form.email" :type="'email'" placeholder="email@pelda.hu" :errors="errors.email" />
        <InputField id="phone" label="Telefonszám" v-model="form.phone" placeholder="+36 30 123 4567" :errors="errors.phone" />
        <InputField id="position" label="Beosztás" v-model="form.position" placeholder="pl. Főszerkesztő" :errors="errors.position" />
        <div class="space-y-2">
          <Label for="bio">Bemutatkozás</Label>
          <Textarea
            id="bio"
            v-model="form.bio"
            placeholder="Rövid bemutatkozó szöveg..."
            :rows="4"
          />
          <FieldError :errors="errors.bio" />
        </div>
        <div class="space-y-2">
          <Label for="profile_url">Profil URL</Label>
          <MediaFilePicker
            v-model="form.profile_url"
            :accept-types="['image/*']"
          />
          <FieldError :errors="errors.profile_url" />
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


