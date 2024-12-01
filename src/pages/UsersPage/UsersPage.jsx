import { Fragment, useEffect, useRef } from "react"
import ToolBar from "../../components/ToolBar/ToolBar"
import "./UsersPage.css"
import { useState } from "react"
import useFetchData from "../../hooks/useFetchData"
import Loader from "../../components/Loader/Loader"
import DataContainer from "../../components/DataContainer/DataContainer"
import { loadInputSugestions } from "../../utils/loadInputSugestions"
import useUserStore from "../../store/userStore"
import Toast from "../../components/Toast/Toast"
import Dialog from "../../components/Dialog/Dialog"
import { InputIcon } from "../../components/InputIcon/InputIcon"
import dialogStyles from "../../components/Dialog/Dialog.module.css"
import OrderOptions from "../../components/OrderOptions/OrderOptions"
import Order from "../../components/OrderOptions/Order/Order"
import orderStyles from "../../components/OrderOptions/OrderBtn/OrderBtn.module.css"
import useSearchConfigsStore from "../../store/searchConfigsStore"
import textAbbr from "../../utils/textAbbr"
import Toggle from "../../components/Toggle/Toggle"
import { SelectIcon } from "../../components/SelectIcon/SelectIcon"
import orderArray from "../../utils/orderAlg"
import Filters from "../../components/Filters/Filters"
import FilterBtn from "../../components/Filters/FilterBtn/FilterBtn"
import calcAlertLength from "../ProductsPage/functions/calcAlertLength"
import TooltipUI from "../../components/ToolTip/ToolTip"
import { states } from "../../db/mockedDb"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../../firebase/config"
import validateUser from "./functions/usersValidations"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useSearchParams } from "react-router-dom"

let firstLoad = true;

export default function UsersPage() {
    const {user, setUser} = useUserStore();

    const [ searchParams, setSearchParams ] = useSearchParams();
    const quickAdd = searchParams.get('quickAdd');

    const toolBarRef = useRef(null);
    const filtersContainerRef = useRef(null);

    const [entity, setEntity] = useState(null); 
    const [displayEntity, setDisplayEntity] = useState(null); 
    const { searchConfings, setSearchConfigs } = useSearchConfigsStore();
    const [filterConfigs, setFilterConfigs] = useState(null);
    const [orderConfigs, setOrderConfigs] = useState(null);
    const { getData, getDataById, getDataByQuery, setData, updateData, deleteData, deleteDataInBatchWithQuery, deleteImageByDownloadURL } = useFetchData();

    const [loading, setLoading] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(null);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [message, setMessage] = useState(null);
    const [reload, setReload] = useState(false);
        
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [imageObs, setImageObs] = useState(null);
    const spanImageObs = useRef(null);
    const [email, setEmail] = useState('');
    const [userType, setUserType] = useState('');
    const [cep, setCEP] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [establishmentName, setEstablishmentName] = useState('');

    
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalLoading, setModalLoading] = useState(null);
    const [modalType, setModalType] = useState('formSave');
    const modalFormRef = useRef(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const [filterSelected, setFilterSelected] = useState(null);
    const orderOptions = useRef(null);
    const [isOrderOptionsVisible, setOrderOptionsVisible] = useState(false);

    useEffect(() => {
        async function loadData(){
            setLoading(true);
            try{
                const users = await getData("users");
                setEntity(users);
                loadInputSugestions(users, 'name');
                if(firstLoad) {
                    setMessage("Dados Carregados com sucesso!");
                    firstLoad = false;
                };
            } catch (e){
                console.log(e);
                if(!entity) setEntity([]);
            } finally{
                setLoading(false);
                resetFilters();
            }
        }
        loadData()
    }, [reload])

    useEffect(() => {
        // QuickAdd
        if(quickAdd){
            handleOpenSaveModal();
            setSearchParams("");
        }
    }, [searchParams])
    
    function resetFilters(){
        document.querySelector("#searchInput").value = "";
        const orderSelected = document.querySelector(`.${orderStyles.selected}`);
        if(orderSelected) orderSelected.className = orderStyles.orderBtn;
        setFilterSelected("Todos");
        setSearchConfigs(null); setOrderConfigs(null); setFilterConfigs(null);
    }

    useEffect(() => {
        if(!entity) return;
        let filteredData = [...entity];
    
        // 1. Busca
        if (searchConfings) {
          filteredData = filteredData.filter(item =>
            item['name'].toLowerCase().includes(searchConfings.searchTerm.toLowerCase())
          );
        }

        // 2. Filtro
        if (filterConfigs) {
            filteredData = filteredData.filter(item => item[filterConfigs.filter] === filterConfigs.condicao);
        }
    
        // 3. Ordenação
        if(orderConfigs){
            filteredData = orderArray(filteredData, orderConfigs.orderField, orderConfigs.orderDirection);
        }
    
        setDisplayEntity(filteredData);
    }, [entity, searchConfings, filterConfigs, orderConfigs]);

    async function handleFilterClick({target}) {
        if(target.className.includes('selected')) return;
        if(!target.className.includes('filtersContainer') && target.className.includes('filter')){
            setFilterSelected(target.id);
            const filter = target.getAttribute('filter');
            const filteropt = target.getAttribute('filteropt');
            const condicao = target.getAttribute('condicao');
            if(!filter) {
                setFilterConfigs(null);
                return;
            };
            setFilterConfigs({filter, filteropt, condicao});
        }
    }

    async function handleOrderByClick(e){
        setOrderOptionsVisible(false);
        if(e.target.className.includes("selected")) return;

        if(e.target.className.includes('orderBtn')){
            const alreadySelected = document.querySelector(`.${orderStyles.selected}`);
            if(alreadySelected) alreadySelected.className = `${orderStyles.orderBtn}`;
            e.target.className = `${orderStyles.orderBtn} ${orderStyles.selected}`;

            const orderField = e.target.getAttribute('order-key');
            const orderDirection = e.target.getAttribute('order-type');
            setOrderConfigs({orderField, orderDirection});
        }
    }

    function clearFields(){
        setCEP("");
        setName("");
        setImage("");
        setEmail("");
        setState("");
        setCity("");
        setNeighborhood("");
        setStreet("");
        setNumber("");
        setComplement("");
        setEstablishmentName("");
        setImageObs(null);
    }

    async function handleOptionsClick(e){
        clearFields();

        const userId = e.target.closest("[data-id]").getAttribute("data-id");
        console.log(e.target, userId);
        if(e.target.className.includes('editarBtn')){
            const userForEdit = entity.filter((user) => user.id === userId)[0];
            setSelectedUser(userForEdit);
            
            setCEP(userForEdit.cep || "");
            setName(userForEdit.name || "");
            setState(userForEdit.state || "");
            setCity(userForEdit.city || "");
            setNeighborhood(userForEdit.neighborhood || "");
            setStreet(userForEdit.street || "");
            setNumber(userForEdit.number || "");
            setComplement(userForEdit.complement || "");
            setEstablishmentName(userForEdit.establishmentName || "");
            setImageObs(Boolean(userForEdit.image));
    
            setModalType("formEdit");
            setModalVisible(true);
        };
        if(e.target.className.includes('excluirBtn')){
            const deleteUser = entity.filter((user) => user.id === userId)[0]
            const alert = `ALERTA!!! Ao excluir: ${deleteUser.name}, todos os produtos vinculados a ele também serão excluidos, deseja continuar? (A operação pode demorar um pouco, por favor não feche a página.)`;

            if(confirm(`${deleteUser.userType === "RETAILER" ? alert : `Confirma exclusão de ${deleteUser.name}?`}`)){
                setLoading(true);
                if(deleteUser.userType === "RETAILER" ) await deleteDataInBatchWithQuery("products", "retailerId", "==", deleteUser.id);
                await deleteImageByDownloadURL(deleteUser.image);
                await deleteData("users", deleteUser.id);
                setReload((prevState) => !prevState);
                setMessage(`Usuário ${deleteUser.name} excluido com sucesso.`);
            }
        };
    }

    function handleOpenSaveModal(){
        if(modalFormRef.current){
            clearFields();
        }
        setImageObs(false);
        setUserType("CLIENT");

        setModalType('formSave');
        setModalVisible(true);
    }

    async function uploadImage(){
        if(!image) return '';

        const storageRef = ref(storage, `profilePhotos/${selectedUser.id}`);
        const uploadTask = uploadBytes(storageRef, image);

        await uploadTask;
        const downloadUrl = await getDownloadURL(storageRef);
        return downloadUrl;
    }

    async function handleSubmitEntity(e){
        e.preventDefault();
        setSubmitLoading(true);

        let userForValidate = { name };
        try{
            userForValidate = (modalType === "formEdit" && selectedUser.userType === "RETAILER") 
            ? { ...userForValidate, cep, state, city, neighborhood, street, number, complement, establishmentName} 
            : userForValidate;

            userForValidate = modalType === "formSave" 
            ? { ...userForValidate, email, userType} 
            : userForValidate; 

            userForValidate = (modalType === "formSave" && userType === "RETAILER") 
            ? { ...userForValidate, cep, state, city, neighborhood, street, number, complement, establishmentName} 
            : userForValidate; 

            console.log(userForValidate);
            validateUser(userForValidate);
        } catch (e){
            console.log(e);
            setError(e.message);
            setDialogOpen(true);
            setSubmitLoading(false);
            return;
        }

        try{
            if(modalType === "formEdit"){
                let url;
                if(image){
                    await deleteImageByDownloadURL(selectedUser.image);
                    url = await uploadImage();
                } else {
                    url = selectedUser.image;
                }

                const updateUser = {...selectedUser, ...userForValidate, image: url};
                await updateData("users", selectedUser.id, updateUser);

            } else if(modalType == "formSave"){
                const url = await uploadImage();
                const newUser = {...userForValidate, image: url};

                const alreadyExistEmail = await getDataByQuery("users", "email", "==", newUser.email);
                if(alreadyExistEmail.length > 0) throw new Error("Erro, já existe alguém com esse e-mail.");

                await setData("users", newUser);
            }
        } catch(e){
            console.log(e);
            setError(e.message);
            setDialogOpen(true);
        } finally{
            setModalVisible(false);
            setReload((prevState) => !prevState);
            e.target.reset();
            setSubmitLoading(false);
        }
    }

    if(!entity) return;
    return (
        <div id="mainContentContainer">
            <Filters onClick={handleFilterClick} ref={filtersContainerRef}>
                {[
                    {title: 'Todos', filter: '',  filteropt: '', condicao: ''},
                    {title: 'Cliente', filter: 'userType', filteropt: '==', condicao: 'CLIENT'},
                    {title: 'Vendedor', filter: 'userType', filteropt: '==', condicao: 'RETAILER'},
                ].map((btn) => (
                    <FilterBtn
                        key={btn.title}
                        id={btn.title}
                        title={btn.title} 
                        selected={filterSelected == btn.title ? true : false}
                        alertlength={calcAlertLength(entity, btn.filter, btn.filteropt, btn.condicao)} 
                        filter={btn.filter} filteropt={btn.filteropt} condicao={btn.condicao} />
                ))}
            </Filters>

            <ToolBar 
                title="Usuários"
                btnDescription="Novo usuário"
                setReload={setReload}
                orderOptionsRef={orderOptions}
                setMessage={setMessage}
                setOrderOptionVisible={setOrderOptionsVisible}
                setModalType={setModalType}
                setModalVisible={setModalVisible}
                handleToolBarBtnClick={handleOpenSaveModal}
                modalFormRef={modalFormRef}
                ref={toolBarRef}
            />
            {loading ? (
                <Loader />
            ) : (
                <DataContainer viewType="list" refsToCalcHeight={[toolBarRef, filtersContainerRef]}>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Função</th>
                            <th>Nome estabalecimento</th>
                            <th>Localização</th>
                            <th className="alRight"><span className="thActions">Ações</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayEntity && displayEntity.map((userDoc) => (
                            <tr key={userDoc.id} data-id={userDoc.id}>
                                <td>
                                    <span className="rowUserImgContainer">
                                        <img style={{width: 30}}
                                            src={userDoc.image ? userDoc.image : "/userIcon.png"} 
                                            alt="foto do usuário"/>
                                        {userDoc.name}
                                    </span>
                                </td>
                                <td>{userDoc.email}</td>
                                <td>{userDoc.userType === "CLIENT" ? "CLIENTE" : "VENDEDOR"}</td>
                                <td>
                                    {userDoc.userType === "RETAILER" && userDoc.establishmentName}
                                </td>
                                <td>
                                    {userDoc.userType === "RETAILER" && 
                                        textAbbr(`${userDoc.street}, ${userDoc.number || 's/n'} - ${userDoc.neighborhood}, ${userDoc.city} - ${userDoc.state}, ${userDoc.cep}`, 60)
                                    }
                                </td>
                                <td className="alCenter">
                                    <div className="optionsContainer" onClick={handleOptionsClick}>
                                        <TooltipUI description="Editar">
                                            <span className="material-symbols-rounded editarBtn">edit</span>
                                        </TooltipUI>
                                        <TooltipUI description="Excluir">
                                            <span className="material-symbols-rounded excluirBtn">delete</span>
                                        </TooltipUI>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {!loading && entity.length === 0 &&
                            <p style={{marginTop: 20}}>Nenhum usuário foi encontrado.</p>
                        }
                    </tbody>
                </DataContainer>
            )}

            {message && <Toast setMessage={setMessage}>{message}</Toast>}

            <Dialog 
                isModalVisible={isModalVisible}
                isModalLoading={isModalLoading}
                setModalVisible={setModalVisible}
                title={`${modalType == 'formEdit' ? 'Editar' : 'Salvar'} Contrato`}
            >
                {modalType.includes('form') &&
                    <Fragment>
                        <h1 className={`${dialogStyles.modalTitle}`}>{`${modalType == 'formEdit' ? 'Editar' : 'Salvar'} Usuário`}</h1>
                        <form onSubmit={handleSubmitEntity} ref={modalFormRef}>
                            <label>
                                <span>Nome</span>
                                <InputIcon 
                                    iconName='person' 
                                    type="text" 
                                    required
                                    placeholder='Nome...'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}/>
                            </label>
                            <label>
                                <span>Foto de perfil (opc)</span>
                                {!imageObs
                                    ? (
                                        <InputIcon 
                                            iconName='image' 
                                            type="file" 
                                            onChange={(e) => setImage(e.target.files[0])}/>
                                    )
                                    : (
                                        <p ref={spanImageObs} style={{fontSize: 12, color: 'gray', marginTop: 5}}>
                                            Obs: Esse usuário já possui uma foto, caso queira trocar, clique
                                            <span className="ml-1"
                                                style={{color: 'black', cursor: 'pointer', textDecoration: 'underline'}}
                                                onClick={() => setImageObs(false)}
                                            >Aqui</span>
                                        </p>
                                    )
                                }
                            </label>
                            {modalType === "formSave" && 
                                <Fragment>
                                    <label>
                                        <span>Email</span>
                                        <InputIcon 
                                            iconName='email'
                                            type="email"
                                            required
                                            placeholder='Email...'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}/>
                                    </label>
                                    <label>
                                        <span>Função</span>
                                        <SelectIcon 
                                            iconName='id_card' 
                                            required
                                            onChange={(e) => setUserType(e.target.value)}>
                                                <option value="CLIENT">Cliente</option>
                                                <option value="RETAILER">Vendedor</option>
                                        </SelectIcon>
                                    </label>
                                </Fragment>
                            }
                            {((modalType === "formSave" && userType === "RETAILER" ) || (modalType === "formEdit" && selectedUser.userType === "RETAILER")) && 
                                <Fragment>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        <label>
                                            <span>CEP</span>
                                            <InputIcon 
                                                iconName='map_search' 
                                                type="text" 
                                                value={cep} 
                                                onChange={(e) => setCEP(e.target.value)} 
                                                required={true}
                                                placeholder='CEP...' 
                                            />
                                        </label>
                                        <label>
                                            <span>Estado</span>
                                            <SelectIcon 
                                                iconName='explore' 
                                                value={state} 
                                                onChange={(e) => setState(e.target.value)} 
                                                required={true}>
                                                {states.map((state) => (
                                                    <option value={state.value} key={state.value}>
                                                        {state.label}
                                                    </option>
                                                ))}
                                            </SelectIcon>
                                        </label>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        <label>
                                            <span>Cidade</span>
                                            <InputIcon 
                                                iconName='location_city' 
                                                type="text" 
                                                value={city} 
                                                onChange={(e) => setCity(e.target.value)} 
                                                required={true} 
                                                placeholder='Cidade...' 
                                            />
                                        </label>
                                        <label>
                                            <span>Bairro</span>
                                            <InputIcon 
                                                iconName='near_me' 
                                                type="text" 
                                                value={neighborhood} 
                                                onChange={(e) => setNeighborhood(e.target.value)} 
                                                required={true} 
                                                placeholder='Bairro...' 
                                            />
                                        </label>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        <label>
                                            <span>Rua</span>
                                            <InputIcon 
                                                iconName='road' 
                                                type="text" 
                                                value={street} 
                                                onChange={(e) => setStreet(e.target.value)} 
                                                required={true} 
                                                placeholder='Rua...' 
                                            />
                                        </label>
                                        <label>
                                            <span>Número</span>
                                            <InputIcon 
                                                iconName='pin' 
                                                type="text" 
                                                value={number} 
                                                onChange={(e) => setNumber(e.target.value)} 
                                                required={true} 
                                                placeholder='Número...' 
                                            />
                                        </label>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        <label>
                                            <span>Nome estabelecimento (opc)</span>
                                            <InputIcon 
                                                iconName='store' 
                                                type="text" 
                                                value={establishmentName} 
                                                onChange={(e) => setEstablishmentName(e.target.value)} 
                                                placeholder='Estabelecimento...' 
                                            />
                                        </label>
                                        <label>
                                            <span>Complemento (opc)</span>
                                            <InputIcon 
                                                iconName='home_pin' 
                                                type="text" 
                                                value={complement} 
                                                onChange={(e) => setComplement(e.target.value)} 
                                                placeholder='Complemento...' 
                                            />
                                        </label>
                                    </div>
                                </Fragment>
                            }
    
                            <div className={`${dialogStyles.modalFormBtnsContainer}`}>
                                <div className={`${dialogStyles.cancelarBtn}`} onClick={() => setModalVisible(false)}>Cancelar</div>
                                {!submitLoading && <button className={`${dialogStyles.salvarBtn}`}>Salvar</button>}
                                {submitLoading && 
                                    <button 
                                        className={`${dialogStyles.salvarBtn}`} 
                                        style={{backgroundColor: 'gray'}} 
                                        disabled>
                                            Aguarde...
                                    </button>
                                }
                            </div>
                        </form>
                    </Fragment>
                }
            </Dialog>

            <OrderOptions ref={orderOptions} onClick={handleOrderByClick} isOrderOptionsVisible={isOrderOptionsVisible}>
                <Order title='Ordernar por nome' iconName='sort' orderKey='name'/>
                <Order title='Ordernar por email' iconName='sort' orderKey='email'/>
                <Order title='Ordernar por função' iconName='id_card' orderKey='userType'/>
                <Order title='Ordernar por nome estabelecimento' iconName='store' orderKey='establishmentName'/>
                <Order title='Ordernar por estado' iconName='explore' orderKey='state'/>
                <Order title='Ordernar por cidade' iconName='location_city' orderKey='city'/>
                <Order title='Ordernar por bairro' iconName='near_me' orderKey='neighborhood'/>
            </OrderOptions>

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