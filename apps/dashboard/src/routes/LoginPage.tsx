import { login } from "../types/authService";

const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  setErr("");
  setLoading(true);

  try {
    const res = await login(email, password);
    nav("/"); // go to dashboard
  } catch (error: any) {
    setErr(error?.message || "Unexpected login error");
  } finally {
    setLoading(false);
  }
};
