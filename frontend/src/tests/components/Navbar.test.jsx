import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import NavBar from "../../components/Navbar/Navbar";

describe('NavBar', () => {
    it('should render only 3 links if there is no user', () => {
        render(<NavBar />);
        
        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(3);
    })
})