// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import TextLinks from './index';
// import { NextRouter, useRouter } from 'next/router';
// import { Provider } from 'react-redux';
// import { ThemeProvider } from 'styled-components';
// import { lightTheme } from '../../../layouts/theme';
// import { makeStore } from '../../../store';

// jest.mock('next/router');
// const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

// describe('text-links', () => {
//   test('should render component without links', () => {
//     const store = makeStore();
//     mockedUseRouter.mockReturnValue({ query: {} } as NextRouter);

//     render(
//       <Provider store={store}>
//         <ThemeProvider theme={lightTheme}>
//           <TextLinks text={'This is a test'} />
//         </ThemeProvider>
//       </Provider>

//     );

//     expect(screen.queryByText('This is a test')).toBeTruthy();
//   });

//   test('should render component with links', () => {
//     const store = makeStore();
//     mockedUseRouter.mockReturnValue({ query: { terminologyId: '123123' } } as any);

//   });

// });
