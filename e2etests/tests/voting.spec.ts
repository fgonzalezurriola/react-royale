import { test, expect } from '@playwright/test'
import { signupTestUser } from './helper'
import { cleanupVotingHackathon, closeDb, seedVotingHackathon } from './dbHelpers'

const APP_URL = 'http://localhost:5173'

test.describe('Voting flow', () => {
  let seeded: Awaited<ReturnType<typeof seedVotingHackathon>>

  test.beforeAll(async () => {
    seeded = await seedVotingHackathon()
  })

  test.afterAll(async () => {
    if (seeded?.hackatonId) {
      await cleanupVotingHackathon(seeded.hackatonId)
    }
    await closeDb()
  })

  test('user can vote for an existing submission', async ({ page }) => {
    const username = `voter-${Date.now()}`
    const password = 'testpassword'

    await signupTestUser(page, username, password)
    await page.goto(APP_URL)

    await page.getByRole('link', { name: seeded.hackatonTitle, exact: false }).first().click()
    await expect(page.getByRole('heading', { name: seeded.hackatonTitle })).toBeVisible()

    await page.getByRole('link', { name: seeded.submissionTitle, exact: false }).first().click()
    await expect(page.getByRole('button', { name: 'Vote' })).toBeVisible()

    await page.getByRole('button', { name: 'Vote' }).click()
    await expect(page.getByText('Vote recorded!')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Voted!' })).toBeVisible()
  })
})
