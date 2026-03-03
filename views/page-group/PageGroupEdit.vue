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
import Select from '@admin/components/ui/Select.vue'
import Label from '@admin/components/ui/Label.vue'
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, onMounted, computed } from 'vue'
import { pageGroupService, type PageGroupFormData } from '../../services/pageGroupService.ts'
import { layoutService } from '../../services/layoutService.ts'

const router = useRouter()
const route = useRoute()
const isSaving = ref(false)
const isLoading = ref(true)
const pageGroupId = route.params.id as string
const errors = ref<any>({})
const layouts = ref<any>({})

const form = reactive({
  name: '',
  slug: '',
  layout: ''
}) as PageGroupFormData

const layoutOptions = computed(() => {
  return Object.entries(layouts.value).map(([key, layout]: [string, any]) => ({
    value: key,
    label: layout.name
  }))
})

const fetchLayouts = async () => {
  try {
    const { data } = await layoutService.getAll()
    layouts.value = data.data
  } catch (error) {
    console.error('Hiba a layoutok betöltésekor:', error)
  }
}

const fetchPageGroup = async () => {
  try {
    isLoading.value = true
    const { data } = await pageGroupService.getById(pageGroupId)
    form.name = data.data.name
    form.slug = data.data.slug
    form.layout = data.data.layout || ''
  } catch (error) {
    console.error('Hiba az oldal csoport betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}

    await pageGroupService.update(pageGroupId, form)
    router.push('/cms/page-groups')
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    }
    console.error('Hiba az oldal csoport frissítésekor:', error)
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push('/cms/page-groups')
}

onMounted(() => {
  fetchLayouts()
  fetchPageGroup()
})
</script>

<template>
  <AdminLayout page-title="Oldal csoport szerkesztése">
    <div class="flex items-center justify-end space-y-2 mb-4">
      <Button variant="outline" @click="goBack">Vissza</Button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      Betöltés...
    </div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Oldal csoport adatai</CardTitle>
        <CardDescription>Módosítsd az oldal csoport adatait</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="name" class="text-sm font-medium">Név</Label>
          <Input
            id="name"
            v-model="form.name"
            placeholder="Csoport neve"
          />
          <FieldError :errors="errors.name" />
        </div>
        <div class="space-y-2">
          <Label for="slug" class="text-sm font-medium">Slug</Label>
          <Input
            id="slug"
            v-model="form.slug"
            placeholder="csoport-slug"
          />
          <FieldError :errors="errors.slug" />
        </div>
        <div class="space-y-2">
          <Label for="layout" class="text-sm font-medium">Layout</Label>
          <Select
            id="layout"
            v-model="form.layout"
            :options="layoutOptions"
            placeholder="Válassz layoutot..."
          />
          <FieldError :errors="errors.layout" />
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

