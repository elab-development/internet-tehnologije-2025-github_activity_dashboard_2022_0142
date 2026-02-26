import { render, screen } from '@testing-library/react';
import Header from '../Header';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'; 
import { SessionProvider, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

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
    vi.clearAllMocks();
    // Default state: Logged out on Home page
    (useSession as Mock).mockReturnValue({ data: null, status: "unauthenticated" }); 
    (usePathname as Mock).mockReturnValue("/");
  });

  it('renders the header component without crashing', () => {
    render(<Header />);

    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
  });

  it('shows login button and hides member links when unauthenticated', () => {
    render(<Header />);
    
    expect(screen.getByText("Log in")).toBeInTheDocument();
    expect(screen.queryByText("My Bookmarks")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it('shows logout and bookmarks when user is logged in', () => {
    (useSession as Mock).mockReturnValue({
      data: { user: { role: "USER" } },
      status: "authenticated"
    });

    render(<Header />);

    expect(screen.getByText("Log out")).toBeInTheDocument();
    expect(screen.getByText("My Bookmarks")).toBeInTheDocument();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it('shows admin link only for ADMIN role', () => {
    (useSession as Mock).mockReturnValue({
      data: { user: { role: "ADMIN" } },
      status: "authenticated"
    });

    render(<Header />);

    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("My Bookmarks")).toBeInTheDocument();
  });

  it('hides the Home link when already on the home page', () => {
    (usePathname as Mock).mockReturnValue("/");
    
    render(<Header />);
    
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
  });

  it('shows the Home link when not on the home page', () => {
    (usePathname as Mock).mockReturnValue("/user");
    
    render(<Header />);
    
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it('hides the Admin link when already on the admin page', () => {
    (useSession as Mock).mockReturnValue({
      data: { user: { role: "ADMIN" } },
      status: "authenticated"
    });
    (usePathname as Mock).mockReturnValue("/admin");

    render(<Header />);

    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });
});