import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './shared/AuthContext.jsx';
import { router } from './routes.jsx';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
