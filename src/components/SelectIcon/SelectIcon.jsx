import { forwardRef } from "react"
import styles from "./SelectIcon.module.css";
import { Select } from "../Select/Select"

const SelectIcon = forwardRef(({ className, iconName, ...props }, ref) => {
    return (
        <div className={`${styles.selectContainerForIcons}`}>
            <span className="material-symbols-rounded">{iconName}</span>
            <Select
                className={className}
                ref={ref}
                {...props} />
        </div>
    )
})

SelectIcon.displayName = "SelectIcon";

export { SelectIcon };
