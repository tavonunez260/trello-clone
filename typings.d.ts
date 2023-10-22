import { TypedColumn } from '@/types';

interface Image {
	name: string;
	url: string;
}

interface Todo {
	createdAt: number;
	id: string;
	image?: Image | null;
	order: number;
	status: TypedColumn;
	title: string;
}

interface TodoResponse {
	data: { createdAt: number; image?: Image; order: number; status: TypedColumn; title: string };
	id: string;
}

interface Column {
	id: TypedColumn;
	todos: Todo[];
}

interface Board {
	columns: Map<TypedColumn, Column>;
}
