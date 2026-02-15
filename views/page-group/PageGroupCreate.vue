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
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { pageGroupService, type PageGroupFormData } from '../../services/pageGroupService.ts'

const router = useRouter()
const isSaving = ref(false)
const errors = ref<any>({})

const form = reactive({
  name: '',
  slug: ''
}) as PageGroupFormData

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}

    await pageGroupService.create(form)
    router.push('/cms/page-groups')
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    }
    console.error('Hiba az oldal csoport létrehozásakor:', error)
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push('/cms/page-groups')
}
</script>

<template>
  <AdminLayout>
    <div class="flex items-center justify-between space-y-2 mb-4">
      <h2 class="text-3xl font-bold tracking-tight">Új oldal csoport</h2>
      <Button variant="outline" @click="goBack">Vissza</Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Oldal csoport adatai</CardTitle>
        <CardDescription>Add meg az új oldal csoport adatait</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <label for="name" class="text-sm font-medium">Név</label>
          <Input
            id="name"
            v-model="form.name"
            placeholder="Csoport neve"
            :error="errors.name?.[0]"
          />
        </div>
        <div class="space-y-2">
          <label for="slug" class="text-sm font-medium">Slug</label>
          <Input
            id="slug"
            v-model="form.slug"
            placeholder="csoport-slug"
            :error="errors.slug?.[0]"
          />
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

