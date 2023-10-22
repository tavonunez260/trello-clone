'use client';

import { PencilIcon, XCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import {
	DraggableProvidedDraggableProps,
	DraggableProvidedDragHandleProps
} from 'react-beautiful-dnd';

import { TypedColumn } from '@/types';
import { Todo } from '@/typings';

type TodoCardType = {
	dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
	draggableProps: DraggableProvidedDraggableProps;
	id: TypedColumn;
	index: number;
	innerRef: (element: HTMLElement | null) => void;
	todo: Todo;
};

export function TodoCardComponent({
	draggableProps,
	dragHandleProps,
	id,
	index,
	innerRef,
	todo
}: TodoCardType) {
	return (
		<div
			className="bg-white rounded-md space-y-2 drop-shadow-md"
			{...draggableProps}
			{...dragHandleProps}
			ref={innerRef}
		>
			<div className="flex justify-between items-center py-5 px-3">
				<p>{todo.title}</p>
				<div className="flex gap-2">
					<button className="text-blue-600 hover:text-red-600">
						<PencilIcon className="h-7 w-7" />
					</button>
					<button className="text-red-500 hover:text-red-600">
						<XCircleIcon className="h-8 w-8" />
					</button>
				</div>
			</div>
			{todo.image && (
				<div>
					<Image
						alt="Todo image"
						className="w-full object-contain rounded-b-md"
						height={200}
						src={todo.image}
						width={400}
					/>
				</div>
			)}
		</div>
	);
}
