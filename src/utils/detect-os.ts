export function detectOS(userAgent: string): string {
  const ua = userAgent.toLowerCase()

  if (ua.includes('windows')) return 'Windows'
  if (ua.includes('mac os')) return 'MacOS'
  if (ua.includes('linux')) return 'Linux'
  if (ua.includes('android')) return 'Android'
  if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) return 'iOS'
  if (ua.includes('chrome os')) return 'Chrome OS'
  
  return 'Unknown'
}