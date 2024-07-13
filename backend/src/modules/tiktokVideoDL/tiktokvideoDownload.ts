import fetch, { Headers } from 'node-fetch'
import pkg from 'follow-redirects'

const { https } = pkg

// adding useragent to avoid ip bans
const headers = new Headers()
headers.append('User-Agent', 'TikTok 26.2.0 rv:262018 (iPhone; iOS 14.4.2; en_US) Cronet')

const getIdVideo = async (url: string) => {
  if (url.includes('/t/')) {
    await new Promise((resolve) => {
      https.get(url, function (res: any) {
        return resolve(res.responseUrl)
      })
    })
  }
  const matching = url.includes('/video/')
  if (!matching) {
    console.log('[X] Error: URL not found')
    return null
  }
  // Tiktok ID is usually 19 characters long and sits after /video/
  const idVideo = url.substring(url.indexOf('/video/') + 7, url.indexOf('/video/') + 26)
  console.log(`[*] Video ID: ${idVideo}`)
  return idVideo.length > 19 ? idVideo.substring(0, idVideo.indexOf('?')) : idVideo
}

// url contains the url, watermark is a bool that tells us what link to use
export const tiktokVideoDownload = async (url: string) => {
  const idVideo = await getIdVideo(url)
  const API_URL = `https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${idVideo}`
  const request = await fetch(API_URL, {
    method: 'GET',
    headers,
  })
  const body = await request.text()
  let res
  try {
    res = JSON.parse(body)
  } catch (err) {
    console.error('Error:', err)
    console.error('Response body:', body)
  }

  // check if video was deleted
  if (res.aweme_list[0].aweme_id !== idVideo) {
    return null
  }

  return res.aweme_list[0].video.play_addr.url_list[0]
}
