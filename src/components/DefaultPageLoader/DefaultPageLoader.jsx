import PageLoader from '../PageLoader/PageLoader'
import styles from './DefaultPageLoader.module.css'

export default function DefaultPageLoader() {
    return (
        <div className={`${styles.defaultPageLoaderContainer}`}>
            <PageLoader />
        </div>
    )
}
