<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { menuItemService, type MenuItem } from '../../services/menuItemService'
import { toastService } from '@admin'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Input from '@admin/components/ui/Input.vue'
import Label from '@admin/components/ui/Label.vue'
import Checkbox from '@admin/components/ui/Checkbox.vue'
import Icon from '@admin/components/ui/Icon.vue'
import Modal from '@admin/components/ui/Modal.vue'
import MenuItemTreeNode from './MenuItemTreeNode.vue'

interface Props {
  menuId: number
}

const props = defineProps<Props>()

const menuItems = ref<MenuItem[]>([])
const isLoading = ref(false)
const showModal = ref(false)
const editingItem = ref<MenuItem | null>(null)
const expandedItems = ref<Set<number>>(new Set())

const form = ref({
  label: '',
  url: '',
  icon: '',
  is_external: false,
  parent_id: null as number | null,
})

const fetchMenuItems = async () => {
  try {
    isLoading.value = true
    const { data } = await menuItemService.getAll({ menu_id: props.menuId })
    // A backend már fa struktúrában küldi az adatokat, ezért csak simán állítsuk be
    menuItems.value = buildTree(data.data)
  } catch (error) {
    console.error('Hiba a menü elemek betöltésekor:', error)
    toastService.error('Hiba történt a menü elemek betöltése során.')
  } finally {
    isLoading.value = false
  }
}

const buildTree = (items: MenuItem[]): MenuItem[] => {
  const itemMap = new Map<number, MenuItem>()
  const rootItems: MenuItem[] = []

  // Először létrehozzuk az összes elemet a térképben
  items.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] })
  })

  // Ezután felépítjük a fát
  items.forEach(item => {
    const treeItem = itemMap.get(item.id)!
    if (item.parent_id === null) {
      rootItems.push(treeItem)
    } else {
      const parent = itemMap.get(item.parent_id)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(treeItem)
      }
    }
  })

  return rootItems
}

const flattenTree = (items: MenuItem[]): MenuItem[] => {
  const result: MenuItem[] = []
  const flatten = (items: MenuItem[]) => {
    items.forEach(item => {
      result.push(item)
      if (item.children && item.children.length > 0) {
        flatten(item.children)
      }
    })
  }
  flatten(items)
  return result
}

const openCreateModal = (parentId: number | null = null) => {
  editingItem.value = null
  form.value = {
    label: '',
    url: '',
    icon: '',
    is_external: false,
    parent_id: parentId,
  }
  showModal.value = true
}

const openEditModal = (item: MenuItem) => {
  editingItem.value = item
  form.value = {
    label: item.label,
    url: item.url || '',
    icon: item.icon || '',
    is_external: item.is_external,
    parent_id: item.parent_id,
  }
  showModal.value = true
}

const handleSave = async () => {
  try {
    const formData = {
      menu_id: props.menuId,
      label: form.value.label,
      url: form.value.url || null,
      icon: form.value.icon || null,
      is_external: form.value.is_external,
      parent_id: form.value.parent_id,
      sort: 0,
    }

    if (editingItem.value) {
      await menuItemService.update(editingItem.value.id, formData)
      toastService.success('Menü elem sikeresen frissítve!')
    } else {
      await menuItemService.create(formData)
      toastService.success('Menü elem sikeresen létrehozva!')
    }

    showModal.value = false
    await fetchMenuItems()
  } catch (error: any) {
    console.error('Hiba a mentés során:', error)
    toastService.error('Hiba történt a mentés során.')
  }
}

const deleteItem = async (item: MenuItem) => {
  if (!confirm(`Biztosan törölni szeretnéd ezt a menü elemet: ${item.label}?`)) {
    return
  }

  try {
    await menuItemService.delete(item.id)
    toastService.success('Menü elem sikeresen törölve!')
    await fetchMenuItems()
  } catch (error) {
    console.error('Hiba a törlés során:', error)
    toastService.error('Hiba történt a törlés során.')
  }
}

const toggleExpand = (itemId: number) => {
  if (expandedItems.value.has(itemId)) {
    expandedItems.value.delete(itemId)
  } else {
    expandedItems.value.add(itemId)
  }
}

const moveUp = async (item: MenuItem, siblings: MenuItem[]) => {
  const index = siblings.findIndex(s => s.id === item.id)
  if (index > 0) {
    // Swap with previous sibling
    const temp = siblings[index - 1]
    siblings[index - 1] = siblings[index]
    siblings[index] = temp
    await updateSortOrder()
  }
}

const moveDown = async (item: MenuItem, siblings: MenuItem[]) => {
  const index = siblings.findIndex(s => s.id === item.id)
  if (index < siblings.length - 1) {
    // Swap with next sibling
    const temp = siblings[index + 1]
    siblings[index + 1] = siblings[index]
    siblings[index] = temp
    await updateSortOrder()
  }
}

const updateSortOrder = async () => {
  try {
    const flatItems = flattenTree(menuItems.value)
    const updates = flatItems.map((item, index) => ({
      id: item.id,
      sort: index,
      parent_id: item.parent_id,
    }))

    // Frissítjük az elemeket egyenként
    for (const item of flatItems) {
      const update = updates.find(u => u.id === item.id)
      if (update) {
        await menuItemService.update(item.id, {
          sort: update.sort,
        })
      }
    }

    await fetchMenuItems()
    toastService.success('Sorrend sikeresen frissítve!')
  } catch (error) {
    console.error('Hiba a sorrend frissítésekor:', error)
    toastService.error('Hiba történt a sorrend frissítése során.')
  }
}

const isExpanded = (itemId: number) => expandedItems.value.has(itemId)

onMounted(() => {
  fetchMenuItems()
})
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle>Menü elemek</CardTitle>
        <Button @click="openCreateModal(null)">
          <Icon name="plus" class="w-4 h-4 mr-2" />
          Új elem
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div v-if="isLoading" class="flex justify-center py-8">
        Betöltés...
      </div>

      <div v-else-if="menuItems.length === 0" class="text-center py-8 text-gray-500">
        Még nincsenek menü elemek. Kattints az "Új elem" gombra a létrehozáshoz.
      </div>

      <div v-else class="space-y-2">
        <MenuItemTreeNode
          v-for="item in menuItems"
          :key="item.id"
          :item="item"
          :is-expanded="isExpanded(item.id)"
          :siblings="menuItems"
          :expanded-items="expandedItems"
          @toggle="toggleExpand"
          @edit="openEditModal"
          @delete="deleteItem"
          @create-child="openCreateModal"
          @move-up="moveUp"
          @move-down="moveDown"
        />
      </div>
    </CardContent>
  </Card>

  <Modal :show="showModal" :title="editingItem ? 'Menü elem szerkesztése' : 'Új menü elem'" @close="showModal = false">
    <div class="space-y-4">
      <div class="space-y-2">
        <Label for="label">Címke *</Label>
        <Input
          id="label"
          v-model="form.label"
          placeholder="pl. Kezdőlap"
        />
      </div>

      <div class="space-y-2">
        <Label for="url">URL</Label>
        <Input
          id="url"
          v-model="form.url"
          placeholder="pl. /kezdolap"
        />
      </div>

      <div class="space-y-2">
        <Label for="icon">Ikon</Label>
        <Input
          id="icon"
          v-model="form.icon"
          placeholder="pl. home"
        />
      </div>

      <div class="flex items-center space-x-2">
        <Checkbox
          id="is_external"
          v-model="form.is_external"
        />
        <Label for="is_external" class="cursor-pointer">Külső link</Label>
      </div>

      <div class="flex justify-end space-x-2 pt-4">
        <Button variant="outline" @click="showModal = false">
          Mégse
        </Button>
        <Button @click="handleSave">
          Mentés
        </Button>
      </div>
    </div>
  </Modal>
</template>





