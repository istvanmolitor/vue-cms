<script setup lang="ts">
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Input from '@admin/components/ui/Input.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import FormButtons from '@admin/components/ui/button/FormButtons.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import Label from '@admin/components/ui/Label.vue'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { menuService, type MenuFormData } from '../../services/menuService.ts'

const router = useRouter()
const isSaving = ref(false)
const errors = ref<any>({})

const form = reactive({
  name: '',
}) as MenuFormData

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}

    await menuService.create(form)
    router.push('/cms/menus')
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    }
    console.error('Hiba a menü létrehozásakor:', error)
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push('/cms/menus')
}
</script>

<template>
  <AdminLayout page-title="Új menü">
    <div class="flex items-center justify-end space-y-2 mb-4">
      <Button variant="outline" @click="goBack">Vissza</Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Menü adatai</CardTitle>
        <CardDescription>Add meg az új menü adatait</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="name" class="text-sm font-medium">Név</Label>
          <Input
            id="name"
            v-model="form.name"
            placeholder="Menü neve"
          />
          <FieldError :errors="errors.name" />
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
