'use client';

import { Dialog, Transition } from '@headlessui/react';
import { PhotoIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { RadioGroupComponent, SpinnerComponent } from '@/components';
import { rules } from '@/lib';
import { useBoardStore, useModalStore, useToastStore } from '@/store';
import { AddTaskForm } from '@/types';

export function ModalComponent() {
	const [addTask, image, newTaskInput, newTaskType, setImage, setNewTaskInput, setNewTaskType] =
		useBoardStore(state => [
			state.addTask,
			state.image,
			state.newTaskInput,
			state.newTaskType,
			state.setImage,
			state.setNewTaskInput,
			state.setNewTaskType
		]);
	const [runToast] = useToastStore(state => [state.runToast]);
	const [isOpen, closeModal] = useModalStore(state => [state.isOpen, state.closeModal]);
	const [loading, setLoading] = useState(false);
	const imagePickerRef = useRef<HTMLInputElement | null>(null);
	const {
		control,
		formState: { errors },
		handleSubmit,
		register,
		setValue,
		trigger
		// watch
	} = useForm<AddTaskForm>({
		defaultValues: {
			title: newTaskInput,
			image: image ? [image] : null
		}
	});
	const imageRegister = register('image', {
		onChange: (event: ChangeEvent<HTMLInputElement>) => {
			trigger('image').then(() => setImage(event.target.files![0]));
		},
		...rules.file
	});

	const onSubmit = (data: AddTaskForm) => {
		setLoading(true);
		addTask(data.title, data.type, data.image?.[0]).finally(() => {
			setLoading(false);
			runToast('Task created successfully', 'success');
			closeModal();
		});
	};

	useEffect(() => {
		setValue('type', newTaskType);
	}, [newTaskType, setValue]);

	return (
		// Use the `Transition` component at the root level
		<Transition appear as={Fragment} show={isOpen}>
			<Dialog
				as="form"
				className="relative z-10"
				onClose={() => closeModal()}
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
												onChange: setNewTaskInput,
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
											{image && (
												<Image
													alt="Uploaded image"
													className="w-full h-44 object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed"
													height={200}
													src={URL.createObjectURL(image)}
													width={200}
													onClick={() => {
														setImage(null);
													}}
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
