export enum TypedColumn {
	TO_DO = 'todo',
	IN_PROGRESS = 'inProgress',
	DONE = 'done'
}

export type AddTaskForm = {
	name: string;
	type: TypedColumn | '';
};
