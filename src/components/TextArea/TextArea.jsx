import { forwardRef } from "react"
import { cn } from "@/lib/utils"

const TextArea = forwardRef(({ children, className, ...props }, ref) => {
    return ((
        <textarea
            className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent border-neutral-300 px-3 py-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}/>
    ));
})

export default TextArea