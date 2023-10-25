/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
	experimental: {
		appDir: true
	},
	images: {
		unoptimized: true,
		domains: ['links.papareact.com', 'firebasestorage.googleapis.com']
	}
};

module.exports = nextConfig;
