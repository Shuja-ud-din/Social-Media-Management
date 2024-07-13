export function checkURL(url: string): string {
  try {
    const parsedURL = new URL(url)
    if (parsedURL.hostname.includes('instagram.com')) {
      return 'instagram'
    }
    if (parsedURL.hostname.includes('twitter.com')) {
      return 'twitter'
    }
    if (url.includes('tiktok.com')) {
      return 'tiktok'
    }
    return 'Unknown'
  } catch (error) {
    console.error(`Invalid URL: ${url}`)
    return 'invalid'
  }
}
