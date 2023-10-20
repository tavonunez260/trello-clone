'use client';

import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Control, Controller, FieldError } from 'react-hook-form';

import { rules, types } from '@/lib';
import { AddTaskForm, TypedColumn } from '@/types';

interface RadioGroupComponentType {
	control: Control<AddTaskForm>;
	error: FieldError | undefined;
	newTaskType: TypedColumn;
	setNewTaskType: (value: TypedColumn) => void;
}

export function RadioGroupComponent({
	control,
	error,
	newTaskType,
	setNewTaskType
}: RadioGroupComponentType) {
	return (
		<div className="w-full py-5">
			<div className="mx-auto w-full max-w-md ">
				<Controller
					control={control}
					name="type"
					render={({ field }) => (
						<RadioGroup
							value={newTaskType}
							onChange={event => {
								field.onChange(event);
								setNewTaskType(event);
							}}
						>
							<div className="space-y-2">
								{types.map(type => (
									<RadioGroup.Option
										key={type.id}
										className={({ active, checked }) =>
											`${
												active
													? 'ring-2 ring-white ring-opacity-50 ring-offset-2 ring-offset-sky-300 '
													: ''
											} ${
												checked
													? `${type.color === 'red' ? 'bg-red-500' : ''}${
															type.color === 'yellow' ? 'bg-yellow-500' : ''
													  }${
															type.color === 'green' ? 'bg-green-500' : ''
													  } bg-opacity-75 text-white`
													: 'bg-white'
											} relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
										}
										value={type.id}
									>
										{({ checked }) => (
											<>
												<div className="flex w-full items-center justify-between">
													<div className="flex items-center">
														<div className="text-sm">
															<RadioGroup.Label
																as="p"
																className={`font-medium ${
																	checked ? 'text-white' : 'text-gray-900'
																}`}
															>
																{type.name}
															</RadioGroup.Label>
															<RadioGroup.Description
																as="span"
																className={`inline ${checked ? 'text-white' : 'text-gray-500'}`}
															>
																{type.description}
															</RadioGroup.Description>
														</div>
													</div>
													{checked && (
														<div className="shrink-0 text-white">
															<CheckCircleIcon className="w-6 h-6" />
														</div>
													)}
												</div>
											</>
										)}
									</RadioGroup.Option>
								))}
							</div>
						</RadioGroup>
					)}
					rules={{ ...rules.value }}
				/>
				{error && <span className="text-red-500 text-sm">{error.message}</span>}
			</div>
		</div>
	);
}
