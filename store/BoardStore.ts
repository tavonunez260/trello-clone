import { addDoc, collection, doc, deleteDoc, setDoc, updateDoc } from '@firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from '@firebase/storage';
import { create } from 'zustand';

import { db } from '@/firebase';
import { getTodosGroupedByColumn, rules } from '@/lib';
import { TypedColumn } from '@/types';
import { Board, Column, Todo } from '@/typings';

interface BoardState {
	addTask: (title: string, status: TypedColumn, image?: File | null) => Promise<void>;
	board: Board;
	deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => Promise<void>;
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

		await addDoc(collection(db, 'todos'), {
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
		}).then(response => {
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
		});
	},
	board: {
		columns: new Map<TypedColumn, Column>()
	},
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
	newTaskInput: '',
	newTaskType: TypedColumn.TO_DO,
	searchString: '',
	setBoardState: (board: Board) => set({ board }),
	setImage: (image: File | null) => {
		if (image && rules.file.validate([image]) === true) {
			set({ image });
		}
	},
	setNewTaskInput: (newTaskInput: string) => set({ newTaskInput }),
	setNewTaskType: (newTaskType: TypedColumn) => set({ newTaskType }),
	setSearchString: (searchString: string) => set({ searchString }),
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
	updateTodoInDB: async (updatedTodo, columnId) => {
		const todoRef = doc(db, 'todos', updatedTodo.id);
		await setDoc(
			todoRef,
			{ title: updatedTodo.title, status: columnId, createdAt: new Date().getTime() },
			{ merge: true }
		);
	}
}));
