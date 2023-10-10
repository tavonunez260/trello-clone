'use client';

import { useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

import { ColumnComponent } from '@/components';
import { useBoardStore } from '@/store';
import { TypedColumn } from '@/types';
import { Column, Todo } from '@/typings';

export function BoardComponent() {
	const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore(state => [
		state.board,
		state.getBoard,
		state.setBoardState,
		state.updateTodoInDB
	]);

	const reorder = (
		list: Todo[] | [TypedColumn, Column][],
		startIndex: number,
		endIndex: number
	): typeof list => {
		if (list.length === 0) return list; // Empty list

		if ((list[0] as Todo).id !== undefined) {
			const result = Array.from(list as Todo[]);
			const [removed] = result.splice(startIndex, 1);
			result.splice(endIndex, 0, removed);
			return result;
		} else {
			const result = Array.from(list as [TypedColumn, Column][]);
			const [removed] = result.splice(startIndex, 1);
			result.splice(endIndex, 0, removed);
			return result;
		}
	};

	const handleColumnDrag = (sourceIndex: number, destinationIndex: number) => {
		const entries = Array.from(board.columns.entries());
		const reorderedEntries = reorder(entries, sourceIndex, destinationIndex) as [
			TypedColumn,
			Column
		][];
		return new Map(reorderedEntries);
	};

	const handleTodoDrag = (
		startCol: Column,
		finishCol: Column,
		sourceIndex: number,
		destinationIndex: number
	) => {
		const newStartTodos = Array.from(startCol.todos);
		const [movedTodo] = newStartTodos.splice(sourceIndex, 1);

		let newFinishTodos;

		if (startCol.id === finishCol.id) {
			newFinishTodos = reorder(newStartTodos, sourceIndex, destinationIndex);
		} else {
			newFinishTodos = [...finishCol.todos];
			newFinishTodos.splice(destinationIndex, 0, movedTodo);
		}

		const newColumns = new Map(board.columns);
		newColumns.set(startCol.id, { ...startCol, todos: newStartTodos });
		newColumns.set(finishCol.id, { ...finishCol, todos: newFinishTodos as Todo[] });

		return newColumns;
	};

	const handleOnDragEnd = (result: DropResult) => {
		const { destination, source, type } = result;

		if (!destination) return;

		let newColumns;

		if (type === 'column') {
			newColumns = handleColumnDrag(source.index, destination.index);
		} else {
			const columns = Array.from(board.columns);
			const startCol = columns[Number(source.droppableId)][1];
			const finishCol = columns[Number(destination.droppableId)][1];

			if (!startCol || !finishCol) return;
			if (source.index === destination.index && startCol.id === finishCol.id) return;

			newColumns = handleTodoDrag(startCol, finishCol, source.index, destination.index);

			const todoMoved = startCol.todos[source.index];
			updateTodoInDB(todoMoved, finishCol.id);
		}

		setBoardState({ ...board, columns: newColumns });
	};

	useEffect(() => {
		getBoard();
	}, [getBoard]);
	console.log(board);

	return (
		<DragDropContext onDragEnd={handleOnDragEnd}>
			<Droppable direction="horizontal" droppableId="board" type="column">
				{provided => (
					<div
						className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
						{...provided.droppableProps}
						ref={provided.innerRef}
					>
						{Array.from(board.columns.entries()).map(([id, column], index) => (
							<ColumnComponent key={id} id={id} index={index} todos={column.todos} />
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}
