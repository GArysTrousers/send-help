import { v4 as uuid } from 'uuid';

export interface Toast {
	id: string;
	type: 'success' | 'error' | 'info';
	body: string;
	onClick?: () => void;
}

interface ToastOptions {
	duration?: number;
	onClick?: () => void;
}
const defaultOptions: ToastOptions = {
	duration: 5000,
	onClick: undefined,
};

export const toasts: Toast[] = $state([]);

export function addToast(type: 'success' | 'error' | 'info', body: string | unknown, options: ToastOptions = {}) {
	let o = { ...defaultOptions, ...options };
	const id = uuid();
	let message = '';
	if (body instanceof Error) message = body.message;
	else if (typeof body === 'string') message = body;
	else {
		message = '?';
		console.log(body);
	}
	if (o.onClick === undefined) {
		o.onClick = () => removeToast(id);
	}
	toasts.push({ id, type, body: message });
	setTimeout(() => {
		removeToast(id);
	}, o.duration);
}

export function removeToast(id: string) {
	const index = toasts.findIndex((v) => v.id === id);
	if (index > -1) {
		toasts.splice(index, 1);
	}
}
