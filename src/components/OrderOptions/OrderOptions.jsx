import styles from './OrderOptions.module.css'
import { forwardRef } from 'react';

const OrderOptions = forwardRef(({ children, onClick, isOrderOptionsVisible }, ref) => {
    return (
        <div ref={ref} id='orderOptions' onClick={onClick} className={`${styles.orderOptions} ${!isOrderOptionsVisible && 'hide'}`}>
            {children}
        </div>
    );
});

export default OrderOptions;
