import styles from './Loader.module.css'

export default function Loader(props) {
    const { className } = props

    return (
        <div className={`${styles.loader} ${className && className}`}></div>
    )
}
