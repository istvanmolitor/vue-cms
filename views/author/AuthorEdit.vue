<script setup lang="ts">
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Button from '@admin/components/ui/button/Button.vue'
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
import { LayoutSelect } from '@theme'
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { authorService, type AuthorFormData } from '../../services/authorService.ts'
import { toastService } from '@admin/lib/toastService'
import LoadingSpinner from '@admin/components/ui/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const isSaving = ref(false)
const isLoading = ref(true)
const authorId = route.params.id as string
const errors = ref<any>({})

const form = reactive({
  name: '',
  slug: '',
  nickname: '',
  email: '',
  phone: '',
  position: '',
  bio: '',
  profile_url: '',
  layout: 'right-sidebar'
}) as AuthorFormData

const fetchAuthor = async () => {
  try {
    isLoading.value = true
    const { data } = await authorService.getById(authorId)
    form.name = data.data.name
    form.slug = data.data.slug
    form.nickname = data.data.nickname || ''
    form.email = data.data.email || ''
    form.phone = data.data.phone || ''
    form.position = data.data.position || ''
    form.bio = data.data.bio || ''
    form.profile_url = data.data.profile_url || ''
    form.layout = data.data.layout || 'right-sidebar'
  } catch (error) {
    console.error('Hiba a szerző betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}

    await authorService.update(authorId, form)
    toastService.success('Szerző sikeresen frissítve')
    router.push('/admin/cms/author')
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    }
    console.error('Hiba a szerző frissítésekor:', error)
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push('/admin/cms/author')
}

onMounted(() => {
  fetchAuthor()
})
</script>

<template>
  <AdminLayout page-title="Szerző szerkesztése">
    <div class="flex items-center justify-end space-y-2 mb-4">
      <Button variant="outline" @click="goBack">Vissza</Button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8"><LoadingSpinner label="Betöltés..." /></div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Szerző adatai</CardTitle>
        <CardDescription>Módosítsd a szerző adatait</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <InputField id="name" label="Név" v-model="form.name" placeholder="Szerző neve" :errors="errors.name" />
        <InputField id="slug" label="Slug" v-model="form.slug" placeholder="szerzo-neve" :errors="errors.slug" />
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
        <LayoutSelect v-model="form.layout" :errors="errors.layout" :required="true" />
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


