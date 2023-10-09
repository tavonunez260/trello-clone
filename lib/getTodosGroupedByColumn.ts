import { collection, getCountFromServer, getDocs } from '@firebase/firestore';

import { db } from '@/firebase';
import { TypedColumn } from '@/types';
import { Column, TodoResponse } from '@/typings';

export const getTodosGroupedByColumn = async () => {
	const todoCollectionRef = collection(db, 'todos');

	// Fetch todos and their count in parallel
	const [todoDataSnapshot, todoCountSnapshot] = await Promise.all([
		getDocs(todoCollectionRef),
		getCountFromServer(todoCollectionRef)
	]);

	const todos = {
		documents: todoDataSnapshot.docs.map(doc => ({
			id: doc.id,
			...(doc.data() as TodoResponse['data'])
		})),
		total: todoCountSnapshot.data().count
	};

	const todoColumns = [TypedColumn.TO_DO, TypedColumn.IN_PROGRESS, TypedColumn.DONE];

	const initialColumns = todoColumns.reduce((acc, columnType) => {
		acc.set(columnType, {
			id: columnType,
			todos: []
		});
		return acc;
	}, new Map<TypedColumn, Column>());

	// Group the todos by their status
	const columns = todos.documents.reduce((acc, todo) => {
		const column = acc.get(todo.status);
		if (column) {
			column.todos.push({
				id: todo.id,
				createdAt: todo.createdAt,
				title: todo.title,
				status: todo.status,
				...(todo.image && { image: todo.image })
			});
		}
		return acc;
	}, initialColumns);

	// Sort the columns based on the predefined order
	const sortedColumns = new Map(
		Array.from(columns.entries()).sort(
			(a, b) => todoColumns.indexOf(a[0]) - todoColumns.indexOf(b[0])
		)
	);

	return { columns: sortedColumns };
};
