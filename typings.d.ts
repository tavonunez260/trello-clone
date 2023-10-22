import { TypedColumn } from '@/types';

interface Todo {
	createdAt: number;
	id: string;
	image?: string;
	order: number;
	status: TypedColumn;
	title: string;
}

interface TodoResponse {
	data: { createdAt: number; image?: string; order: number; status: TypedColumn; title: string };
	id: string;
}

interface Column {
	id: TypedColumn;
	todos: Todo[];
}

interface Board {
	columns: Map<TypedColumn, Column>;
}
