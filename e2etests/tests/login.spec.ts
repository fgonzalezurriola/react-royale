import { test, expect, Page } from '@playwright/test'
import { loginWith, signupTestUser } from './helper'

test.describe('Login E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
    await signupTestUser(page, 'testuser', 'testpassword')
    if (await page.getByText('to be unique').isVisible()) {
      await loginWith(page, 'testuser', 'testpassword')
    }
  })

  test('Login with valid credentials', async ({ page }) => {
    await page.getByTestId('login-link').click()
    await page.getByPlaceholder('Username').fill('testuser')
    await page.getByPlaceholder('Password').fill('testpassword')
    await page.getByTestId('login-button').click()
    await expect(page.locator('text=Login successful!')).toBeVisible()
    await expect(page.getByText('testuser')).toBeVisible()
  })

  test.afterEach(async ({ page }) => {
    await page.getByTestId('login-link').click()
    await page.getByPlaceholder('Username').fill('testuser')
    await page.getByPlaceholder('Password').fill('testpassword')
    await page.getByTestId('login-button').click()
    await page.getByTestId('logout-button').click()
  })
})
