/* const closePopup = async (page: any) => {
  const continueAsGuestButtonSelector = '[class="css-u3m0da-DivBoxContainer e1cgu1qo0"]'

  // Wait for the "Continue as guest" button to be present on the page
  await page.waitForSelector(continueAsGuestButtonSelector)

  // Click the "Continue as guest" button
  await page.click(continueAsGuestButtonSelector)
} */

import puppeteer from 'puppeteer'
import httpStatus from 'http-status'
import ApiError from '../errors/ApiError'
import { extractAndFormatMedia, fetchEmbeddedTweet } from '../twitterVideoDL/get-tweet'
import { Tweet } from '../twitterVideoDL/types'
import { checkURL } from '../utils/urlCheck'
import { tiktokVideoDownload } from '../tiktokVideoDL/tiktokvideoDownload'

export const instagramVideoDownload = async (url: string): Promise<string> => {
  const browser = await puppeteer.launch({
    headless: true,
  })
  const page = await browser.newPage()
  page.setDefaultNavigationTimeout(2 * 60 * 1000)
  await page.goto(url)
  await page.waitForSelector('video', { visible: true })
  const videoSrc = await page.evaluate(() => {
    const videoElement = document.querySelector('video')
    return videoElement ? videoElement.src : null
  })

  await browser.close()
  if (!videoSrc) throw new ApiError(httpStatus.NOT_FOUND, 'Unable to Download video')

  return videoSrc
}

const twitterVideoDownload = async (url: string) => {
  let videoUrlDl: string = ''
  try {
    console.log({ url })

    const tweet: Tweet = await fetchEmbeddedTweet(url)
    const media = extractAndFormatMedia(tweet)

    console.log('==========================Media 1==========================')
    // @ts-ignore
    console.log(media[0].variants[0].url)
    // @ts-ignore
    videoUrlDl = media[0].variants[0].url
    console.log('==========================Media 1==========================')
  } catch (e) {
    console.log(e)
  }
  return videoUrlDl
}

let videoUrl: string
export const getReelDownloadLink = async (url: string) => {
  const socialPlateform = checkURL(url)
  switch (socialPlateform) {
    case 'twitter':
      videoUrl = await twitterVideoDownload(url)
      break
    case 'instagram':
      videoUrl = await instagramVideoDownload(url)
      break
    case 'tiktok':
      videoUrl = await tiktokVideoDownload(url)
      break
    default:
      break
  }

  return videoUrl
}
