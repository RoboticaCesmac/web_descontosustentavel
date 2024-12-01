import styles from './PageLoader.module.css'

export default function PageLoader({size}) {
    return <div style={{width: size, height: size}} className={`${styles.pageLoader} border-t-slate-900`}></div>
}
