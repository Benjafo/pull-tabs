import { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <footer className="app-footer">
        <p>&copy; 2024 Pull Tabs Treasure - Digital Gaming Experience</p>
      </footer>
    </div>
  );
}