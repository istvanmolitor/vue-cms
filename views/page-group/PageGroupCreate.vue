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
import { useRouter } from 'vue-router'
import { reactive, ref, onMounted, computed } from 'vue'
import { pageGroupService, type PageGroupFormData } from '../../services/pageGroupService.ts'
import { layoutService } from '../../services/layoutService.ts'

const router = useRouter()
const isSaving = ref(false)
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

onMounted(() => {
  fetchLayouts()
})
</script>

<template>
  <AdminLayout page-title="Új oldal csoport">
    <div class="flex items-center justify-between space-y-2 mb-4">
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
          />
          <FieldError :errors="errors.name" />
        </div>
        <div class="space-y-2">
          <label for="slug" class="text-sm font-medium">Slug</label>
          <Input
            id="slug"
            v-model="form.slug"
            placeholder="csoport-slug"
          />
          <FieldError :errors="errors.slug" />
        </div>
        <div class="space-y-2">
          <label for="layout" class="text-sm font-medium">Layout</label>
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

