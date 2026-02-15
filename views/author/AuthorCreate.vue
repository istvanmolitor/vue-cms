<script setup lang="ts">
import AdminLayout from '@admin/components/layout/DashboardLayout.vue'
import Button from '@admin/components/ui/Button.vue'
import Input from '@admin/components/ui/Input.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import FormButtons from '@admin/components/ui/FormButtons.vue'
import { MediaFilePicker } from '@/packages/vue-media'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { authorService, type AuthorFormData } from '../../services/authorService.ts'

const router = useRouter()
const isSaving = ref(false)
const errors = ref<any>({})

const form = reactive({
  name: '',
  profile_url: ''
}) as AuthorFormData

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}

    await authorService.create(form)
    router.push('/cms/authors')
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
  router.push('/cms/authors')
}
</script>

<template>
  <AdminLayout>
    <div class="flex items-center justify-between space-y-2 mb-4">
      <h2 class="text-3xl font-bold tracking-tight">Új szerző</h2>
      <Button variant="outline" @click="goBack">Vissza</Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Szerző adatai</CardTitle>
        <CardDescription>Add meg az új szerző adatait</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <label for="name" class="text-sm font-medium">Név</label>
          <Input
            id="name"
            v-model="form.name"
            placeholder="Szerző neve"
            :error="errors.name?.[0]"
          />
        </div>
        <div class="space-y-2">
          <label for="profile_url" class="text-sm font-medium">Profil URL</label>
          <MediaFilePicker
            v-model="form.profile_url"
            :accept-types="['image/*']"
          />
          <p v-if="errors.profile_url?.[0]" class="text-sm text-red-500">
            {{ errors.profile_url[0] }}
          </p>
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


