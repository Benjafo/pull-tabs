import type { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
            </main>
            <footer className="bg-primary-800 text-white py-4 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>&copy; 2024 Pull Tabs Treasure - Digital Gaming Experience</p>
                </div>
            </footer>
        </div>
    );
}
