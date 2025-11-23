import { Page } from '@playwright/test'

const APP_URL = 'http://localhost:5173'

export const loginWith = async (page: Page, username: string, password: string) => {
    await page.goto(APP_URL)
    const logoutButton = page.getByTestId('logout-button')
    if (await logoutButton.isVisible().catch(() => false)) {
        return
    }

    await page.getByTestId('login-link').click()
    await page.getByPlaceholder('Username').fill(username)
    await page.getByPlaceholder('Password').first().fill(password)
    await page.getByTestId('login-button').click()
    await page.waitForSelector('[data-testid="logout-button"]')
}

export const signupTestUser = async (page: Page, username: string, password: string, fullName = 'Playwright User') => {
    await page.goto(APP_URL)
    await page.getByTestId('signup-link').click()
    await page.getByPlaceholder('Username').fill(username)
    await page.getByPlaceholder('Full Name').fill(fullName)
    await page.getByPlaceholder('Password').first().fill(password)
    await page.getByPlaceholder('Confirm Password').fill(password)
    await page.getByTestId('signup-button').click()
    await page.waitForLoadState('networkidle')

    if (page.url().includes('/signup')) {
        await loginWith(page, username, password)
        return
    }

    await page.waitForSelector('[data-testid="logout-button"]')
}
