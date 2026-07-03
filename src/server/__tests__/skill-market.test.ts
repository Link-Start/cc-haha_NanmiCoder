import { describe, expect, it } from 'bun:test'
import {
  CLAWHUB_TOP_SKILLS_RESPONSE,
  SKILLHUB_TOP_SKILLS_RESPONSE,
} from './fixtures/skill-market.js'

describe('skill market fixtures', () => {
  it('keeps representative ClawHub fixture shape stable', () => {
    expect(CLAWHUB_TOP_SKILLS_RESPONSE.items[0]).toMatchObject({
      slug: 'skill-vetter',
      displayName: 'Skill Vetter',
      stats: expect.objectContaining({ downloads: expect.any(Number) }),
    })
  })

  it('keeps representative SkillHub fixture shape stable', () => {
    expect(SKILLHUB_TOP_SKILLS_RESPONSE.data.skills[0]).toMatchObject({
      slug: 'skill-vetter',
      source: 'clawhub',
      labels: expect.objectContaining({ requires_api_key: 'false' }),
    })
  })
})
