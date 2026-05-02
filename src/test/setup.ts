import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Mock API handlers
export const handlers = [
  http.get('https://api.coingecko.com/api/v3/coins/markets', () => {
    return HttpResponse.json([
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 50000,
        market_cap: 1000000000,
        price_change_percentage_24h: 2.5,
        image: 'https://example.com/btc.png',
      }
    ])
  }),
  http.get('https://api.coingecko.com/api/v3/global', () => {
    return HttpResponse.json({
      data: {
        total_market_cap: { usd: 2000000000000 },
        total_volume: { usd: 100000000000 },
        market_cap_percentage: { btc: 45.5 },
        market_cap_change_percentage_24h_usd: 1.2,
        active_cryptocurrencies: 10000,
      }
    })
  })
]

export const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
