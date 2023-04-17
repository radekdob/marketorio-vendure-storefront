export function extractBearerFromCookie(cookies: string, tokenCookieName: string): string | undefined {
    const bearerCookie = cookies?.split(';')
        .find(c => c.split('=')[0].trim() === tokenCookieName);
    return bearerCookie?.split('=')[1];
}
