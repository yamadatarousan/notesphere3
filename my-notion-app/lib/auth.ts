export const login = async (credentials: { email: string; password: string }) => {
  const response = await fetch('http://localhost:8000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error('Login failed');
  const { token } = await response.json();
  localStorage.setItem('token', token);
  return token;
};