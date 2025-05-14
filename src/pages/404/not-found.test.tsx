// import { expect, test, describe, vi, afterEach } from 'vitest';
// import { render, screen, fireEvent } from '@testing-library/react';
// import { MemoryRouter, useLocation } from 'react-router-dom';
// import NotFoundPage from './not-found';
// import { Routes } from '../../components/navigation-button/type';
// import '@testing-library/jest-dom';
import { sum } from '../../functions';

test('adds 1+2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

// vi.mock('lottie-react', () => ({
//   default: vi.fn(() => <div data-testid="lottie-animation" />),
// }));

// describe('NotFoundPage', () => {
//   afterEach(() => {
//     vi.clearAllMocks();
//   });

//   const renderWithRouter = (initialRoute = '/test-path') => {
//     return render(
//       <MemoryRouter initialEntries={[initialRoute]}>
//         <NotFoundPage />
//       </MemoryRouter>,
//     );
//   };

//   test('renders correctly with path', () => {
//     renderWithRouter();

//     expect(screen.getByText(/page not found/i)).toBeInTheDocument();
//     expect(screen.getByText(/the path \/test-path does not exist/i)).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /to main/i })).toBeInTheDocument();
//     expect(screen.getByTestId('lottie-animation')).toBeInTheDocument();
//   });

//   test('navigates to main page on button click', () => {
//     let testLocation: ReturnType<typeof useLocation> | undefined;
//     function LocationTracker() {
//       testLocation = useLocation();
//       return null;
//     }

//     render(
//       <MemoryRouter initialEntries={['/test-path']}>
//         <NotFoundPage />
//         <LocationTracker />
//       </MemoryRouter>,
//     );

//     const button = screen.getByRole('button', { name: /to main/i });
//     fireEvent.click(button);

//     expect(testLocation?.pathname).toBe(Routes.main);
//   });
// });
