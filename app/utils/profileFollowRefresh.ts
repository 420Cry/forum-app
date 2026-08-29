/** Bumped when the viewer follows/unfollows so profile pages refetch counts. */
export function useProfileFollowRefresh() {
  const token = useState('forum-profile-follow-refresh', () => 0)

  function notifyFollowingChanged() {
    token.value += 1
  }

  return { token, notifyFollowingChanged }
}
