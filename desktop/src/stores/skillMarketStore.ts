import { create } from 'zustand'
import { skillMarketApi } from '../api/skillMarket'
import type {
  SkillMarketDetail,
  SkillMarketItem,
  SkillMarketListSource,
  SkillMarketSort,
  SkillMarketSource,
} from '../types/skillMarket'

type SkillMarketStore = {
  items: SkillMarketItem[]
  selectedDetail: SkillMarketDetail | null
  source: SkillMarketListSource
  sort: SkillMarketSort
  query: string
  isLoading: boolean
  isDetailLoading: boolean
  isInstalling: boolean
  error: string | null
  setSource: (source: SkillMarketListSource) => void
  setSort: (sort: SkillMarketSort) => void
  setQuery: (query: string) => void
  fetchItems: () => Promise<void>
  fetchDetail: (source: SkillMarketSource, slug: string) => Promise<void>
  installSelected: () => Promise<void>
  clearDetail: () => void
}

export const useSkillMarketStore = create<SkillMarketStore>((set, get) => ({
  items: [],
  selectedDetail: null,
  source: 'auto',
  sort: 'downloads',
  query: '',
  isLoading: false,
  isDetailLoading: false,
  isInstalling: false,
  error: null,

  setSource: (source) => set({ source }),
  setSort: (sort) => set({ sort }),
  setQuery: (query) => set({ query }),

  fetchItems: async () => {
    const { source, sort, query } = get()
    set({ isLoading: true, error: null })
    try {
      const result = await skillMarketApi.list({
        source,
        sort,
        q: query.trim() || undefined,
      })
      set({ items: result.items, isLoading: false })
    } catch (err) {
      set({
        isLoading: false,
        error: getErrorMessage(err),
      })
    }
  },

  fetchDetail: async (source, slug) => {
    set({ isDetailLoading: true, error: null })
    try {
      const { detail } = await skillMarketApi.detail(source, slug)
      set({ selectedDetail: detail, isDetailLoading: false })
    } catch (err) {
      set({
        isDetailLoading: false,
        error: getErrorMessage(err),
      })
    }
  },

  installSelected: async () => {
    const detail = get().selectedDetail
    if (!detail) return

    set({ isInstalling: true, error: null })
    try {
      await skillMarketApi.install(detail.source, detail.slug, detail.version)
      await get().fetchItems()
      await get().fetchDetail(detail.source, detail.slug)
      set({ isInstalling: false })
    } catch (err) {
      set({
        isInstalling: false,
        error: getErrorMessage(err),
      })
    }
  },

  clearDetail: () => set({ selectedDetail: null }),
}))

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}
