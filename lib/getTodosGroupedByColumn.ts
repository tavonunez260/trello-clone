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

	const todoColumns = todoDataSnapshot.docs.find(doc => doc.id === 'orderId')?.data();
	const todos = {
		documents: todoDataSnapshot.docs
			.filter(doc => doc.id !== 'orderId')
			.map(doc => ({
				id: doc.id,
				...(doc.data() as TodoResponse['data'])
			}))
			.sort((a, b) => a.order - b.order),
		total: todoCountSnapshot.data().count
	};

	const initialColumns = (todoColumns!.order as TypedColumn[]).reduce((acc, columnType) => {
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
				order: todo.order,
				...(todo.image && { image: todo.image })
			});
		}
		return acc;
	}, initialColumns);

	return { columns };
};
