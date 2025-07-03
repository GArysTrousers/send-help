import { v4 as uuid } from "uuid";

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  body: string;
}

interface ToastOptions {
  duration?: number;
}
const defaultOptions: ToastOptions = {
  duration: 5000,
}

export const toasts: Toast[] = $state([])

export function addToast(type: 'success' | 'error' | 'info', body: string, options: ToastOptions = {}) {
  let o = {...defaultOptions, ...options}
  const id = uuid()
  toasts.push({ id , type, body })
  setTimeout(() => {removeToast(id)}, o.duration)
}

export function removeToast(id: string) {
  const index = toasts.findIndex((v)=>(v.id === id))
  if (index > -1) {
    toasts.splice(index, 1)
  }
}