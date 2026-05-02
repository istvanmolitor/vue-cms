# Vue CMS Composables

Ez a mappa tartalmazza a vue-cms csomag újrafelhasználható composable-jeit.

## `useContentElementEditor.ts`

### Áttekintés

Ez a composable kinyeri az ismétlődő logikát a content element editor komponensekből. Minden editor komponens hasonló mintát követ:

1. Props fogadása (`settings`, `contentElements`)
2. Emit események (`update:settings`, `update:contentElements`)
3. Reaktív ref-ek létrehozása a settings értékeihez
4. Üres settings inicializálása alapértelmezett értékekkel
5. Watch a props.settings változásaira
6. UpdateValue függvény az emit-eléshez

### `useElementSettings`

Ez a javasolt composable az editor komponensekhez.

#### Használat

```typescript
import { watch } from 'vue'
import { useElementSettings } from '../../composables/useContentElementEditor'

interface Props {
  settings: Record<string, any>
  contentElements?: ContentElement[]
}

const props = defineProps<Props>()
const emit = defineEmits(['update:settings', 'update:contentElements'])

// Automatikusan létrehoz reaktív ref-eket minden beállításhoz
const { text, align, updateValue } = useElementSettings(
  props.settings,
  emit,
  { text: '', align: 'left' } // alapértelmezett értékek
)

// Watch a változásokra
watch([text, align], updateValue)
```

#### Mit csinál automatikusan?

1. **Reaktív ref-ek létrehozása**: Minden alapértelmezett beállításhoz létrehoz egy `ref`-et
2. **Inicializálás**: Ha a `settings` üres, emit-eli az alapértelmezett értékeket
3. **Props watching**: Automatikusan frissíti a local ref-eket ha a props változik
4. **updateValue függvény**: Létrehoz egy függvényt ami összegyűjti az összes ref értékét és emit-eli

#### Példa komponensek

**Egyszerű használat:**
```typescript
// TextElementEditor.vue
const { text, align, updateValue } = useElementSettings(
  props.settings,
  emit,
  { text: '', align: 'left' }
)
watch([text, align], updateValue)
```

**Egyedi updateValue logikával:**
```typescript
// HeadingElementEditor.vue
const { text, level, updateValue: baseUpdateValue } = useElementSettings(
  props.settings,
  emit,
  { text: '', level: 1 }
)

// Felülírhatod az updateValue-t egyedi logikával
const updateValue = () => {
  emit('update:settings', {
    text: text.value,
    level: parseInt(level.value.toString()) // típus konverzió
  })
}
watch([text, level], updateValue)
```

### `useContentElementEditor`

Ez egy alternatív, rugalmasabb API, de bonyolultabb használni. Jelenleg deprecated a `useElementSettings` javára.

## Refaktorált komponensek

A következő komponensek már használják a `useElementSettings` composable-t:

- ✅ `HeadingElementEditor.vue` - egyedi updateValue parseInt-hez
- ✅ `TextElementEditor.vue` 
- ✅ `QuoteElementEditor.vue`
- ✅ `CodeElementEditor.vue`
- ✅ `VideoElementEditor.vue`

### Még nem refaktorált komponensek

Ezek a komponensek egyedi logikát tartalmaznak, ami nehezíti a refaktorálást:

- `ImageElementEditor.vue` - MediaFilePicker integráció
- `ListElementEditor.vue` - dinamikus lista kezelés (add/remove items)
- `IframeElementEditor.vue` - boolean allowFullscreen kezelés
- `ColumnsElementEditor.vue` - nested content_elements kezelés, rekurzív komponens

Ezek a komponensek **manuálisan egyszerűsítve lettek**, de nem használják a composable-t a speciális logikájuk miatt.

## Kód csökkentés

### Előtte (példa - TextElementEditor):
```typescript
// ~37 sor
import { ref, watch, onMounted } from 'vue'

const text = ref(props.modelValue?.text || '')
const align = ref(props.modelValue?.align || 'left')

onMounted(() => {
  if (!props.modelValue || Object.keys(props.modelValue).length === 0) {
    emit('update:modelValue', { text: '', align: 'left' })
  }
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    text.value = newVal.text || ''
    align.value = newVal.align || 'left'
  }
}, { deep: true })

const updateValue = () => {
  emit('update:modelValue', {
    text: text.value,
    align: align.value
  })
}

watch([text, align], updateValue)
```

### Utána:
```typescript
// ~18 sor (-51%)
import { watch } from 'vue'
import { useElementSettings } from '../../composables/useContentElementEditor'

const { text, align, updateValue } = useElementSettings(
  props.settings,
  emit,
  { text: '', align: 'left' }
)

watch([text, align], updateValue)
```

**Eredmény**: ~50% kód csökkentés az egyszerűbb komponensekben!

