import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

vi.mock('*.module.css', () => ({
  default: {},
}));

vi.mock('*.css', () => ({}));
