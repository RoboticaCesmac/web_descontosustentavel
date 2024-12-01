import { forwardRef, useEffect, useState } from 'react';
import styles from './Toggle.module.css';


const Toggle = forwardRef((props, ref) => {
    const { dataId, isActive, handleToggleFunction } = props;
    const [ disabled, setDisabled ] = useState(false);
    const [ active, setActive ] = useState(isActive);

    useEffect(() => {
        setActive(isActive);
    }, [isActive])

    async function handleUpdateState(){
        if(disabled) return;

        setActive((prev) => !prev);
        setDisabled(true);

        if(handleToggleFunction){
            await handleToggleFunction();
        }
        setDisabled(false);
    }

    return (
        <div 
            className={`${styles.toggle} ${active && styles.active} ${disabled && styles.disabled}`} 
            data-id={dataId}
            onClick={handleUpdateState}
            value={active}
            ref={ref}/>
    )
})

export default Toggle;
