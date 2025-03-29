import { AppProvider } from './context/AppProvider.tsx';
import { ProductsPage } from './pages/ProductsPage.tsx';

function App() {
  return (
    <AppProvider>
      <ProductsPage />
    </AppProvider>
  );
}

export default App;
