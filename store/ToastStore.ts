import toast from 'react-hot-toast';
import { create } from 'zustand';

interface ToastStore {
	runToast: (message: string, type: 'loading' | 'success' | 'error') => void;
}

export const useToastStore = create<ToastStore>()(() => ({
	runToast: (message, type) => toast[type](message)
}));
