<script setup lang="ts">
import { AdminLayout, Button, Input, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, FormButtons, FieldError, Checkbox, Modal, Icon, Label } from '@admin'
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { menuService, type MenuFormData } from '../../services/menuService.ts'
import { menuItemService, type MenuItem, type MenuItemFormData } from '../../services/menuItemService.ts'
import { languageService, type Language } from '../../../vue-language/services/languageService'
import MenuItemTree from './MenuItemTree.vue'
import TranslationRepeater from '../../../vue-language/components/TranslationRepeater.vue'

const router = useRouter()
const route = useRoute()
const isSaving = ref(false)
const isLoading = ref(true)
const menuId = route.params.id as string
const errors = ref<any>({})

const menuItems = ref<MenuItem[]>([])
const availableLanguages = ref<Language[]>([])
const selectedLanguages = ref<Language[]>([])

const form = reactive({
  name: '',
}) as MenuFormData

// MenuItem Modal state
const isItemModalOpen = ref(false)
const isEditingItem = ref(false)
const editingItemId = ref<number | null>(null)
const itemErrors = ref<any>({})
const itemForm = reactive<MenuItemFormData>({
  menu_id: parseInt(menuId),
  label: {},
  url: {},
  icon: '',
  is_external: false,
  parent_id: null,
  sort: 0
})

const fetchMenu = async () => {
  try {
    isLoading.value = true
    const [menuResponse, itemsResponse, langResponse] = await Promise.all([
      menuService.getById(menuId),
      menuItemService.getAll({ menu_id: menuId }),
      languageService.getAll()
    ])

    form.name = menuResponse.data.data.name
    menuItems.value = buildTree(itemsResponse.data.data)
    availableLanguages.value = langResponse.data.data

    // Alapértelmezett nyelvek kiválasztása (pl. hu, en)
    selectedLanguages.value = availableLanguages.value.filter(l => ['hu', 'en'].includes(l.code))
  } catch (error) {
    console.error('Hiba az adatok betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const buildTree = (items: MenuItem[], parentId: number | null = null): MenuItem[] => {
  return items
    .filter(item => item.parent_id === parentId)
    .map(item => ({
      ...item,
      children: buildTree(items, item.id)
    }))
    .sort((a, b) => a.sort - b.sort)
}

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}
    await menuService.update(menuId, form)
    router.push('/cms/menus')
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    }
    console.error('Hiba a menü frissítésekor:', error)
  } finally {
    isSaving.value = false
  }
}

const openAddItemModal = (parentId: number | null = null) => {
  isEditingItem.value = false
  editingItemId.value = null
  itemErrors.value = {}
  Object.assign(itemForm, {
    menu_id: parseInt(menuId),
    label: {},
    url: {},
    icon: '',
    is_external: false,
    parent_id: parentId,
    sort: menuItems.value.length
  })
  isItemModalOpen.value = true
}

const openEditItemModal = (item: MenuItem) => {
  isEditingItem.value = true
  editingItemId.value = item.id
  itemErrors.value = {}
  Object.assign(itemForm, {
    menu_id: item.menu_id,
    label: { ...item.label },
    url: { ...item.url },
    icon: item.icon,
    is_external: item.is_external,
    parent_id: item.parent_id,
    sort: item.sort
  })
  isItemModalOpen.value = true
}

const handleItemSubmit = async () => {
  try {
    itemErrors.value = {}
    if (isEditingItem.value && editingItemId.value) {
      await menuItemService.update(editingItemId.value, itemForm)
    } else {
      await menuItemService.create(itemForm)
    }
    isItemModalOpen.value = false
    await fetchMenu() // Refresh tree
  } catch (error: any) {
    if (error.response?.status === 422) {
      itemErrors.value = error.response.data.errors
    }
  }
}

const handleItemDelete = async (id: number) => {
  if (confirm('Biztosan törölni szeretnéd ezt a menüpontot és minden almenüjét?')) {
    try {
      await menuItemService.delete(id)
      await fetchMenu()
    } catch (error) {
      console.error('Hiba a törléskor:', error)
    }
  }
}

const handleItemMove = async (id: number, parentId: number | null, sort: number) => {
  try {
    await menuItemService.update(id, { parent_id: parentId, sort })
    await fetchMenu()
  } catch (error) {
    console.error('Hiba a mozgatáskor:', error)
  }
}

const handleAddLanguage = (id: number) => {
  const lang = availableLanguages.value.find(l => l.id === id)
  if (lang && !selectedLanguages.value.find(l => l.id === id)) {
    selectedLanguages.value.push(lang)
  }
}

const handleRemoveLanguage = (id: number) => {
  selectedLanguages.value = selectedLanguages.value.filter(l => l.id !== id)
}

const goBack = () => {
  router.push('/cms/menus')
}

onMounted(() => {
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

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Menü adatai -->
      <div class="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Menü adatai</CardTitle>
            <CardDescription>Módosítsd a menü alapadatait</CardDescription>
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
      </div>

      <!-- Menü elemek fa struktúrában -->
      <div class="md:col-span-2">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Menü elemek</CardTitle>
              <CardDescription>Rendezd a menüpontokat drag and drop módszerrel</CardDescription>
            </div>
            <Button size="sm" @click="openAddItemModal(null)">
              <Icon name="Plus" class="w-4 h-4 mr-2" />
              Új menüpont
            </Button>
          </CardHeader>
          <CardContent>
            <MenuItemTree
              v-model:items="menuItems"
              :languages="availableLanguages"
              @edit="openEditItemModal"
              @delete="handleItemDelete"
              @move="handleItemMove"
            />
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- MenuItem Modal -->
    <Modal
      :show="isItemModalOpen"
      :title="isEditingItem ? 'Menüpont szerkesztése' : 'Új menüpont hozzáadása'"
      @close="isItemModalOpen = false"
    >
      <div class="space-y-6 py-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label class="text-sm font-medium">Ikon (Lucide név)</Label>
            <Input v-model="itemForm.icon" placeholder="pl. Home, Settings" />
          </div>
          <div class="flex items-center space-x-2 pt-8">
            <Checkbox id="is_external" :checked="itemForm.is_external" @update:checked="(v: boolean) => itemForm.is_external = v" />
            <Label for="is_external" class="text-sm font-medium">Külső hivatkozás</Label>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500">Fordítások</h3>
          </div>

          <TranslationRepeater
            :languages="selectedLanguages"
            :available-languages="availableLanguages"
            @add="handleAddLanguage"
            @remove="handleRemoveLanguage"
          >
            <template #default="{ language }">
              <div class="grid grid-cols-1 gap-4" v-if="language.code">
                <div class="space-y-2">
                  <Label class="text-xs font-medium text-slate-500">Címke ({{ language.code }})</Label>
                  <Input v-model="itemForm.label[language.code]" />
                  <FieldError :errors="itemErrors[`label.${language.code}`]" />
                </div>
                <div class="space-y-2">
                  <Label class="text-xs font-medium text-slate-500">URL ({{ language.code }})</Label>
                  <Input v-model="itemForm.url[language.code]" />
                  <FieldError :errors="itemErrors[`url.${language.code}`]" />
                </div>
              </div>
            </template>
          </TranslationRepeater>
        </div>
      </div>

      <template #footer>
        <Button variant="outline" @click="isItemModalOpen = false">Mégse</Button>
        <Button @click="handleItemSubmit">Mentés</Button>
      </template>
    </Modal>
  </AdminLayout>
</template>
