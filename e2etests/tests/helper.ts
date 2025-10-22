import { Page } from '@playwright/test'

export const loginWith = async (page: Page, username: string, password: string) => {
  await page.getByTestId('login-link').click()
  await page.getByPlaceholder('Username').fill(username)
  await page.getByPlaceholder('Password').fill(password)
  await page.getByTestId('login-button').click()
}

export const signupTestUser = async (page: Page, username: string, password: string) => {
  await page.getByTestId('signup-link').click()
  await page.getByPlaceholder('Username').fill(username)
  await page.getByPlaceholder('Password').fill(password)
  await page.getByTestId('signup-button').click()
}
