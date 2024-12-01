import styles from './OrderGroup.module.css'

export default function OrderGroup({children}) {
    return (
        <div className={`${styles.orderDescriptionsContainer}`}>
            {children}
        </div>
    )
}
