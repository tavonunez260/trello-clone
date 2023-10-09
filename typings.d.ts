import { TypedColumn } from '@/types';

interface Image {
	bucketId: string;
	fileId: string;
}

interface Todo {
	id: string;
	title: string;
	status: TypedColumn;
	image?: Image;
	createdAt: number;
}

interface TodoResponse {
	id: string;
	data: { title: string; status: TypedColumn; image?: Image; createdAt: number };
}

interface Column {
	id: TypedColumn;
	todos: Todo[];
}

interface Board {
	columns: Map<TypedColumn, Column>;
}
