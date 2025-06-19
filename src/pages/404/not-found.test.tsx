import { expect, test, describe, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NotFoundPage } from './not-found';
import { Routes } from '../../components/navigation-button/type';
import '@testing-library/jest-dom';

vi.mock('lottie-react', () => ({
  default: vi.fn(() => <div data-testid="lottie-animation" />),
}));

const renderWithRouter = (ui: React.ReactElement, { path = '/test-path' } = {}) => {
  globalThis.history.pushState({}, '', path);
  return render(ui, { wrapper: BrowserRouter });
};

describe('NotFoundPage', () => {
  afterEach(() => {
    globalThis.history.pushState({}, '', '/');
    vi.clearAllMocks();
  });

  test('renders correctly with path', () => {
    renderWithRouter(<NotFoundPage />);

    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    expect(screen.getByText(/the path \/test-path does not exist/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /to main/i })).toBeInTheDocument();
    expect(screen.getByTestId('lottie-animation')).toBeInTheDocument();
  });

  test('navigates to main page on button click', () => {
    renderWithRouter(<NotFoundPage />);

    const button = screen.getByRole('button', { name: /to main/i });
    fireEvent.click(button);

    expect(globalThis.location.pathname).toBe(Routes.main);
  });
});
