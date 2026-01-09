export function isLikedPage(): boolean {
  return (
    location.pathname.startsWith('/user/profile/') &&
    new URLSearchParams(location.search).get('tab') === 'liked'
  );
}
