import { create } from 'zustand';

interface ModalState {
	closeModal: () => void;
	isOpen: boolean;
	openModal: () => void;
}

export const useModalStore = create<ModalState>()(set => ({
	isOpen: false,
	openModal: () => set({ isOpen: true }),
	closeModal: () => set({ isOpen: false })
}));
