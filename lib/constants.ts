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
	},
	file: {
		validate: (file: File[] | null) => {
			if (file === null) {
				return true;
			} else if (file && file[0].size <= 2 * 1024 * 1024) {
				return true;
			} else {
				return 'File size should not exceed 2MB';
			}
		}
	}
};

export const validateImage = (image: File): boolean => rules.file.validate([image]) === true;
