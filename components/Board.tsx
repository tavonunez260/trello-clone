'use client';

import { useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

import { Column } from '@/components';
import { useBoardStore } from '@/store';

export function Board() {
	const [board, getBoard] = useBoardStore(state => [state.board, state.getBoard]);

	const handleOnDragEnd = (result: DropResult) => {
		const { destination, source, type } = result;
		console.log(destination, source, type);
	};

	useEffect(() => {
		getBoard();
	}, [getBoard]);
	console.log(board);

	return (
		<DragDropContext onDragEnd={handleOnDragEnd}>
			<Droppable droppableId="board" direction="horizontal" type="column">
				{provided => (
					<div
						className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
						{...provided.droppableProps}
						ref={provided.innerRef}
					>
						{Array.from(board.columns.entries()).map(([id, column], index) => (
							<Column key={id} id={id} todos={column.todos} index={index} />
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}
