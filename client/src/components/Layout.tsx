import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import FloatingChatButton from './FloatingChatButton';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-64"> {/* Adjust margin to match sidebar width (w-64) */}
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <FloatingChatButton />
      </div>
    </div>
  );
}
