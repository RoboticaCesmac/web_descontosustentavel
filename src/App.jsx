import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import LoginPage from './pages/LoginPage/LoginPage'
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase/config"
import { useEffect, useState } from "react"
import Header from "./components/Header/Header"
import Aside from "./components/Aside/Aside"
import DefaultPageLoader from "./components/DefaultPageLoader/DefaultPageLoader"
import useUserStore from "./store/userStore"
import UsersPage from "./pages/UsersPage/UsersPage"
import ProductsPage from "./pages/ProductsPage/ProductsPage"
import CategoriesPage from "./pages/CategoriesPage/CategoriesPage"
import useFetchData from "./hooks/useFetchData"

export default function App() {
  const { user, setUser } = useUserStore();
  const { getDataById } = useFetchData();

  const [ loading, setLoading ] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const verifyAuth = async () => {
      const userCredential = JSON.parse(sessionStorage.getItem("user"));
      if(userCredential){
        const verifiedUserCredential = await getDataById("admins", userCredential.id);
        if (verifiedUserCredential) setUser({...verifiedUserCredential, password: undefined});
      }
      setLoading(false);
    }
    verifyAuth();
  }, []);

  const notAuthRoutes = ['/'];
  const authRoutes = !notAuthRoutes.includes(location.pathname);
  
  return (
    <>
      {loading 
        ? <DefaultPageLoader />
        :
        <>
          {authRoutes && <Header />}
          <main id={authRoutes ? 'mainAppContainer' : ''}>
            {authRoutes && <Aside />}
            <Routes>
              {/* Don't Need Auth */}
              <Route path='/' element={!user ? <LoginPage /> : <Navigate to="/produtos"/>}></Route>

              {/* Need Auth */}
              <Route path='/produtos' element={user ? <ProductsPage /> : <Navigate to="/"/>}></Route>
              <Route path='/usuarios' element={user ? <UsersPage /> : <Navigate to="/"/>}></Route>
              <Route path='/categorias' element={user ? <CategoriesPage /> : <Navigate to="/"/>}></Route>
            </Routes>
          </main>
        </>
      }
    </>
  )
}