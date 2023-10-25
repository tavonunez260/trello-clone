'use client';

import { PencilIcon, XCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import {
	DraggableProvidedDraggableProps,
	DraggableProvidedDragHandleProps
} from 'react-beautiful-dnd';

import { SpinnerComponent } from '@/components/SpinnerComponent';
import { useBoardStore, useModalStore, useToastStore } from '@/store';
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
	const [deleteTask, imageToEdit, setEdit, setImageToEdit, setNewTaskType, setTaskToEdit] =
		useBoardStore(state => [
			state.deleteTask,
			state.imageToEdit,
			state.setEdit,
			state.setImageToEdit,
			state.setNewTaskType,
			state.setTaskToEdit
		]);
	const [openModal] = useModalStore(state => [state.openModal]);
	const [runToast] = useToastStore(state => [state.runToast]);
	const [loading, setLoading] = useState(false);

	const handleEditTodo = useCallback(() => {
		setEdit(true);
		setTaskToEdit({ ...todo, index });
		setNewTaskType(id);
		openModal();
		if (imageToEdit && imageToEdit.id !== todo.id) {
			setImageToEdit(null);
		}
	}, [
		id,
		imageToEdit,
		index,
		openModal,
		setEdit,
		setImageToEdit,
		setNewTaskType,
		setTaskToEdit,
		todo
	]);

	const handleDeleteTodo = useCallback(() => {
		setLoading(true);
		deleteTask(index, todo, id)
			.then(() => {
				runToast('Task deleted successfully', 'success');
			})
			.finally(() => setLoading(false));
	}, [deleteTask, id, index, runToast, todo]);

	return (
		<div
			className="bg-white rounded-md space-y-2 drop-shadow-md"
			{...draggableProps}
			{...dragHandleProps}
			ref={innerRef}
		>
			{!loading ? (
				<>
					<div className="flex justify-between items-center py-5 px-3">
						<p>{todo.title}</p>
						<div className="flex gap-2">
							<button className="text-blue-500 hover:text-blue-600" onClick={handleEditTodo}>
								<PencilIcon className="h-7 w-7" />
							</button>
							<button className="text-red-500 hover:text-red-600" onClick={handleDeleteTodo}>
								<XCircleIcon className="h-8 w-8" />
							</button>
						</div>
					</div>
					{todo.image && (
						<div>
							<Image
								alt={todo.image.name}
								className="w-full object-contain rounded-b-md"
								height={200}
								priority={true}
								src={todo.image.url}
								width={400}
							/>
						</div>
					)}
				</>
			) : (
				<div className="flex items-center justify-center w-full h-auto py-5">
					<SpinnerComponent />
				</div>
			)}
		</div>
	);
}
