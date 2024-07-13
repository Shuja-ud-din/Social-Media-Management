import { generateTitleAndDescriptionBody } from '../../modules/workspace/workspace.validation'
import { validate } from '../../modules/validate'
import express, { Request, Response, Router } from 'express'
import { catchAsync, getTitleAndDescription } from '../../modules/utils'

const router: Router = express.Router()

router.post(
  '/generateTitleAndDescription',
  validate(generateTitleAndDescriptionBody),
  catchAsync(async (req: Request, res: Response) => {
    const { prompt } = req.body
    const response = await getTitleAndDescription(
      prompt + 'Give a json object with title (around 60-70 characters) and description (at least 200 words) ',
    )

    const { title, description } = JSON.parse(response)

    res.status(200).json({
      title,
      description,
    })
  }),
)

export default router
