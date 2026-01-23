import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="p-3 max-w-xs mx-auto sm:mx-0 sm:max-w-sm">
            <div className="flex items-center space-x-2.5">
              {/* Smaller Dynamic Icon */}
              <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-md",
                props.variant === "destructive" 
                  ? "bg-gradient-to-r from-red-500 to-red-600" 
                  : "bg-gradient-to-r from-green-500 to-emerald-500"
              )}>
                {props.variant === "destructive" ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              
              {/* Compact Content */}
              <div className="flex-1 min-w-0">
                {title && (
                  <ToastTitle className="text-sm font-semibold leading-tight">
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className="text-xs opacity-85 leading-snug mt-0.5">
                    {description}
                  </ToastDescription>
                )}
              </div>
              
              {/* Smaller Close Button */}
              <ToastClose className="flex-shrink-0 w-6 h-6" />
            </div>
            {action}
          </Toast>
        )
      })}
      <ToastViewport className="fixed top-4 left-4 right-4 z-[100] flex max-h-screen w-auto flex-col gap-1.5 sm:top-auto sm:bottom-4 sm:right-4 sm:left-auto sm:max-w-[320px]" />
    </ToastProvider>
  )
}
