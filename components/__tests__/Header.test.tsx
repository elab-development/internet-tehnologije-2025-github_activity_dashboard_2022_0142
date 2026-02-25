   import { render, screen } from '@testing-library/react';
   import Header from '../Header';
   import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'; 
   import { SessionProvider, useSession } from 'next-auth/react';

   vi.mock("next-auth/react", () => ({
     useSession: vi.fn(),
     SessionProvider: ({ children }: { children: React.ReactNode }) => children,
     signIn: vi.fn(),
     signOut: vi.fn(),
   }));

   vi.mock("next/navigation", () => ({
     usePathname: vi.fn(() => "/"),
     useSearchParams: vi.fn(() => new URLSearchParams()), 
  }));

   describe('Header', () => {
     beforeEach(() => {
       (useSession as Mock).mockReturnValue({ data: null, status: "unauthenticated" }); 
     });

     it('renders the header component without crashing', () => {
       render(
         <SessionProvider>
           <Header />
         </SessionProvider>
       );

       const headerElement = screen.getByRole('banner');
       expect(headerElement).toBeInTheDocument();
     });
   });
