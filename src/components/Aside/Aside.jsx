import { Link, NavLink, useNavigate } from 'react-router-dom'
import './Aside.css'
import useUserStore from '../../store/userStore';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Aside() {
	const { user, setUser, logout } = useUserStore();
	const navigate = useNavigate();

	function handleLogout(e){
		e.preventDefault();
		logout();
		navigate("/");
	}

	return(
		<div id='mainAside'>
			<nav>
				<ul>
					<div className="quickAddButtonContainer">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button id="quickAddButton" aria-label="ação rápida">
                                    <span className="material-symbols-outlined">add</span> <span id="quickBtnText">Ação Rápida</span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Ação Rápida</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <Link to={{pathname: "/produtos", search: "?quickAdd=true"}}>
                                        <DropdownMenuItem>
                                            Novo Produto
                                            <DropdownMenuShortcut>
                                                <span className='material-symbols-rounded text-sm'>add_circle</span>
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link to={{pathname: "/usuarios", search: "?quickAdd=true"}}>
                                        <DropdownMenuItem>
                                            Novo Usuário 
                                            <DropdownMenuShortcut>
                                                <span className='material-symbols-rounded text-sm'>add_circle</span>
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link to={{pathname: "/categorias", search: "?quickAdd=true"}}>
                                        <DropdownMenuItem>
                                            Nova Categoria 
                                            <DropdownMenuShortcut>
                                                <span className='material-symbols-rounded text-sm'>add_circle</span>
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </Link>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
					</div>
					<div>
						<span className="asideButtonsTitle">Gestão</span>
						<NavLink to="/produtos">
							<li id="produtos" className="asideMenuButtons">
								<span className="material-symbols-rounded aside-icons" aria-label="Produtos">inventory_2</span>
								<span className="navNames">Produtos</span>
							</li>
						</NavLink>
						<NavLink to="/usuarios">
							<li id="usuarios" className="asideMenuButtons">
								<span className="material-symbols-rounded aside-icons" aria-label="Usuarios">group</span>
								<span className="navNames">Usuários</span>
							</li>
						</NavLink>
						<NavLink to="/categorias">
							<li id="categorias" className="asideMenuButtons">
								<span className="material-symbols-rounded aside-icons" aria-label="Categorias">category</span>
								<span className="navNames">Categorias</span>
							</li>
						</NavLink>
					</div>

					<div>
						<span className="asideButtonsTitle">Outros</span>
						<a href='#' id="logoutButton" onClick={handleLogout}>
							<li className="asideMenuButtons">
								<span className="material-symbols-rounded aside-icons" aria-label="Sair">logout</span>
								<span className="navNames">Sair</span>
							</li>
						</a>
					</div>
				</ul>
			</nav>
		</div>
	)
}
