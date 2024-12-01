import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function TooltipUI({children, description}) {
  return (
    <TooltipProvider delayDuration={150}>
        <Tooltip>
            <TooltipTrigger>
                {children}
            </TooltipTrigger>
            <TooltipContent>
                <p>{description}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}
