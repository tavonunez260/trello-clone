import './globals.css';

import React from 'react';

import { ModalComponent, ToastComponent } from '@/components';

import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Trello 2.0 Clone',
	description: 'tavonunez260 porfolio project'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="bg-customGray">
				<>
					{children}
					<ModalComponent />
					<ToastComponent />
				</>
			</body>
		</html>
	);
}
