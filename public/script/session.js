// When the user logs in, store their session/token and expiration time in localStorage
function setSession(sessionData) {
    localStorage.setItem('session', JSON.stringify(sessionData));
  }
  
  // When the user logs out, remove their session/token from localStorage
  function clearSession() {
    localStorage.removeItem('session');
  }
  
  // Check if the session is still valid
  function isSessionValid() {
    const sessionData = localStorage.getItem('session');
    if (!sessionData) {
      return false; // Session is not present
    }
    const { expiration } = JSON.parse(sessionData);
    const currentTime = new Date().getTime();
    return currentTime < expiration;
  }
  
  // Attach an event listener to the beforeunload event
  window.addEventListener('beforeunload', function (e) {
    if (!isSessionValid()) {
      clearSession(); // Remove session if it's invalid
    }
  });
  
  // Example usage:
  // When the user logs in, set their session with an expiration time
  setSession({ token: 'your-auth-token', expiration: new Date().getTime() + 30 * 60 * 1000 /* 30 minutes */ });
  
  // When the user logs out, clear their session
  // clearSession();
  