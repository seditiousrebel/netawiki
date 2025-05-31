// jest.setup.js
import '@testing-library/jest-dom'

// Mock ResizeObserver for Recharts tests
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
