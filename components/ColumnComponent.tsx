'use client';

import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import { TodoCard } from '@/components';
import { useBoardStore } from '@/store';
import { TypedColumn } from '@/types';
import { Todo } from '@/typings';

type ColumnProps = {
	id: TypedColumn;
	todos: Todo[];
	index: number;
};

const idToColumnText: {
	[key in TypedColumn]: string;
} = {
	todo: 'To Do',
	inProgress: 'In Progress',
	done: 'Done'
};

export function ColumnComponent({ id, todos, index }: ColumnProps) {
	const [searchString] = useBoardStore(state => [state.searchString]);

	return (
		<Draggable draggableId={id} index={index}>
			{provided => (
				<div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
					<Droppable droppableId={index.toString()} type="card">
						{(provided, snapshot) => (
							<div
								className={`p-2 rounded-2xl shadow-sm ${
									snapshot.isDraggingOver ? 'bg-green-200' : 'bg-white/50'
								}`}
								{...provided.droppableProps}
								ref={provided.innerRef}
							>
								<h2 className="flex justify-between font-bold text-xl p-2">
									{idToColumnText[id]}{' '}
									<span className="text-gray-500 bg-gray-200 rounded-full px-2 py-1 text-sm font-normal">
										{!searchString
											? todos.length
											: todos.filter(todo =>
													todo.title.toLowerCase().includes(searchString.toLowerCase())
											  ).length}
									</span>
								</h2>

								<div className="space-y-2">
									{todos.map((todo, index) => {
										if (
											searchString &&
											!todo.title.toLowerCase().includes(searchString.toLowerCase())
										) {
											return null;
										}

										return (
											<Draggable key={todo.id} draggableId={todo.id} index={index}>
												{provided => (
													<TodoCard
														draggableProps={provided.draggableProps}
														dragHandleProps={provided.dragHandleProps}
														id={id}
														index={index}
														innerRef={provided.innerRef}
														todo={todo}
													/>
												)}
											</Draggable>
										);
									})}
									{provided.placeholder}
									<div className="flex items-end justify-end p-2">
										<button className="text-green-500 hover:text-green-600">
											<PlusCircleIcon className="h-10 w-10" />
										</button>
									</div>
								</div>
							</div>
						)}
					</Droppable>
				</div>
			)}
		</Draggable>
	);
}
