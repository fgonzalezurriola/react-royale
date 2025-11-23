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

test.describe('Submission E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(APP_URL)
    })

    test('Can create a submission for an active hackaton', async ({ page }) => {
        const username = `submitter-${Date.now()}`
        const password = 'testpassword'
        await signupTestUser(page, username, password)
        await loginWith(page, username, password)

        const hackatitle = `Submission Hackaton ${Date.now()}` // EN un universo paralelo le hubiera puesto hackacock
        await page.getByRole('button', { name: 'Create Hackaton' }).click()
        await page.waitForURL('**/create-hackathon')

        await page.getByPlaceholder('Hackathon title').fill(hackatitle)
        await page.getByPlaceholder('Describe the hackathon...').fill('Submission test hackaton')

        const today = new Date()
        await selectDate(page, 'Pick start date', today)
        await selectDate(page, 'Pick end date', addDays(today, 7))
        await selectDate(page, 'Pick start voting date', addDays(today, 8))
        await selectDate(page, 'Pick end voting date', addDays(today, 10))

        await page.getByRole('button', { name: 'Create Hackathon' }).click()
        await page.goto(APP_URL)

        await page.getByRole('link', { name: hackatitle, exact: false }).first().click()
        await page.getByRole('button', { name: /participate/i }).click()
        await expect(page).toHaveURL(/.*\/submit/)

        const submissionTitle = `Test Submission ${Date.now()}`
        const jsxCode = '<div style={{ padding: "20px", backgroundColor: "#f0f0f0" }}>Test Component</div>'

        const titleInput = page.getByPlaceholder(/title/i).or(page.locator('input[name="title"]')).first()
        await titleInput.fill(submissionTitle)

        const codeInput = page.getByPlaceholder(/jsx|code/i).or(page.locator('textarea[name="jsxCode"]')).first()
        await codeInput.fill(jsxCode)

        await page.getByRole('button', { name: /submit/i }).click()
        await expect(page).toHaveURL(/.*hackaton\/.*/)
        await expect(page.locator(`text=${submissionTitle}`)).toBeVisible({ timeout: 10000 })
    })

    test('can list submissions for a hackaton', async ({ page }) => {
        const username = `lister-${Date.now()}`
        const password = 'testpassword'
        await signupTestUser(page, username, password)
        await loginWith(page, username, password)

        const hackaTitle = `List Submissions Hackaton ${Date.now()}` // Hackacooooooock
        await page.getByRole('button', { name: 'Create Hackaton' }).click()
        await page.waitForURL('**/create-hackathon')

        await page.getByPlaceholder('Hackathon title').fill(hackaTitle)
        await page.getByPlaceholder('Describe the hackathon...').fill('List submissions test')

        const today = new Date()
        await selectDate(page, 'Pick start date', today)
        await selectDate(page, 'Pick end date', addDays(today, 7))
        await selectDate(page, 'Pick start voting date', addDays(today, 8))
        await selectDate(page, 'Pick end voting date', addDays(today, 10))

        await page.getByRole('button', { name: 'Create Hackathon' }).click()
        await page.goto(APP_URL)

        await page.getByRole('link', { name: hackaTitle, exact: false }).first().click()
        await page.getByRole('button', { name: /participate/i }).click()

        const submissionTitle = `Listed Submission ${Date.now()}`
        const titleInput = page.getByPlaceholder(/title/i).or(page.locator('input[name="title"]')).first()
        await titleInput.fill(submissionTitle)

        const codeInput = page.getByPlaceholder(/jsx|code/i).or(page.locator('textarea[name="jsxCode"]')).first()
        await codeInput.fill('<div>Listed Component</div>')

        await page.getByRole('button', { name: /submit/i }).click()

        await expect(page.locator(`text=${submissionTitle}`)).toBeVisible()
        await expect(page.getByText(`by ${username}`)).toBeVisible()
    })

    test('Shows empty state when hackathon has no submissions', async ({ page }) => {
        const username = `empty-${Date.now()}`
        const password = 'testpassword'
        await signupTestUser(page, username, password)
        await loginWith(page, username, password)

        const hackTitle = `Empty Hack ${Date.now()}`
        await page.getByRole('button', { name: 'Create Hackathon' }).click()
        await page.waitForURL('**/create-hackathon')

        await page.getByPlaceholder('Hackathon title').fill(hackTitle)
        await page.getByPlaceholder('Describe the hackathon...').fill('Empty state test')

        const today = new Date()
        await selectDate(page, 'Pick start date', today)
        await selectDate(page, 'Pick end date', addDays(today, 7))
        await selectDate(page, 'Pick start voting date', addDays(today, 8))
        await selectDate(page, 'Pick end voting date', addDays(today, 10))

        await page.getByRole('button', { name: 'Create Hackathon' }).click()
        await page.goto(APP_URL)

        await page.getByRole('link', { name: hackTitle, exact: false }).first().click()
        await expect(page.getByText('No submissions yet')).toBeVisible()
    })

    test('Cannot submit when not authenticated', async ({ page }) => {
        const username = `auth-test-${Date.now()}`
        const password = 'testpassword'
        await signupTestUser(page, username, password)
        await loginWith(page, username, password)

        const hackaTitle = `Auth Hacka(cock) ${Date.now()}`
        await page.getByRole('button', { name: 'Create Hackathon' }).click()
        await page.waitForURL('**/create-hackathon')

        await page.getByPlaceholder('Hackathon title').fill(hackaTitle)
        await page.getByPlaceholder('Describe the hackathon...').fill('Auth test')

        const today = new Date()
        await selectDate(page, 'Pick start date', today)
        await selectDate(page, 'Pick end date', addDays(today, 7))
        await selectDate(page, 'Pick start voting date', addDays(today, 8))
        await selectDate(page, 'Pick end voting date', addDays(today, 10))

        await page.getByRole('button', { name: 'Create Hackathon' }).click()
        await page.goto(APP_URL)

        await page.getByRole('link', { name: hackaTitle, exact: false }).first().click()
        const hackathonUrl = page.url()
        const hackathonId = hackathonUrl.split('/').pop()

        await page.getByTestId('logout-button').click()
        await page.goto(`${APP_URL}/hackaton/${hackathonId}/submit`)

        await expect(page).not.toHaveURL(/.*\/submit/)
    })
})