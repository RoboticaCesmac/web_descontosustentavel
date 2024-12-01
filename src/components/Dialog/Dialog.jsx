import styles from './Dialog.module.css'
import PageLoader from '../PageLoader/PageLoader';

export default function Dialog(props) {
    const { children, isModalVisible, setModalVisible, isModalLoading, modalStyle } = props;

    return (
        <div className={`${styles.modalContainer} ${!isModalVisible && 'hide'}`}>
            <div style={modalStyle && modalStyle} className={`${styles.modal}`}>
                <div className={`${styles.closeModalBtnContainer}`}>
                    <span onClick={() => setModalVisible(false)} className={`${styles.closeModalBtn} material-symbols-rounded`}>close</span>
                </div>
                {isModalLoading && <PageLoader />}
                <div className={`${styles.modalContent} ${isModalLoading && 'hide'}`}>

                    { children }

                </div>
            </div>
        </div>
    )
}
