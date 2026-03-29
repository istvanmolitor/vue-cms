<script setup lang="ts">
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Input from '@admin/components/ui/Input.vue'
import Select from '@admin/components/ui/Select.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import FormButtons from '@admin/components/ui/button/FormButtons.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import Label from '@admin/components/ui/Label.vue'
import MenuItemEditor from '../../components/menu/MenuItemEditor.vue'
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { menuService, type MenuFormData } from '../../services/menuService.ts'
import { languageService } from '@language/services/languageService'
import type { SelectOption } from '@admin/index'

const router = useRouter()
const route = useRoute()
const isSaving = ref(false)
const isLoading = ref(true)
const isLoadingLanguages = ref(true)
const menuId = route.params.id as string
const errors = ref<any>({})
const languageOptions = ref<SelectOption[]>([])

const form = reactive({
  name: '',
  language_id: null
}) as MenuFormData

const fetchLanguages = async () => {
  try {
    isLoadingLanguages.value = true
    const { data } = await languageService.getOptions()
    languageOptions.value = data.data
  } catch (error) {
    console.error('Hiba a nyelvek betöltésekor:', error)
  } finally {
    isLoadingLanguages.value = false
  }
}

const fetchMenu = async () => {
  try {
    isLoading.value = true
    const { data } = await menuService.getById(menuId)
    form.name = data.data.name
    form.language_id = data.data.language_id || null
  } catch (error) {
    console.error('Hiba a menü betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}

    await menuService.update(menuId, form)
    router.push('/admin/cms/menu')
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    }
    console.error('Hiba a menü frissítésekor:', error)
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push('/admin/cms/menu')
}

onMounted(() => {
  fetchLanguages()
  fetchMenu()
})
</script>

<template>
  <AdminLayout page-title="Menü szerkesztése">
    <div class="flex items-center justify-end space-y-2 mb-4">
      <Button variant="outline" @click="goBack">Vissza</Button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      Betöltés...
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Menü adatai</CardTitle>
            <CardDescription>Módosítsd a menü adatait</CardDescription>
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
            <div class="space-y-2">
              <Label for="language_id" class="text-sm font-medium">Nyelv</Label>
              <Select
                id="language_id"
                v-model="form.language_id"
                :options="languageOptions"
                placeholder="Válassz nyelvet..."
              />
              <FieldError :errors="errors.language_id" />
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
      </div>
      <div class="lg:col-span-2">
        <MenuItemEditor :menu-id="parseInt(menuId)" />
      </div>
    </div>
  </AdminLayout>
</template>



