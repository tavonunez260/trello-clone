import { ChangeEvent, useRef } from 'react';
import { UseFormRegister, UseFormTrigger } from 'react-hook-form';

import { rules } from '@/lib';
import { AddTaskForm } from '@/types';
import { ImageToEditType, Todo } from '@/typings';

interface UseImageRegisterType {
	isEdit: boolean;
	register: UseFormRegister<AddTaskForm>;
	setImageToEdit: (image: ImageToEditType | null) => void;
	setNewImage: (value: File | null) => void;
	taskToEdit: Todo | null;
	trigger: UseFormTrigger<AddTaskForm>;
}

export const useImageRegister = ({
	isEdit,
	register,
	setImageToEdit,
	setNewImage,
	taskToEdit,
	trigger
}: UseImageRegisterType) => {
	const imagePickerRef = useRef<HTMLInputElement | null>(null);

	const imageRegister = register('image', {
		onChange: (event: ChangeEvent<HTMLInputElement>) => {
			trigger('image').then(triggerResult => {
				if (triggerResult) {
					if (!isEdit) {
						setNewImage(event.target.files![0]);
					} else if (isEdit && taskToEdit) {
						setImageToEdit({ image: event.target.files![0], id: taskToEdit.id });
					}
				} else {
					if (!isEdit) {
						setNewImage(null);
					} else if (isEdit && taskToEdit) {
						setImageToEdit(null);
					}
				}
			});
		},
		...rules.file
	});

	return {
		imagePickerRef,
		imageRegister
	};
};
