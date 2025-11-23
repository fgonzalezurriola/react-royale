import { test, expect } from '@playwright/test'
import { signupTestUser } from './helper'

const APP_URL = 'http://localhost:5173'

test.describe('Login E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(APP_URL)
        await signupTestUser(page, 'testuser', 'testpassword')
        const logoutButton = page.getByTestId('logout-button')
        if (await logoutButton.isVisible().catch(() => false)) {
            await logoutButton.click()
        }
    })

    test('Login with valid credentials', async ({ page }) => {
        await page.goto(APP_URL)
        await page.getByTestId('login-link').click()
        await page.getByPlaceholder('Username').fill('testuser')
        await page.getByPlaceholder('Password').first().fill('testpassword')
        await page.getByTestId('login-button').click()
        await expect(page.locator('text=Login successful!')).toBeVisible()
        await expect(page.getByText('testuser')).toBeVisible()
    })

    test('Login with invalid credentials', async ({ page }) => {
        await page.getByTestId('login-link').click()
        await page.getByPlaceholder('Username').fill('invaliduser')
        await page.getByPlaceholder('Password').first().fill('wrongpassword')
        await page.getByTestId('login-button').click()
        await expect(page.locator('text=/invalid/i')).toBeVisible()
    })

    test('Protected route redirects when not authenticated', async ({ page }) => {
        await page.goto(`${APP_URL}/profile`)
        await expect(page).not.toHaveURL(/.*profile/)
    })

    test('Protected route accessible when authenticated', async ({ page }) => {
        await page.getByTestId('login-link').click()
        await page.getByPlaceholder('Username').fill('testuser')
        await page.getByPlaceholder('Password').first().fill('testpassword')
        await page.getByTestId('login-button').click()
        await expect(page.locator('text=Login successful!')).toBeVisible()
        await page.waitForTimeout(500)

        await page.goto(`${APP_URL}/profile`)
        await expect(page).toHaveURL(/.*profile/)
        await expect(page.getByTestId('logout-button')).toBeVisible()
    })

    test('Logout successfully', async ({ page }) => {
        await page.getByTestId('login-link').click()
        await page.getByPlaceholder('Username').fill('testuser')
        await page.getByPlaceholder('Password').first().fill('testpassword')
        await page.getByTestId('login-button').click()
        await expect(page.getByTestId('logout-button')).toBeVisible()
        await page.getByTestId('logout-button').click()
        await expect(page.getByTestId('login-link')).toBeVisible()
    })

    test.afterEach(async ({ page }) => {
        await page.goto(APP_URL)
        const logoutButton = page.getByTestId('logout-button')
        if (await logoutButton.isVisible().catch(() => false)) {
            await logoutButton.click()
        }
    })
})