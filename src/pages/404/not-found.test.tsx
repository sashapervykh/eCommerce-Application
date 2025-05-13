import { expect, test } from 'vitest';
import { sum } from '../../functions';

test('adds 1+2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

// import { vi, test, expect, describe } from 'vitest';
// import { render, screen, fireEvent } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import NotFoundPage from '../pages/404/not-found';
// import { Routes } from '../components/navigation-button/type';
// import '@testing-library/jest-dom';
// import NavigationButton from '../components/navigation-button/navigation-button';

// interface NavigationButtonProperties {
//   route: Routes;
//   text: string;
//   onClick?: (route: Routes) => void;
// }

// vi.mock('../components/navigation-button/navigation-button', () => ({
//   default: vi.fn(({ route, text, onClick }: NavigationButtonProperties) => (
//     <button onClick={() => onClick?.(route)} data-testid="navigation-button">
//       {text}
//     </button>
//   )),
// }));

// vi.mock('react-router-dom', async () => {
//   const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
//   return {
//     ...actual,
//     useLocation: vi.fn(() => ({
//       pathname: '/test-path',
//       search: '',
//       hash: '',
//       state: undefined,
//       key: 'test-key',
//     })),
//   };
// });

// vi.mock('lottie-react', () => ({
//   default: vi.fn(() => <div data-testid="lottie-animation" />),
// }));

// describe('NotFoundPage', () => {
//   test('renders correctly with path', () => {
//     render(
//       <MemoryRouter>
//         <NotFoundPage />
//       </MemoryRouter>,
//     );

//     expect(screen.getByText(/page not found/i)).toBeInTheDocument();
//     expect(screen.getByText(/the path \/test-path does not exist/i)).toBeInTheDocument();
//   });

//   test('navigates to main page on button click', () => {
//     const mockOnClick = vi.fn();
//     const MockedNavigationButton = vi.mocked(NavigationButton);

//     MockedNavigationButton.mockImplementation(({ route, text, onClick }: NavigationButtonProperties) => (
//       <button
//         onClick={() => {
//           onClick?.(route);
//           mockOnClick(route);
//         }}
//         data-testid="navigation-button"
//       >
//         {text}
//       </button>
//     ));

//     render(
//       <MemoryRouter>
//         <NotFoundPage />
//       </MemoryRouter>,
//     );

//     fireEvent.click(screen.getByTestId('navigation-button'));
//     expect(mockOnClick).toHaveBeenCalledWith(Routes.main);
//   });
// });
