'use client';

import { Dialog, Transition } from '@headlessui/react';
import { PhotoIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { RadioGroupComponent, SpinnerComponent } from '@/components';
import { useImageRegister } from '@/hooks';
import { rules } from '@/lib';
import { useBoardStore, useModalStore, useToastStore } from '@/store';
import { AddTaskForm } from '@/types';
import { ImageType } from '@/typings';

export function ModalComponent() {
	const [
		addTask,
		clearTaskToEdit,
		editTask,
		isEdit,
		image,
		imageToEdit,
		newTaskInput,
		newTaskType,
		setEdit,
		setImageToEdit,
		setNewImage,
		setNewTaskInput,
		setNewTaskType,
		taskToEdit
	] = useBoardStore(state => [
		state.addTask,
		state.clearTaskToEdit,
		state.editTask,
		state.isEdit,
		state.image,
		state.imageToEdit,
		state.newTaskInput,
		state.newTaskType,
		state.setEdit,
		state.setImageToEdit,
		state.setNewImage,
		state.setNewTaskInput,
		state.setNewTaskType,
		state.taskToEdit
	]);
	const titleToEdit = taskToEdit?.title;
	const typeToEdit = taskToEdit?.status;
	const imageToEditFile = imageToEdit?.image;
	const [currentEditImage, setCurrentEditImage] = useState<ImageType | null>(null);

	const [runToast] = useToastStore(state => [state.runToast]);

	const [isOpen, closeModal] = useModalStore(state => [state.isOpen, state.closeModal]);

	const [loading, setLoading] = useState(false);

	const {
		clearErrors,
		control,
		formState: { errors },
		handleSubmit,
		register,
		setValue,
		trigger
	} = useForm<AddTaskForm>({
		defaultValues: {
			title: titleToEdit || newTaskInput,
			type: typeToEdit || newTaskType,
			image: imageToEdit && imageToEdit.image ? [imageToEdit.image] : image ? [image] : null
		},
		mode: 'onChange'
	});
	const { imagePickerRef, imageRegister } = useImageRegister({
		isEdit,
		register,
		setNewImage,
		setImageToEdit,
		taskToEdit,
		trigger
	});

	const getImageProps = useCallback(() => {
		if (image && !isEdit) {
			return {
				src: URL.createObjectURL(image),
				alt: 'Uploaded image'
			};
		} else if (imageToEdit && imageToEdit.image && isEdit) {
			return {
				src: URL.createObjectURL(imageToEdit.image),
				alt: 'Uploaded image'
			};
		} else if (!imageToEdit && currentEditImage && isEdit) {
			return {
				src: currentEditImage.url,
				alt: currentEditImage.name
			};
		}
	}, [image, imageToEdit, isEdit, currentEditImage]);
	const imageProps = getImageProps();

	const updateTitle = useCallback(() => {
		if (isEdit) {
			if (titleToEdit) {
				setValue('title', titleToEdit);
			}
		} else {
			setValue('title', newTaskInput);
		}
	}, [isEdit, newTaskInput, setValue, titleToEdit]);

	const updateImage = useCallback(() => {
		if (isEdit) {
			setValue('image', imageToEditFile ? [imageToEditFile] : null);
		} else {
			setValue('image', image ? [image] : null);
		}
	}, [image, imageToEditFile, isEdit, setValue]);

	const clearImage = useCallback(() => {
		if (!isEdit) {
			setNewImage(null);
		} else if (isEdit && currentEditImage && !imageToEdit) {
			setCurrentEditImage(null);
		} else if (isEdit && imageToEdit) {
			setImageToEdit(null);
		}
	}, [isEdit, currentEditImage, imageToEdit, setNewImage, setImageToEdit]);

	const updateFormTypeValue = useCallback(() => {
		setValue('type', newTaskType);
	}, [newTaskType, setValue]);

	const onSubmit = useCallback(
		(data: AddTaskForm) => {
			console.log(data);
			setLoading(true);
			if (!isEdit) {
				addTask(data.title, data.type, data.image?.[0]).finally(() => {
					setLoading(false);
					runToast('Task created successfully', 'success');
					closeModal();
				});
			} else {
				if (taskToEdit) {
					editTask(taskToEdit, data.title, data.type, data.image?.[0], currentEditImage).finally(
						() => {
							setLoading(false);
							runToast('Task edited successfully', 'success');
							closeModal();
						}
					);
				}
			}
		},
		[addTask, closeModal, currentEditImage, editTask, isEdit, runToast, taskToEdit]
	);

	const handleCloseModal = useCallback(() => {
		closeModal();
		if (taskToEdit !== null) {
			setEdit(false);
			clearTaskToEdit();
		}
	}, [clearTaskToEdit, closeModal, setEdit, taskToEdit]);

	useEffect(() => {
		updateTitle();
	}, [updateTitle]);

	useEffect(() => {
		updateImage();
	}, [updateImage]);

	useEffect(() => {
		updateFormTypeValue();
	}, [updateFormTypeValue]);

	useEffect(() => {
		setCurrentEditImage((taskToEdit && taskToEdit.image) || null);
	}, [taskToEdit, taskToEdit?.image]);

	useEffect(() => {
		clearErrors();
	}, [clearErrors, isEdit]);

	return (
		// Use the `Transition` component at the root level
		<Transition appear as={Fragment} show={isOpen}>
			<Dialog
				as="form"
				className="relative z-10"
				onClose={handleCloseModal}
				onSubmit={handleSubmit(onSubmit)}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-25" />
				</Transition.Child>
				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="h3"
									className="text-lg font-medium leading-6 text-gray-900 pb-2 mb-2"
								>
									Add a Task
								</Dialog.Title>
								{!loading ? (
									<div className="w-full max-h-[400px] overflow-x-hidden overflow-y-auto">
										<input
											{...register('title', {
												onChange: event => {
													if (!isEdit) {
														setNewTaskInput(event.target.value);
													}
												},
												...rules.value
											})}
											className="w-full border border-gray-300 rounded-md outline-none p-5"
											placeholder="Enter a task here..."
											type="text"
										/>
										{errors.title && (
											<span className="text-red-500 text-sm">{errors.title.message}</span>
										)}
										<RadioGroupComponent
											control={control}
											error={errors.type}
											newTaskType={newTaskType}
											setNewTaskType={setNewTaskType}
										/>
										<div className="mt-2">
											<button
												className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
												type="button"
												onClick={() => {
													imagePickerRef?.current?.click();
												}}
											>
												<PhotoIcon className="h-6 w-6 mr-2 inline-block" />
												Upload Image
											</button>
											{imageProps && (
												<Image
													alt={imageProps.alt}
													className="w-full h-44 object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-pointer"
													height={200}
													src={imageProps.src}
													width={200}
													onClick={clearImage}
												/>
											)}
											<input
												{...imageRegister}
												ref={event => {
													imageRegister.ref(event);
													imagePickerRef.current = event;
												}}
												accept="image/png, image/gif, image/jpeg"
												hidden
												type="file"
											/>
											{errors.image && (
												<span className="text-red-500 text-sm">{errors.image.message}</span>
											)}
										</div>
									</div>
								) : (
									<div className="w-full h-[400px] flex items-center justify-center">
										<SpinnerComponent />
									</div>
								)}
								<div className="flex justify-center mt-4">
									<button
										className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
										type="submit"
									>
										Add task
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}
