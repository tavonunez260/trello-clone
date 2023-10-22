import { addDoc, collection, doc, setDoc, updateDoc } from '@firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@firebase/storage';
import { create } from 'zustand';

import { db } from '@/firebase';
import { getTodosGroupedByColumn } from '@/lib';
import { TypedColumn } from '@/types';
import { Board, Column, Todo } from '@/typings';

interface BoardState {
	addTask: (title: string, status: TypedColumn, image?: File | null) => void;
	board: Board;
	getBoard: () => Promise<void>;
	image: File | null;
	newTaskInput: string;
	newTaskType: TypedColumn;
	searchString: string;
	setBoardState: (board: Board) => void;
	setImage: (value: File | null) => void;
	setNewTaskInput: (value: string) => void;
	setNewTaskType: (value: TypedColumn) => void;
	setSearchString: (searchString: string) => void;
	updateColumnOrder: (order: TypedColumn[]) => void;
	updateOrder: (todos: Todo[]) => void;
	updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, getState) => ({
	addTask: async (title: string, status: TypedColumn, image?: File | null) => {
		let imageUrl = '';
		if (image) {
			const storage = getStorage();
			const newTodoImageRef = ref(storage, `${image?.name}`);
			await uploadBytes(newTodoImageRef, image);
			imageUrl = await getDownloadURL(newTodoImageRef);
		}

		await addDoc(collection(db, 'todos'), {
			title,
			status,
			createdAt: new Date().getTime(),
			order: getState().board.columns.get(status)?.todos.length,
			image: imageUrl
		});
	},
	board: {
		columns: new Map<TypedColumn, Column>()
	},
	getBoard: async () => {
		const board = await getTodosGroupedByColumn();
		set({ board });
	},
	setBoardState: (board: Board) => set({ board }),
	updateColumnOrder: async (order: TypedColumn[]) => {
		const columnRef = doc(db, 'todos', 'orderId');
		await updateDoc(columnRef, { order });
	},
	updateTodoInDB: async (updatedTodo, columnId) => {
		const todoRef = doc(db, 'todos', updatedTodo.id);
		await setDoc(
			todoRef,
			{ title: updatedTodo.title, status: columnId, createdAt: new Date().getTime() },
			{ merge: true }
		);
	},
	searchString: '',
	setSearchString: (searchString: string) => set({ searchString }),
	newTaskInput: '',
	setNewTaskInput: (newTaskInput: string) => set({ newTaskInput }),
	newTaskType: TypedColumn.TO_DO,
	setNewTaskType: (newTaskType: TypedColumn) => set({ newTaskType }),
	image: null,
	setImage: (image: File | null) => set({ image }),
	updateOrder: (todos: Todo[]) => {
		todos.forEach(async todo => {
			const todoRef = doc(db, 'todos', todo.id);
			await updateDoc(todoRef, {
				order: todo.order
			});
		});
	}
}));
