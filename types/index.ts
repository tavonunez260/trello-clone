export enum TypedColumn {
	TO_DO = 'todo',
	IN_PROGRESS = 'inProgress',
	DONE = 'done'
}

export type AddTaskForm = {
	image: File[] | null;
	title: string;
	type: TypedColumn;
};
