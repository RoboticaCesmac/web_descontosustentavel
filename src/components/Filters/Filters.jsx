import { forwardRef } from 'react'
import styles from './Filters.module.css'

const Filters = forwardRef(({children, onClick}, ref) => {
    return (
        <div onClick={onClick} className={`${styles.filtersContainer}`} ref={ref}>
            {children}
        </div>
    )
})

export default Filters;
