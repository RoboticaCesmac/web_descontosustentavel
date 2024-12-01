import { forwardRef } from "react"
import { Input } from "@/components/ui/input"
import "./InputIcon.css"

const InputIcon = forwardRef(({ className, type, iconName, ...props }, ref) => {
    return (
        <div className="inputContainerForIcons">
            <span className="material-symbols-rounded">{iconName}</span>
            <Input
                type={type}
                className={className}
                ref={ref}
                {...props} />
        </div>
    )
})

InputIcon.displayName = "InputIcon";

export { InputIcon };
