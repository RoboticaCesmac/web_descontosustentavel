import { useRef, useState } from 'react'
import { InputIcon } from '../../components/InputIcon/InputIcon'
import './LoginPage.css'
import { useNavigate } from 'react-router-dom'
import bcrypt from 'bcryptjs';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import useUserStore from '../../store/userStore'
import useFetchData from '../../hooks/useFetchData'

export default function LoginPage() {
    const {user, setUser} = useUserStore();
    const { getDataByQuery } = useFetchData();

    const userInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function verifyPassword(inputPassword, storedHashedPassword) {
        const isMatch = await bcrypt.compare(inputPassword, storedHashedPassword);
        return isMatch;
    }

    async function handleLoginSubmit(e){
        e.preventDefault();
        setLoading(true);

        const userInput = userInputRef.current.value;
        const password = passwordInputRef.current.value;

        try{
            const res = await getDataByQuery("admins", "user", "==", userInput);
            const userCredentials = res[0];

            if(!userCredentials) throw new Error("Esse usuário não existe.");
            if(!await verifyPassword(password, userCredentials.password)) throw new Error("Senha incorreta.");

            setUser({...userCredentials, password: undefined});
            navigate("/produtos");
        } catch(e){
            if(e.message.includes("invalid")) {
                e.message = "Credenciais inválidas.";
            }
            setDialogOpen(true);
            setError(e.message);
        }
    }

    return (
        <div id="loginPage" className=''>
            <div id="logoContainer">
                <img id='logo' src="/logo.png" alt="" />
                <div className="main">                    
                    <div className="login">
                        <form id="loginForm" onSubmit={handleLoginSubmit}>
                            <label aria-hidden="true">Entrar</label>
                            <InputIcon
                                ref={userInputRef}
                                type="text"
                                iconName="person" 
                                placeholder="usuário" required={true}/>
                            <InputIcon
                                ref={passwordInputRef}
                                type="password" 
                                iconName="lock"
                                placeholder="Senha" required={true} />

                            <button id="loginBtn" type="submit">Entrar</button>
                        </form>
                    </div>
                </div>
            </div>

            {dialogOpen && 
                <AlertDialog open={dialogOpen}>
                    <AlertDialogContent className="bg-slate-100">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Error</AlertDialogTitle>
                            <AlertDialogDescription>
                                {error}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => setDialogOpen(false)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            }
        </div>
    )
}