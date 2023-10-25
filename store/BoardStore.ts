import { addDoc, collection, deleteDoc, doc, updateDoc } from '@firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from '@firebase/storage';
import { create } from 'zustand';

import { db } from '@/firebase';
import { getTodosGroupedByColumn, validateImage } from '@/lib';
import { TypedColumn } from '@/types';
import { Board, Column, ImageToEditType, ImageType, TaskToEdit, Todo } from '@/typings';

interface BoardState {
	addTask: (title: string, status: TypedColumn, image?: File | null) => Promise<void>;
	board: Board;
	clearTaskToEdit: () => void;
	deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => Promise<void>;
	editTask: (
		todo: TaskToEdit,
		title: string,
		status: TypedColumn,
		image?: File | null,
		previousImage?: ImageType | null
	) => Promise<void>;
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
	setTaskToEdit: (todo: TaskToEdit) => void;
	taskToEdit: TaskToEdit | null;
	updateColumnOrder: (order: TypedColumn[]) => void;
	updateOrder: (todos: Todo[]) => void;
	updateTodoInDB: (todoId: string, columnId: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
	addTask: async (title, status, image) => {
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
	deleteTask: async (taskIndex, todoId, id) => {
		if (todoId.image) {
			const storage = getStorage();
			const deleteRef = ref(storage, todoId.image.name);
			await deleteObject(deleteRef);
		}

		await deleteDoc(doc(db, 'todos', todoId.id));

		const newColumns = new Map(get().board.columns);
		newColumns.get(id)?.todos.splice(taskIndex, 1);
		set({ board: { columns: newColumns } });
	},
	editTask: async (todo, title, status, image, previousImage) => {
		const storage = getStorage();
		let newImageUrl: string | undefined = '';
		const deletePreviousImage = async () => {
			if (previousImage) {
				const deleteRef = ref(storage, previousImage.name);
				await deleteObject(deleteRef);
			}
		};
		const uploadImage = async () => {
			if (image) {
				const newTodoImageRef = ref(storage, `${image?.name}`);
				await uploadBytes(newTodoImageRef, image);
				return await getDownloadURL(newTodoImageRef);
			}
		};

		if (previousImage) {
			await deletePreviousImage();
		}
		if (image) {
			newImageUrl = await uploadImage();
		}

		const todoRef = doc(db, 'todos', todo.id);
		await updateDoc(todoRef, {
			title,
			status,
			image: image ? { name: image.name, url: newImageUrl } : null
		});

		const newColumns = new Map(get().board.columns);
		const targetTodoList = newColumns.get(status)?.todos;
		if (targetTodoList) {
			targetTodoList[todo.index] = {
				...todo,
				title,
				status,
				image: image ? { name: image.name, url: newImageUrl! } : null
			};
		}
		set({ board: { columns: newColumns } });
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
	setBoardState: board => set({ board }),
	setEdit: isEdit => set({ isEdit }),
	setImageToEdit: imageToEdit => {
		if (!imageToEdit) {
			set({ imageToEdit: null });
			return;
		}
		if (imageToEdit.image && validateImage(imageToEdit.image)) {
			set({ imageToEdit });
		}
	},
	setNewImage: image => {
		if (!image) {
			set({ image: null });
			return;
		}
		if (validateImage(image)) {
			set({ image });
		}
	},
	setNewTaskInput: newTaskInput => set({ newTaskInput }),
	setNewTaskType: newTaskType => set({ newTaskType }),
	setSearchString: searchString => set({ searchString }),
	setTaskToEdit: todo => set({ taskToEdit: todo }),
	taskToEdit: null,
	updateColumnOrder: async order => {
		const columnRef = doc(db, 'todos', 'orderId');
		await updateDoc(columnRef, { order });
	},
	updateOrder: todos => {
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
