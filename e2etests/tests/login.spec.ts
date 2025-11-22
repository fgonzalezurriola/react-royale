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

  test.afterEach(async ({ page }) => {
    await page.goto(APP_URL)
    const logoutButton = page.getByTestId('logout-button')
    if (await logoutButton.isVisible().catch(() => false)) {
      await logoutButton.click()
    }
  })
})
