import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { updateAsideVisibility } from "./hideAside";
import TooltipUI from "../ToolTip/ToolTip";
import useSearchConfigsStore from "../../store/searchConfigsStore";
import useUserStore from "../../store/userStore";
import { useRef } from "react";

export default function Header() {
    const { user } = useUserStore();
    const { setSearchConfigs } = useSearchConfigsStore();

    const searchInputRef = useRef(null);

    function handleChangeAsideView(){
        updateAsideVisibility();
    }

    function updateData(e){
        const searchTerm = e.target.value;
        setSearchConfigs({searchTerm})
    }

    return (
        <header id="mainHeader" className={styles.headerComponent}>
            <div className={styles.headerContainer}>
                <div className={styles.logoMenuAndInputContainer}>
                    <div className={styles.menuBtnContainer}>
                        <TooltipUI description="Menu">
                            <span 
                                onClick={handleChangeAsideView} 
                                className={`${styles.menuHamburguer} material-symbols-rounded`}>
                                    menu
                            </span>
                        </TooltipUI>
                    </div>
                    <div className={styles.logoContainer}>
                        <img
                            src="/logo.png"
                            alt="Logo"
                        />
                        <h1>ADM</h1>
                    </div>
                    <div className={styles.headerInputContainerForIcons}>
                        <input
                            id="searchInput"
                            onChange={(e) => updateData(e)}
                            className={styles.searchInput}
                            type="text"
                            icon="search"
                            right-icon="tune"
                            placeholder="Procure por uma Linha"
                            ref={searchInputRef}/>
                        <span className={`${styles.inputIcons} material-symbols-rounded`}>search</span>
                        <TooltipUI description="Apagar">
                            <span className={`${styles.searchConfigsBtn} material-symbols-rounded`} onClick={() => {
                                searchInputRef.current.value = "";
                                updateData({target: {value: ""}});
                            }}>close</span>
                        </TooltipUI>
                    </div>
                </div>
                <div className={styles.userContainer}>
                    <p style={{fontSize: 14}}>{user ? user.name : 'user name'}</p>
                        <img
                            className={`${styles.userPhoto} ${styles.iconUser}`}
                            src="/userIcon.png"
                            alt="foto do usuário"
                        />
                </div>
            </div>
        </header>
    );
}