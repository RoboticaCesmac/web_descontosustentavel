import styles from './OrderBtn.module.css';

export default function OrderBtn({title, iconName, orderType, orderKey}) {
    return (
        <span className={`${styles.orderBtn}`} order-type={orderType} order-key={orderKey}>
            <span className="material-symbols-rounded">{iconName}</span>
            <span>{title}</span>
            <span className="material-symbols-rounded">{orderType == 'desc' ? 'arrow_downward_alt' : 'arrow_upward_alt'}</span>
        </span>
    )
}
