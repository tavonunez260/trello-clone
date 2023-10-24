import { addDoc, collection, deleteDoc, doc, updateDoc } from '@firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from '@firebase/storage';
import { create } from 'zustand';

import { db } from '@/firebase';
import { getTodosGroupedByColumn, validateImage } from '@/lib';
import { TypedColumn } from '@/types';
import { Board, Column, ImageToEditType, Todo } from '@/typings';

interface BoardState {
	addTask: (title: string, status: TypedColumn, image?: File | null) => Promise<void>;
	board: Board;
	clearTaskToEdit: () => void;
	deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => Promise<void>;
	getBoard: () => Promise<void>;
	image: File | null;
	imageToEdit: ImageToEditType | null;
	isEdit: boolean;
	newTaskInput: string;
	newTaskType: TypedColumn;
	searchString: string;
	setBoardState: (board: Board) => void;
	setEdit: (isEdit: boolean) => void;
	setImageToEdit: (image: ImageToEditType | null) => void;
	setNewImage: (value: File | null) => void;
	setNewTaskInput: (value: string) => void;
	setNewTaskType: (value: TypedColumn) => void;
	setSearchString: (searchString: string) => void;
	setTaskToEdit: (todo: Todo) => void;
	taskToEdit: Todo | null;
	updateColumnOrder: (order: TypedColumn[]) => void;
	updateOrder: (todos: Todo[]) => void;
	updateTodoInDB: (todoId: string, columnId: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
	addTask: async (title: string, status: TypedColumn, image?: File | null) => {
		const newDate = new Date().getTime();
		const newOrder = get().board.columns.get(status)!.todos.length;
		let imageUrl = '';
		if (image) {
			const storage = getStorage();
			const newTodoImageRef = ref(storage, `${image?.name}`);
			await uploadBytes(newTodoImageRef, image);
			imageUrl = await getDownloadURL(newTodoImageRef);
		}

		const response = await addDoc(collection(db, 'todos'), {
			title,
			status,
			createdAt: newDate,
			order: newOrder,
			image: image
				? {
						url: imageUrl,
						name: image.name
				  }
				: null
		});

		set({ newTaskInput: '' });
		set({ image: null });
		set(state => {
			const newColumns = new Map(state.board.columns);
			const newTodo: Todo = {
				createdAt: newDate,
				id: response.id,
				image: image
					? {
							url: imageUrl,
							name: image.name
					  }
					: null,
				order: newOrder,
				status,
				title
			};
			const column = newColumns.get(status);
			if (!column) {
				newColumns.set(status, {
					id: status,
					todos: [newTodo]
				});
			} else {
				newColumns.get(status)?.todos.push(newTodo);
			}

			return {
				board: { columns: newColumns }
			};
		});
	},
	board: {
		columns: new Map<TypedColumn, Column>()
	},
	clearTaskToEdit: () => set({ taskToEdit: null }),
	deleteTask: async (taskIndex: number, todoId: Todo, id: TypedColumn) => {
		if (todoId.image) {
			const storage = getStorage();
			const deleteRef = ref(storage, todoId.image.name);
			await deleteObject(deleteRef);
		}

		deleteDoc(doc(db, 'todos', todoId.id)).then(() => {
			const newColumns = new Map(get().board.columns);
			newColumns.get(id)?.todos.splice(taskIndex, 1);
			set({ board: { columns: newColumns } });
		});
	},
	getBoard: async () => {
		const board = await getTodosGroupedByColumn();
		set({ board });
	},
	image: null,
	imageToEdit: null,
	isEdit: false,
	newTaskInput: '',
	newTaskType: TypedColumn.TO_DO,
	searchString: '',
	setBoardState: (board: Board) => set({ board }),
	setEdit: (isEdit: boolean) => set({ isEdit }),
	setImageToEdit: (imageToEdit: ImageToEditType | null) => {
		if (!imageToEdit) {
			set({ imageToEdit: null });
			return;
		}
		if (imageToEdit.image && validateImage(imageToEdit.image)) {
			set({ imageToEdit });
		}
	},
	setNewImage: (image: File | null) => {
		if (!image) {
			set({ image: null });
			return;
		}
		if (validateImage(image)) {
			set({ image });
		}
	},
	setNewTaskInput: (newTaskInput: string) => set({ newTaskInput }),
	setNewTaskType: (newTaskType: TypedColumn) => set({ newTaskType }),
	setSearchString: (searchString: string) => set({ searchString }),
	setTaskToEdit: (todo: Todo) => set({ taskToEdit: todo }),
	taskToEdit: null,
	updateColumnOrder: async (order: TypedColumn[]) => {
		const columnRef = doc(db, 'todos', 'orderId');
		await updateDoc(columnRef, { order });
	},
	updateOrder: (todos: Todo[]) => {
		todos.forEach(async todo => {
			const todoRef = doc(db, 'todos', todo.id);
			await updateDoc(todoRef, {
				order: todo.order
			});
		});
	},
	updateTodoInDB: async (todoId, columnId) => {
		const todoRef = doc(db, 'todos', todoId);
		await updateDoc(todoRef, { status: columnId });
	}
}));
