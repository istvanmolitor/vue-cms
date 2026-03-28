<script setup lang="ts">
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Modal, Icon, Label, Input, Checkbox, FieldError } from '@admin'
import { ref, reactive, onMounted } from 'vue'
import { menuItemService, type MenuItem, type MenuItemFormData } from '../../services/menuItemService.ts'
import MenuItemTree from './MenuItemTree.vue'

const props = defineProps<{
  menuId: string | number
}>()

const menuItems = ref<MenuItem[]>([])
const isLoading = ref(true)

// MenuItem Modal state
const isItemModalOpen = ref(false)
const isEditingItem = ref(false)
const editingItemId = ref<number | null>(null)
const itemErrors = ref<any>({})
const itemForm = reactive<MenuItemFormData>({
  menu_id: typeof props.menuId === 'string' ? parseInt(props.menuId) : props.menuId,
  label: '',
  url: '',
  icon: '',
  is_external: false,
  parent_id: null,
  sort: 0
})

const fetchMenuItems = async () => {
  try {
    isLoading.value = true
    const itemsResponse = await menuItemService.getAll({ menu_id: props.menuId })
    menuItems.value = buildTree(itemsResponse.data.data)
  } catch (error) {
    console.error('Hiba a menü elemek betöltésekor:', error)
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

const openAddItemModal = (parentId: number | null = null) => {
  isEditingItem.value = false
  editingItemId.value = null
  itemErrors.value = {}
  Object.assign(itemForm, {
    menu_id: typeof props.menuId === 'string' ? parseInt(props.menuId) : props.menuId,
    label: '',
    url: '',
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
    label: item.label,
    url: item.url,
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
    await fetchMenuItems() // Refresh tree
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
      await fetchMenuItems()
    } catch (error) {
      console.error('Hiba a törléskor:', error)
    }
  }
}

const handleItemMove = async (id: number, parentId: number | null, sort: number) => {
  try {
    await menuItemService.update(id, { parent_id: parentId, sort })
    await fetchMenuItems()
  } catch (error) {
    console.error('Hiba a mozgatáskor:', error)
  }
}

onMounted(() => {
  fetchMenuItems()
})
</script>

<template>
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
      <div v-if="isLoading" class="flex justify-center py-8">
        Betöltés...
      </div>
      <MenuItemTree
        v-else
        v-model:items="menuItems"
        @edit="openEditItemModal"
        @delete="handleItemDelete"
        @move="handleItemMove"
      />
    </CardContent>
  </Card>

  <!-- MenuItem Modal -->
  <Modal
    :show="isItemModalOpen"
    :title="isEditingItem ? 'Menüpont szerkesztése' : 'Új menüpont hozzáadása'"
    @close="isItemModalOpen = false"
  >
    <div class="space-y-6 py-4">
      <div class="space-y-2">
        <Label class="text-sm font-medium">Címke</Label>
        <Input v-model="itemForm.label" placeholder="Menüpont címkéje" />
        <FieldError :errors="itemErrors.label" />
      </div>

      <div class="space-y-2">
        <Label class="text-sm font-medium">URL</Label>
        <Input v-model="itemForm.url" placeholder="/útvonal vagy https://..." />
        <FieldError :errors="itemErrors.url" />
      </div>

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
    </div>

    <template #footer>
      <Button variant="outline" @click="isItemModalOpen = false">Mégse</Button>
      <Button @click="handleItemSubmit">Mentés</Button>
    </template>
  </Modal>
</template>

