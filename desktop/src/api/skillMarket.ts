import { api } from './client'
import type {
  SkillMarketDetail,
  SkillMarketInstallResult,
  SkillMarketListParams,
  SkillMarketListResponse,
  SkillMarketSource,
} from '../types/skillMarket'

export const skillMarketApi = {
  list: (params: SkillMarketListParams = {}) => {
    const query = new URLSearchParams()
    setStringParam(query, 'source', params.source)
    setStringParam(query, 'sort', params.sort)
    setStringParam(query, 'q', params.q)
    if (!query.has('q')) {
      setStringParam(query, 'query', params.query)
    }
    setStringParam(query, 'cursor', params.cursor)
    if (params.limit !== undefined) {
      query.set('limit', String(params.limit))
    }

    const suffix = query.toString() ? `?${query.toString()}` : ''
    return api.get<SkillMarketListResponse>(`/api/skill-market${suffix}`, {
      timeout: 30_000,
    })
  },

  detail: (source: SkillMarketSource, slug: string) => {
    return api.get<{ detail: SkillMarketDetail }>(
      `/api/skill-market/${source}/${encodeURIComponent(slug)}`,
      { timeout: 30_000 },
    )
  },

  install: (source: SkillMarketSource, slug: string, version?: string) => {
    const body: { source: SkillMarketSource; slug: string; version?: string } = { source, slug }
    if (version !== undefined) {
      body.version = version
    }

    return api.post<SkillMarketInstallResult>('/api/skill-market/install', body, {
      timeout: 120_000,
    })
  },
}

function setStringParam(query: URLSearchParams, name: string, value: string | undefined): void {
  const trimmed = value?.trim()
  if (trimmed) {
    query.set(name, trimmed)
  }
}
