import {NextRequest, NextResponse} from 'next/server'

const PUBLIC_ROUTES = ['/login', '/register']
const AUTH_ROUTES = ['/login', '/register']

export function middleware(request: NextRequest) {
	const token = request.cookies.get('access_token')?.value
	const {pathname} = request.nextUrl

	const isPublicRoute = PUBLIC_ROUTES.some((route) =>
		pathname.startsWith(route),
	)
	const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

	if (!token && !isPublicRoute) {
		const loginUrl = new URL('/login', request.url)
		return NextResponse.redirect(loginUrl)
	}

	if (token && isAuthRoute) {
		const homeUrl = new URL('/', request.url)
		return NextResponse.redirect(homeUrl)
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
