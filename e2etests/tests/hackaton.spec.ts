import { test, expect } from '@playwright/test'
import { loginWith, signupTestUser } from './helper'
import type { Page } from '@playwright/test'

test.describe('Login E2E Tests', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:3000')
    await signupTestUser(page, 'testuser', 'testpassword')
    if (await page.getByText('to be unique').isVisible()) {
      await loginWith(page, 'testuser', 'testpassword')
    }
  })
})
