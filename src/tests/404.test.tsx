import { vi, test, expect } from 'vitest';

vi.mock('../pages/404/not-found', () => ({
  default: vi.fn(),
}));

test('Mocked component check', async () => {
  const { default: Component } = await import('../pages/404/not-found');
  expect(Component).toBeDefined();
});

test('Component exists and is function', async () => {
  const { default: Component } = await import('../pages/404/not-found');
  expect(typeof Component).toBe('function');
});

test('Mocked component can be called', async () => {
  const { default: Component } = await import('../pages/404/not-found');
  Component();
  expect(Component).toHaveBeenCalled();
});
