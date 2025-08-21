import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Index from '../Index';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Index Page', () => {
  test('渲染首页', () => {
    renderWithRouter(<Index />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('包含主要功能区域', () => {
    renderWithRouter(<Index />);
    expect(screen.getByText(/智能求职助手/i)).toBeInTheDocument();
  });
});
