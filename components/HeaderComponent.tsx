'use client';

import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Avatar from 'react-avatar';

import { useBoardStore } from '@/store';

export function HeaderComponent() {
	const [searchString, setSearchString] = useBoardStore(state => [
		state.searchString,
		state.setSearchString
	]);

	return (
		<header>
			<div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
				<div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-customBlue rounded-md filter blur-3xl opacity-50 -z-50" />
				<Image
					alt="Trello logo"
					className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
					height={100}
					src="https://links.papareact.com/c2cdd5"
					width={300}
				/>
				<div className="flex items-center space-x-5 flex-1 justify-end w-full">
					<form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
						<MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
						<input
							className="flex-1 outline-none p-2"
							placeholder="Search"
							type="text"
							value={searchString}
							onChange={event => setSearchString(event.target.value)}
						/>
						<button hidden type="submit">
							Search
						</button>
					</form>
					<Avatar color="#0055D1" name="Gustavo Nunez" round size="50" />
				</div>
			</div>

			<div className="flex items-center justify-center px-5 py-2 md:py-5">
				<p className="flex items-center text-sm font-light p-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-customBlue">
					<UserCircleIcon className="inline-block h-10 w-10 text-customBlue mr-1" />
					GPT is summarizing your tasks for the day...
				</p>
			</div>
		</header>
	);
}
