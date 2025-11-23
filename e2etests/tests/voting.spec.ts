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
    await expect(page.getByRole('button', { name: 'Voted!' })).toBeVisible()
  })

  // Jorge: por si no se ve por los comentarios, es casi lo mismo que el test anterior solo que se considera otra opcion.
  test('User can change their vote', async ({ page }) => {
    const username = `undecided-voter-${Date.now()}`
    const password = 'testpassword'

    await signupTestUser(page, username, password)
    await page.goto(APP_URL)

    await page.getByRole('link', { name: seeded.hackatonTitle, exact: false }).first().click()
    await expect(page.getByRole('heading', { name: seeded.hackatonTitle })).toBeVisible()

    // Aca vota por primera vez (inspirado en el caso anterior).
    await page.getByRole('link', { name: seeded.submissionTitle, exact: false }).first().click()
    await expect(page.getByRole('button', { name: 'Vote' })).toBeVisible()
    await page.getByRole('button', { name: 'Vote' }).click()
    await expect(page.getByRole('button', { name: 'Voted!' })).toBeVisible()

    // Aca retornamos al inicio para poder habilitar la opcion de poder votar de nuevo
    await page.goBack()

    // Vemos cuantas opciones subidas hay
    const submissionLinks = page.getByRole('link').filter({ hasText: /submission/i })
    const submissionCount = await submissionLinks.count()

    // Si hay mas de una, cambiamos el voto
    if (submissionCount > 1) {
      await submissionLinks.last().click()

      // Aca votamos y deberia aparecer el mensaje preguntando por cambiar el voto
      const voteButton = page.getByRole('button', { name: /vote/i })
      await expect(voteButton).toBeVisible()
      await voteButton.click()
      const changeButton = page.getByRole('button', { name: /Change Vote/i })
      await changeButton.click()
      await expect(changeButton).not.toBeVisible()

      // Verificamos qeu se haya cambiado
      await expect(page.getByRole('button', { name: 'Voted!' })).toBeVisible()
    }
  })
})
