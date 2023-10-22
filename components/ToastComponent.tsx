'use client';

import { Transition } from '@headlessui/react';
import { resolveValue, Toaster, ToastIcon } from 'react-hot-toast';

export function ToastComponent() {
	return (
		<Toaster position="bottom-right">
			{t => (
				<Transition
					appear
					className="transform p-4 flex bg-white rounded shadow-lg"
					enter="transition-all duration-150"
					enterFrom="opacity-0 scale-50"
					enterTo="opacity-100 scale-100"
					leave="transition-all duration-150"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-75"
					show={t.visible}
				>
					<ToastIcon toast={t} />
					<p className="px-2">{resolveValue(t.message, t)}</p>
				</Transition>
			)}
		</Toaster>
	);
}
