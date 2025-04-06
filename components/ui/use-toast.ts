import type { Toast, ToastActionElement } from "@/components/ui/use-toast";
import {
  useToast as useToastBase,
  type ToastOptions as ToastOptionsBase,
} from "@/components/ui/use-toast-base";

import { ToastProps } from "./use-toast";

export type ToastOptions = ToastOptionsBase & {
  action?: ToastActionElement;
};

export function useToast() {
  const { toast: toastBase, ...rest } = useToastBase();

  const toast = (props: ToastOptions) => {
    toastBase({
      ...props,
      className:
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border border-slate-200 p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full dark:border-slate-800",
      ...props,
    });
  };

  return {
    ...rest,
    toast,
  };
}

export type { Toast, ToastProps };
