export function showSubscriptionModal() {
  if (typeof window === 'undefined') return;
  
  // Navigate to the pricing page instead of showing a modal
  window.location.href = '/pricing';
}
