import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  test('渲染Header组件', () => {
    renderWithRouter(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  test('包含导航链接', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText(/首页/i)).toBeInTheDocument();
    expect(screen.getByText(/上传/i)).toBeInTheDocument();
  });
});
