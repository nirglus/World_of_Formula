import { test ,screen ,render} from 'vitest';
import Login from "./Login";

describe('Login component', () => {
    test('renders login form without crashing', () => {
        render(<Login />);
        const helloWorldElement = screen.getByText('Login');
        expect(helloWorldElement).toBeInTheDocument();
    });
})


  
//   test('input fields update state correctly', () => {
//     render(<Login />);
//     const emailInput = screen.getByPlaceholderText('example123@email.com');
//     const passwordInput = screen.getByPlaceholderText('Enter your password');
  
//     fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
//     fireEvent.change(passwordInput, { target: { value: 'password123' } });
  
//     expect(emailInput.value).toBe('test@example.com');
//     expect(passwordInput.value).toBe('password123');
//   });