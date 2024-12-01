import { useEffect, useState } from 'react';
import styles from './Toast.module.css';

export default function Toast({ children, setMessage }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsVisible(false);
            setMessage(null);
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, []);

    if (!isVisible) return null;

    return (
        <div className={styles.toast}>
            <span>{children}</span>
            <div className={styles.actionsResultMessageContainer}>
                {/* <span className={styles.undoActionBtn}>Desfazer</span> */}
                <span
                    className={`${styles.closeMessageBtn} material-symbols-rounded`}
                    onClick={() => setIsVisible(false)}
                >
                    close
                </span>
            </div>
        </div>
    );
}
