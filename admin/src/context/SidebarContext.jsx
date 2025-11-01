import { createContext, useState } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);
    const openMobileMenu = () => setIsMobileMenuOpen(true);

    return (
        <SidebarContext.Provider value={{ 
            isMobileMenuOpen, 
            toggleMobileMenu, 
            closeMobileMenu,
            openMobileMenu 
        }}>
            {children}
        </SidebarContext.Provider>
    );
};