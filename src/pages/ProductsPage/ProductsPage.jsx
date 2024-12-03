import { Fragment, useEffect, useRef } from "react"
import ToolBar from "../../components/ToolBar/ToolBar"
import "./ProductsPage.css"
import { useState } from "react"
import useFetchData from "../../hooks/useFetchData"
import Loader from "../../components/Loader/Loader"
import DataContainer from "../../components/DataContainer/DataContainer"
import textAbbr from "../../utils/textAbbr"
import { loadInputSugestions } from "../../utils/loadInputSugestions"
import useUserStore from "../../store/userStore"
import Toast from "../../components/Toast/Toast"
import Dialog from "../../components/Dialog/Dialog"
import { InputIcon } from "../../components/InputIcon/InputIcon"
import { SelectIcon } from "../../components/SelectIcon/SelectIcon"
import dialogStyles from "../../components/Dialog/Dialog.module.css"
import productValidations from "./functions/productValidations"
import OrderOptions from "../../components/OrderOptions/OrderOptions"
import Filters from "../../components/Filters/Filters"
import FilterBtn from "../../components/Filters/FilterBtn/FilterBtn"
import Order from "../../components/OrderOptions/Order/Order"
import orderStyles from "../../components/OrderOptions/OrderBtn/OrderBtn.module.css"
import calcAlertLength from "./functions/calcAlertLength"
import useSearchConfigsStore from "../../store/searchConfigsStore"
import orderArray from "../../utils/orderAlg"
import TooltipUI from "../../components/ToolTip/ToolTip"
import timestampToDate from "../../utils/timestampToDate"
import formatDateToInput from "./functions/formatDateToInput"
import { Pointer } from "lucide-react"
import { Timestamp } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../../firebase/config"
import { useSearchParams } from "react-router-dom"
import PaginationUI from "../../components/PaginationUI/PaginationUI"
import paginateArray from "../../utils/paginateArray"

let firstLoad = true;
const DATA_PER_PAGE = 20;

export default function ProductsPage() {
    const {user, setUser} = useUserStore();

    const [ searchParams, setSearchParams ] = useSearchParams();
    const quickAdd = searchParams.get('quickAdd');

    const toolBarRef = useRef(null);
    const filtersContainerRef = useRef(null);
    const paginationRef = useRef(null);

    const [entity, setEntity] = useState(null);
    const [categories, setCategories] = useState(null);
    const [displayEntity, setDisplayEntity] = useState(null); 
    const { searchConfings, setSearchConfigs } = useSearchConfigsStore();
    const [filterConfigs, setFilterConfigs] = useState(null);
    const [orderConfigs, setOrderConfigs] = useState(null);
    const { getData, getDataByQuery, setData, updateData, deleteData, deleteImageByDownloadURL} = useFetchData();

    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(null);
    const [message, setMessage] = useState(null);
    const [reload, setReload] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

    const inputName = useRef(null);
    const inputImage = useRef(null);
    const [imageObs, setImageObs] = useState(null);
    const spanImageObs = useRef(null);
    const selectCategory = useRef(null);
    const inputValidityDate = useRef(null);
    const inputOldPrice = useRef(null);
    const inputNewPrice = useRef(null);
    const inputRetailerId = useRef(null);
    const [isModalLoading, setModalLoading] = useState(null);
    const [modalType, setModalType] = useState(null);
    const modalFormRef = useRef(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [filterSelected, setFilterSelected] = useState(null);

    const orderOptions = useRef(null);
    const [isOrderOptionsVisible, setOrderOptionsVisible] = useState(false);

    useEffect(() => {
        setLoading(true);
        async function getProductsData(){
            try{
                const products = await getData("products");
                const retailers = await getDataByQuery("users", "userType", "==", "RETAILER");
                const productsMaped = mapProductsWithRetailers(products, retailers);
                setEntity(productsMaped);
                loadInputSugestions(products, 'name');

                const categoriesData = await getData("categories");
                setCategories(categoriesData);
                if(firstLoad) {
                    setMessage("Dados Carregados com sucesso!");
                    firstLoad = false;
                };
            } catch(e){
                console.log(e);
                if(!entity) setEntity([]);
            } finally {
                setLoading(false);
                resetFilters();
            }
        }

        getProductsData();
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

    function mapProductsWithRetailers(products, retailers){
        return products.map((product) => {
            const retailer = retailers.filter((doc) => doc.id === product.retailerId)[0];
            return { ...product, retailer, retailerId: undefined }
        })
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

        if(filteredData.length === 0){
            setDisplayEntity(null);
            return;
        }
    
        setDisplayEntity(paginateArray(filteredData, DATA_PER_PAGE));
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

    async function handleOptionsClick(e){
        const productdId = e.target.parentNode.parentNode.parentNode.parentNode.getAttribute("data-id");
        if(e.target.className.includes('editarBtn')){
            const productForEdit = entity.filter((product) => product.id === productdId)[0]
            console.log(productForEdit);
            setSelectedProduct(productForEdit);
            setModalType('formEdit');
            inputName.current.value = selectedProduct.name;
            selectedProduct.image ? setImageObs(true) : setImageObs(false);
            selectCategory.current.value = selectedProduct.category;
            inputValidityDate.current.value = formatDateToInput(timestampToDate(selectedProduct.validityDate, false));
            inputOldPrice.current.value = Number(selectedProduct.oldPrice);
            inputNewPrice.current.value = Number(selectedProduct.newPrice);
            setModalVisible(true);
        };
        if(e.target.className.includes('excluirBtn')){
            const deleteProduct = entity.filter((product) => product.id === productdId)[0]
            if(confirm(`Confirmar exclusão de: ${deleteProduct.name}`)){
                await deleteImageByDownloadURL(deleteProduct.image);
                await deleteData("products", deleteProduct.id);
                setReload((prevState) => !prevState);
                setMessage(`Produto ${deleteProduct.name} excluido com sucesso.`);
            }
        };
    }

    function handleOpenSaveModal(){
        if(modalFormRef.current){
            modalFormRef.current.reset();
        }
        setImageObs(false);

        setModalType('formSave');
        setModalVisible(true);
    }

    async function uploadImage(){
        const storageRef = ref(storage, `productsImages/${inputImage.current.files[0].name}-${Date.now()}`);
        const uploadTask = uploadBytes(storageRef, inputImage.current.files[0]);

        await uploadTask;
        const downloadUrl = await getDownloadURL(storageRef);
        return downloadUrl;
    }

    async function handleSubmitProduct(e){
        e.preventDefault();
        setSubmitLoading(true);

        try{
            if(modalType === "formEdit"){
                let url;
                if(inputImage.current && inputImage.current.files[0]){
                    await deleteImageByDownloadURL(selectedProduct.image);
                    url = await uploadImage();
                } else {
                    url = selectedProduct.image;
                }

                const updateProduct = {
                    ...selectedProduct,
                    name: inputName.current.value,
                    image: url,
                    category: selectCategory.current.value,
                    validityDate: Timestamp.fromDate(new Date(`${inputValidityDate.current.value} 00:00:00`)),
                    oldPrice: Number(inputOldPrice.current.value),
                    newPrice: Number(inputNewPrice.current.value),
                }
                updateProduct.retailerId = updateProduct.retailer.id;
                delete updateProduct.retailer; delete updateProduct.id;

                await updateData("products", selectedProduct.id, updateProduct);

            } else if(modalType == "formSave"){
                const url = await uploadImage();

                const newProduct = {
                    name: inputName.current.value,
                    image: url,
                    category: selectCategory.current.value,
                    validityDate: Timestamp.fromDate(new Date(`${inputValidityDate.current.value} 00:00:00`)),
                    oldPrice: Number(inputOldPrice.current.value),
                    newPrice: Number(inputNewPrice.current.value),
                    retailerId: inputRetailerId.current.value,
                }

                await setData("products", newProduct);
            }
        } catch(e){
            console.log(e);
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
                <FilterBtn key="Todos" id="Todos" title="Todos" selected={filterSelected == "Todos" ? true : false} filter="" filteropt="" condicao="" alertlength={calcAlertLength(entity, "", "", "")} 
                />
                {categories && categories.map((category) => (
                    <FilterBtn
                        key={category.name}
                        id={category.name}
                        title={category.name} 
                        selected={filterSelected == category.name ? true : false}
                        alertlength={calcAlertLength(entity, "category", "==", category.name)} 
                        filter={"category"} filteropt={"=="} condicao={category.name} />
                ))}
            </Filters>
            <ToolBar 
                title="Produtos" 
                btnDescription="Adicionar produto" 
                setReload={setReload} 
                orderOptionsRef={orderOptions} 
                setMessage={setMessage} 
                setOrderOptionVisible={setOrderOptionsVisible}
                setModalType={setModalType}
                setModalVisible={setModalVisible}
                handleToolBarBtnClick={handleOpenSaveModal}
                modalFormRef={modalFormRef} 
                ref={toolBarRef}/>
            {loading ? (
                <Loader />
            ) : (
                <DataContainer viewType="list" refsToCalcHeight={[toolBarRef, filtersContainerRef, paginationRef]}>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Categoria</th>
                            <th>Validade</th>
                            <th>Preço Antigo</th>
                            <th>Preço Novo</th>
                            <th>Vendedor</th>
                            <th>Localização</th>
                            <th className="alRight"><span className="thActions">Ações</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayEntity && displayEntity[currentPage - 1].map((product) => (
                            <tr key={product.id} data-id={product.id}>
                                <td>
                                    <span className="rowProductImgContainer">
                                        <img
                                            src={product.image ? product.image : "https://thumbs.dreamstime.com/b/product-icon-design-vector-illustration-digital-marketing-324810108.jpg"} 
                                            alt="foto do produto"/>
                                        {product.name}
                                    </span>
                                </td>
                                <td>{product.category}</td>
                                <td>{timestampToDate(product.validityDate)}</td>
                                <td>{product.oldPrice.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}</td>
                                <td>{product.newPrice.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}</td>
                                <td>
                                    <span className="rowUserImgContainer">
                                        <img
                                            src={product.retailer.image ? product.retailer.image : "/userIcon.png"} 
                                            alt="foto do produto"/>
                                        {product.retailer.name}
                                    </span>
                                </td>
                                <td>
                                    {textAbbr(`${product.retailer.street}, ${product.retailer.number || 's/n'} - ${product.retailer.neighborhood}, ${product.retailer.city} - ${product.retailer.state}, ${product.retailer.cep}`, 60)}
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

                        {!loading && (!entity || !displayEntity) &&
                            <p style={{marginTop: 20}}>Nenhum produto foi encontrado.</p>
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
                title={`${modalType == 'formEdit' ? 'Editar' : 'Salvar'} Produto`}
            >
                {modalType == 'formEdit' || modalType == 'formSave' ?
                    <Fragment>
                        <h1 className={`${dialogStyles.modalTitle}`}>{`${modalType == 'formEdit' ? 'Editar' : 'Salvar'} Produto`}</h1>
                        <form onSubmit={handleSubmitProduct} ref={modalFormRef}>
                            <label>
                                <span>Nome</span>
                                <InputIcon iconName='sort' type="text" ref={inputName} required/>
                            </label>
                            <label>
                                <span>Foto do produto</span>
                                {!imageObs 
                                    ? (<InputIcon iconName='image' type="file" ref={inputImage} required/>)
                                    : (
                                        <p ref={spanImageObs} style={{fontSize: 12, color: 'gray', marginTop: 5}}>
                                            Obs: Esse produto já possui uma foto, caso queira trocar, clique
                                            <span className="ml-1"
                                                style={{color: 'black', cursor: 'pointer', textDecoration: 'underline'}} 
                                                onClick={() => setImageObs(false)}
                                            >Aqui</span>
                                        </p>
                                    )
                                }
                            </label>
                            <label>
                                <span>Categoria</span>
                                <SelectIcon iconName='category' ref={selectCategory} required>
                                    {categories &&
                                        categories.map(category => (
                                            <option key={(category.id + category.name)} value={`${category.name}`}>{category.name}</option>)
                                        )
                                    }
                                </SelectIcon>
                            </label>
                            <label>
                                <span>Data de validade</span>
                                <InputIcon iconName='event' type="date" ref={inputValidityDate} required/>
                            </label>
                            <label>
                                <span>Preço antigo</span>
                                <InputIcon iconName='attach_money' type="number" ref={inputOldPrice} required/>
                            </label>
                            <label>
                                <span>Preço novo</span>
                                <InputIcon iconName='attach_money' type="number" ref={inputNewPrice} required/>
                            </label>
                            {modalType === "formSave" && 
                                <label>
                                    <span>ID vendedor</span>
                                    <InputIcon iconName='person ' type="text" ref={inputRetailerId} required/>
                                </label>
                            }
    
                            <div className={`${dialogStyles.modalFormBtnsContainer}`}>
                                <div className={`${dialogStyles.cancelarBtn}`} onClick={() => setModalVisible(false)}>Cancelar</div>
                                {!submitLoading && <button className={`${dialogStyles.salvarBtn}`}>Salvar</button>}
                                {submitLoading && 
                                    <button 
                                        className={`${dialogStyles.salvarBtn}`} 
                                        style={{backgroundColor: 'gray'}}
                                        disabled
                                    > Aguarde...</button>
                                }
                            </div>
                        </form>
                    </Fragment> : null
                }
            </Dialog>

            <OrderOptions ref={orderOptions} onClick={handleOrderByClick} isOrderOptionsVisible={isOrderOptionsVisible}>
                <Order title='Ordernar por nome' iconName='sort' orderKey='name'/>
                <Order title='Ordernar por categoria' iconName='category' orderKey='category'/>
                <Order title='Ordernar por data' iconName='event' orderKey='validityDate'/>
                <Order title='Ordernar por preço antigo' iconName='attach_money' orderKey='oldPrice'/>
                <Order title='Ordernar por preço novo' iconName='attach_money' orderKey='newPrice'/>
                <Order title='Ordernar por vendedor' iconName='person' orderKey='retailerId'/>
            </OrderOptions>
        </div>
    )
}
