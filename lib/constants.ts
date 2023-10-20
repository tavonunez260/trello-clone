import { TypedColumn } from '@/types';

export const types: { id: TypedColumn; name: string; description: string; color: string }[] = [
	{
		id: TypedColumn.TO_DO,
		name: 'Todo',
		description: 'A new task to be completed',
		color: 'bg-red-500'
	},
	{
		id: TypedColumn.IN_PROGRESS,
		name: 'In Progress',
		description: 'A task that is currently being worked on',
		color: 'bg-yellow-500'
	},
	{
		id: TypedColumn.DONE,
		name: 'Done',
		description: 'A task that has been completed',
		color: 'bg-green-500'
	}
];

export const rules = {
	value: {
		required: {
			value: true,
			message: 'This field is required'
		}
	}
};
