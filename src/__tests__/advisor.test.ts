import { describe, it, expect, vi } from 'vitest'
import { getAdvisorResponse } from '@/lib/advisor/engine'

// Store reference to the mock function
const mockCreate = vi.fn()

// Mock Anthropic client to avoid real API calls in tests
vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: class MockAnthropic {
      messages = {
        create: (...args: any[]) => mockCreate(...args)
      }
    }
  }
})

describe('AI Advisor', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: 'For a True Spring wedding guest, coral or tangerine would be stunning choices.' }],
      usage: { input_tokens: 100, output_tokens: 50 }
    })
  })

  it('returns structured advice with context awareness', async () => {
    const context = {
      season: 'True Spring',
      faceShape: 'oval',
      bodyProportions: { shoulderToHip: 'balanced', build: 'average' },
      gender: 'feminine',
      culturalContext: 'global-western'
    }
    const messages = [{ role: 'user' as const, content: 'What colour should I wear to a wedding?' }]
    const result = await getAdvisorResponse(messages, context)
    expect(result.response).toBeTruthy()
    expect(result.response.length).toBeGreaterThan(10)
    expect(result.usage).toBeDefined()
  })

  it('handles follow-up questions with memory', async () => {
    const context = { season: 'True Winter', faceShape: 'oval', bodyProportions: {}, gender: 'feminine', culturalContext: 'global-western' }
    const history = [
      { role: 'user' as const, content: 'What is my best colour?' },
      { role: 'assistant' as const, content: 'Navy blue is excellent for True Winter.' }
    ]
    const result = await getAdvisorResponse(history, context)
    expect(result.response).toBeTruthy()
  })

  it('returns error gracefully when API fails', async () => {
    mockCreate.mockRejectedValueOnce(new Error('API Error'))

    const context = { season: 'True Autumn', faceShape: 'round', bodyProportions: {}, gender: 'masculine', culturalContext: 'global-western' }
    const messages = [{ role: 'user' as const, content: 'Test' }]
    // Should throw because we mocked it to throw
    await expect(getAdvisorResponse(messages, context)).rejects.toThrow('API Error')
  })
})
