import { TypedColumn } from '@/types';

export const types: { color: string; description: string; id: TypedColumn; name: string }[] = [
	{
		id: TypedColumn.TO_DO,
		name: 'Todo',
		description: 'A new task to be completed',
		color: 'red'
	},
	{
		id: TypedColumn.IN_PROGRESS,
		name: 'In Progress',
		description: 'A task that is currently being worked on',
		color: 'yellow'
	},
	{
		id: TypedColumn.DONE,
		name: 'Done',
		description: 'A task that has been completed',
		color: 'green'
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
