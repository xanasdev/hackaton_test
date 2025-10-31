import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
	reactCompiler: true,
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8000',
				pathname: '/media/**',
			},
		],
	},
}

export default nextConfig
