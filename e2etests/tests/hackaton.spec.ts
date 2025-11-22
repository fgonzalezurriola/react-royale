import { test, expect, Page } from '@playwright/test'
import { loginWith, signupTestUser } from './helper'

const APP_URL = 'http://localhost:5173'

const addDays = (base: Date, days: number) => {
  const copy = new Date(base)
  copy.setDate(copy.getDate() + days)
  return copy
}

const selectDate = async (page: Page, placeholder: string, date: Date) => {
  const localeDate = date.toLocaleDateString('en-US')
  await page.getByRole('button', { name: new RegExp(placeholder, 'i') }).click()
  const dayButton = page.locator(`[data-day="${localeDate}"]`).first()
  await dayButton.waitFor({ state: 'visible' })
  await dayButton.click({ force: true })
}

test.describe('Hackathon creation E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL)
  })

  test('allows creating a hackathon that starts today', async ({ page }) => {
    const username = `hack-creator-${Date.now()}`
    const password = 'testpassword'
    await signupTestUser(page, username, password)
    await loginWith(page, username, password)
    await page.getByRole('button', { name: 'Create Hackathon' }).click()
    await page.waitForURL('**/create-hackathon', { timeout: 5000 })
    await expect(page.getByPlaceholder('Hackathon title')).toBeVisible()

    const hackTitle = `Same Day Hack ${Date.now()}`
    await page.getByPlaceholder('Hackathon title').fill(hackTitle)
    await page.getByPlaceholder('Describe the hackathon...').fill('Playwright test hackathon description')

    const today = new Date()
    await selectDate(page, 'Pick start date', today)
    await selectDate(page, 'Pick end date', addDays(today, 2))
    await selectDate(page, 'Pick start voting date', addDays(today, 3))
    await selectDate(page, 'Pick end voting date', addDays(today, 4))

    await page.getByRole('button', { name: 'Create Hackathon' }).click()
    await page.waitForURL('**/', { timeout: 5000 })

    await expect(page.getByRole('heading', { name: hackTitle })).toBeVisible()
  })
})
