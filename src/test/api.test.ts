import { describe, it, expect } from 'vitest'
import { fetchCryptoMarkets, fetchGlobalData } from '@/lib/api'

describe('API Integration Tests', () => {
  it('should fetch crypto markets correctly', async () => {
    const markets = await fetchCryptoMarkets()
    expect(markets).toBeDefined()
    expect(markets.length).toBeGreaterThan(0)
    expect(markets[0].id).toBe('bitcoin')
    expect(markets[0].current_price).toBe(50000)
  })

  it('should fetch global market data correctly', async () => {
    const globalData = await fetchGlobalData()
    expect(globalData).toBeDefined()
    expect(globalData.totalMarketCap).toBe(2000000000000)
    expect(globalData.btcDominance).toBe(45.5)
  })
})
