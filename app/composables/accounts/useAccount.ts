const profileExample = ref(
  [
    {
      id: '1',
      name: 'Dao Nguyen',
      subtitle: 'Founder / Personal Account',
      location: 'Vietnam',
      avatar: '',
      views: '100',
    },
    {
      id: '2',
      name: 'HelloWorld',
      subtitle: 'Climate / Preseed',
      location: 'Remote',
      avatar: '',
      views: '1000',
      connections: '200',
    },
  ].map(profile => ({
    ...profile,
    prefix: profile.name
      .split(' ')
      .map(l => l[0])
      .join(''),
    avatarColor: getAvatarColor(profile.name),
    avatarLoadFailed: false,
  })),
)

export const useAccount = () => {
  const activeAccountId = useState(
    'active-account-id',
    (): null | string => '1',
  )

  const activeAccount = computed(() => {
    return profileExample.value.find(p => p.id === activeAccountId.value)
  })

  const handleActive = (accountId: string) => {
    activeAccountId.value = accountId
  }

  const handleAvatarError = (name: string) => {
    const profile = profileExample.value.find(p => p.name === name)
    if (profile) profile.avatarLoadFailed = true
  }

  return {
    handleAvatarError,
    activeAccount,
    handleActive,
    profileExample,
    activeAccountId,
  }
}
