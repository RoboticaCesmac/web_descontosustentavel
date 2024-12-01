import styles from './FilterBtn.module.css'

export default function FilterBtn({id, title, alertlength, selected, filter, condicao, filteropt}) {
    return (
        <div 
            id={id}
            className={`${styles.filter} ${selected && styles.selected}`} 
            filter={filter}
            condicao={condicao}
            filteropt={filteropt}
        >
            <span>{title}</span>
            <span className={`${styles.filterAlert}`}>{alertlength}</span>
        </div>
    )
}
