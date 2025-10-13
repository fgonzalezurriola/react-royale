const ProfilePage = () => {
  const hackatons = useHackatons()

  const activeHackatons = hackatons.filter((hackaton) => {
    const start = new Date(hackaton.startDate)
    const end = new Date(hackaton.endDate)
    const now = new Date()
    return start <= now && end >= now
  })
}
