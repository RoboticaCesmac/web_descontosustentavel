import { forwardRef, useRef } from 'react';
import TooltipUI from '../ToolTip/ToolTip'
import './ToolBar.css'

const ToolBar = forwardRef((props, ref) => {
    const { 
        title, 
        btnDescription, 
        setReload, 
        setMessage, 
        orderOptionsRef, 
        setOrderOptionVisible, 
        setModalType,
        setModalVisible,
        modalFormRef,
        handleToolBarBtnClick
    } = props;
    const orderBtn = useRef(null);

    function reloadData(){
        setReload((prevState) => !prevState);
        setMessage("Dados atualizados com sucesso.");
    }

    function handleOrderByClick(){
        const { top, left } = orderBtn.current.getBoundingClientRect();
        orderOptionsRef.current.style.top = top + 48 + 'px';
        orderOptionsRef.current.style.left = left - 225 + 'px';
        setOrderOptionVisible((prevState) => !prevState);
    }

    function handleOpenSaveModal(e){
        e.preventDefault();
        if(modalFormRef.current){
            modalFormRef.current.reset();
        }

        setModalType('formSave');
        setModalVisible(true);
    }

    function handleCustomToolBarBtnClick(e){
        e.preventDefault();
        
        handleToolBarBtnClick();
    }

    return (
        <div id='toolBar' ref={ref}>
            <h1>{title}</h1>
            <div id="toolsContainer">
                {btnDescription && <button id="addBtn" onClick={handleToolBarBtnClick ? handleCustomToolBarBtnClick : handleOpenSaveModal}>{btnDescription}</button>}
                <TooltipUI description="Ordenar">
                    <span id="ordenarBtn" ref={orderBtn} onClick={handleOrderByClick} className="material-symbols-rounded actionsBtns">
                        swap_vert
                    </span>
                </TooltipUI>
                <TooltipUI description="Atualizar">
                    <span 
                        id="syncBtn" 
                        className="material-symbols-rounded actionsBtns" 
                        onClick={reloadData}
                    >refresh</span>
                </TooltipUI>
            </div>
        </div>
    )
});

export default ToolBar;
