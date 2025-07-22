import { v4 as uuid } from 'uuid';

export interface Toast {
	id: string;
	type: 'success' | 'error' | 'info';
	body: string;
	onClick: (id: string) => void;
}

interface ToastOptions {
	duration?: number;
	onClick?: (id: string) => void;
}
const defaultOptions = {
	duration: 5000,
	onClick: removeToast,
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
	toasts.push({ id, type, body: message, onClick: o.onClick });
	if (o.duration !== undefined && o.duration > 0) {
		setTimeout(() => {
			removeToast(id);
		}, o.duration);
	}
}

export function removeToast(id: string) {
	const index = toasts.findIndex((v) => v.id === id);
	if (index > -1) {
		toasts.splice(index, 1);
	}
}
