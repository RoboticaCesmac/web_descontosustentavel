import { Fragment, useEffect, useRef } from "react"
import ToolBar from "../../components/ToolBar/ToolBar"
import "./CategoriesPage.css"
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
import orderArray from "../../utils/orderAlg"
import TooltipUI from "../../components/ToolTip/ToolTip"
import { useSearchParams } from "react-router-dom"
import PaginationUI from "../../components/PaginationUI/PaginationUI"
import paginateArray from "../../utils/paginateArray"

let firstLoad = true;
const DATA_PER_PAGE = 20;

export default function CategoriesPage() {
    const {user, setUser} = useUserStore();
    const [ searchParams, setSearchParams ] = useSearchParams();
    const quickAdd = searchParams.get('quickAdd');

    const toolBarRef = useRef(null);
    const filtersContainerRef = useRef(null);
    const paginationRef = useRef(null);

    const [entity, setEntity] = useState(null); 
    const [displayEntity, setDisplayEntity] = useState(null); 
    const { searchConfings, setSearchConfigs } = useSearchConfigsStore();
    const [filterConfigs, setFilterConfigs] = useState(null);
    const [orderConfigs, setOrderConfigs] = useState(null);
    const { getData, getDataById, getDataByQuery, setData, updateData, deleteData } = useFetchData();

    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(null);
    const [message, setMessage] = useState(null);
    const [reload, setReload] = useState(false);
    
    const inputCategoryName = useRef(null);
    
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalLoading, setModalLoading] = useState(null);
    const [modalType, setModalType] = useState('formSave');
    const modalFormRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const orderOptions = useRef(null);
    const [isOrderOptionsVisible, setOrderOptionsVisible] = useState(false);

    useEffect(() => {
        async function loadData(){
            setLoading(true);
            try{
                const categories = await getData("categories");
                setEntity(categories);
                loadInputSugestions(categories, 'name');
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
            setModalVisible(true);
            setSearchParams("");
        }
    }, [searchParams])

    function resetFilters(){
        document.querySelector("#searchInput").value = "";
        const orderSelected = document.querySelector(`.${orderStyles.selected}`);
        if(orderSelected) orderSelected.className = orderStyles.orderBtn;
        setSearchConfigs(null); setOrderConfigs(null);
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
    
        // 3. Ordenação
        if(orderConfigs){
            filteredData = orderArray(filteredData, orderConfigs.orderField, orderConfigs.orderDirection);
        }
    
        if(filteredData.length === 0){
            setDisplayEntity(null);
            return;
        }
    
        setDisplayEntity(paginateArray(filteredData, DATA_PER_PAGE));
    }, [entity, searchConfings, filterConfigs, orderConfigs]);

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

    async function handleOptionsClick(e){
        const categoryId = e.target.parentNode.parentNode.parentNode.parentNode.getAttribute("data-id");
        if(e.target.className.includes('editarBtn')){
            setModalType('formEdit');
            setModalVisible(true);
            const categoryForEdit = entity.filter((category) => category.id === categoryId)[0]
            setSelectedCategory(categoryForEdit);
            inputCategoryName.current.value = categoryForEdit.name;
        };
        if(e.target.className.includes('excluirBtn')){
            const deleteCategory = entity.filter((category) => category.id === categoryId)[0]
            if(confirm(`Confirmar exclusão de: ${deleteCategory.name}`)){
                try{                
                    const relatedProducts = await getDataByQuery("products", "category", "==", deleteCategory.name);
                    if(relatedProducts.length > 0){
                        alert("Erro ao excluir a categorias, existem produtos relacionados a ela!");
                        return;
                    }   
                } catch (e){
                    console.log(e);
                    return;
                }
                
                await deleteData("categories", deleteCategory.id);
                setReload((prevState) => !prevState);
                setMessage(`Categoria ${deleteCategory.name} excluido com sucesso.`);
            }
        };
    }

    async function handleSubmitEntity(e){
        e.preventDefault();
        const formData = new FormData(e.target);

        const newCategory = {
            name: inputCategoryName.current.value,
        }
        console.log(newCategory);
        
        try{
            // usersValidations(user);

            if(modalType === 'formEdit'){
                await updateData("categories", selectedCategory.id, newCategory);
                setMessage("Documento atualizado!");
            } else if(modalType === 'formSave'){
                await setData("categories", newCategory);
                setMessage("Documento adicionado!");
            }
            setModalVisible(false);
            setReload((prevState) => !prevState);
            e.target.reset();
        } catch(e){
            console.log(e);
            setModalVisible(false);
            setMessage("Error ao atualizar o documento");
            e.target.reset();
        }
    }

    if(!entity) return;
    return (
        <div id="mainContentContainer">
            <ToolBar 
                title="Categorias"
                btnDescription="Nova categoria"
                setReload={setReload}
                orderOptionsRef={orderOptions}
                setMessage={setMessage}
                setOrderOptionVisible={setOrderOptionsVisible}
                setModalType={setModalType}
                setModalVisible={setModalVisible}
                modalFormRef={modalFormRef}
                ref={toolBarRef}
            />
            {loading ? (
                <Loader />
            ) : (
                <DataContainer viewType="list" refsToCalcHeight={[toolBarRef, filtersContainerRef, paginationRef]}>
                    <thead>
                        <tr>
                            <th>Nome da categoria</th>
                            <th className="alRight"><span className="thActions">Ações</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayEntity && displayEntity[currentPage - 1].map((category) => (
                            <tr key={category.id} data-id={category.id}>
                                <td>{category.name}</td>
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

                        {!loading && (!entity || !displayEntity) &&
                            <p style={{marginTop: 20}}>Nenhuma categoria foi encontrada.</p>
                        }
                    </tbody>
                </DataContainer>
            )}

            {!loading && 
                <PaginationUI 
                    ref={paginationRef}
                    setCurrentPage={setCurrentPage} 
                    currentPage={currentPage}
                    entityArray={displayEntity}/>
            }


            {message && <Toast setMessage={setMessage}>{message}</Toast>}

            <Dialog 
                isModalVisible={isModalVisible}
                isModalLoading={isModalLoading}
                setModalVisible={setModalVisible}
                title={`${modalType == 'formEdit' ? 'Editar' : 'Salvar'} Contrato`}
            >
                {modalType.includes('form') &&
                    <Fragment>
                        <h1 className={`${dialogStyles.modalTitle}`}>{`${modalType == 'formEdit' ? 'Editar' : 'Salvar'} Categoria`}</h1>
                        <form onSubmit={handleSubmitEntity} ref={modalFormRef}>
                            <label>
                                <span>Nome:</span>
                                <InputIcon iconName='description' type="text" ref={inputCategoryName} required={true} placeholder='Nome...'/>
                            </label>
    
                            <div className={`${dialogStyles.modalFormBtnsContainer}`}>
                                <div className={`${dialogStyles.cancelarBtn}`} onClick={() => setModalVisible(false)}>Cancelar</div>
                                <button className={`${dialogStyles.salvarBtn}`}>Salvar</button>
                            </div>
                        </form>
                    </Fragment>
                }
            </Dialog>

            <OrderOptions ref={orderOptions} onClick={handleOrderByClick} isOrderOptionsVisible={isOrderOptionsVisible}>
                <Order title='Ordernar por nome' iconName='sort' orderKey='name'/>
            </OrderOptions>
        </div>
    )
}
