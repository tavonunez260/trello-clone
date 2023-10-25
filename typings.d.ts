import { TypedColumn } from '@/types';

interface ImageType {
	name: string;
	url: string;
}

interface ImageToEditType {
	id: string;
	image: File | null;
}

interface Todo {
	createdAt: number;
	id: string;
	image?: ImageType | null;
	order: number;
	status: TypedColumn;
	title: string;
}

interface TaskToEdit extends Todo {
	index: number;
}

interface TodoResponse {
	data: { createdAt: number; image?: ImageType; order: number; status: TypedColumn; title: string };
	id: string;
}

interface Column {
	id: TypedColumn;
	todos: Todo[];
}

interface Board {
	columns: Map<TypedColumn, Column>;
}
