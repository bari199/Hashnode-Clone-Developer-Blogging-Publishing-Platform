import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import useAuth from "../hooks/useAuth.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/login", formData);
      const { token, user } = response.data;
      login(user, token);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#08090b] text-white">
      {" "}
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        {" "}
        <div className="w-full max-w-[420px]">
          {" "}
          {/* Brand */}{" "}
          <div className="mb-8 text-center">
            {" "}
            <Link to="/" className="inline-flex items-center gap-2">
              {" "}
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
                {" "}
                <span className="text-lg font-black">H</span>{" "}
              </div>{" "}
              <span className="text-xl font-bold tracking-tight">
                {" "}
                Hashnode{" "}
              </span>{" "}
            </Link>{" "}
          </div>{" "}
          {/* Login Card */}{" "}
          <Card className="border-white/[0.08] bg-[#0d0f12] text-white shadow-2xl">
            {" "}
            <CardHeader className="space-y-2 pb-6 text-center">
              {" "}
              <CardTitle className="text-2xl font-bold">
                {" "}
                Welcome back{" "}
              </CardTitle>{" "}
              <CardDescription className="text-sm text-zinc-400">
                {" "}
                Log in to continue writing and connecting with developers.{" "}
              </CardDescription>{" "}
            </CardHeader>{" "}
            <CardContent>
              {" "}
              {/* Error */}{" "}
              {error && (
                <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {" "}
                  {error}{" "}
                </div>
              )}{" "}
              {/* Login Form */}{" "}
              <form onSubmit={handleSubmit} className="space-y-5">
                {" "}
                {/* Email */}{" "}
                <div className="space-y-2">
                  {" "}
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-zinc-200"
                  >
                    {" "}
                    Email{" "}
                  </label>{" "}
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-600 focus-visible:ring-white/20"
                  />{" "}
                </div>{" "}
                {/* Password */}{" "}
                <div className="space-y-2">
                  {" "}
                  <div className="flex items-center justify-between">
                    {" "}
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-zinc-200"
                    >
                      {" "}
                      Password{" "}
                    </label>{" "}
                    <Link
                      to="/forgot-password"
                      className="text-xs text-zinc-400 transition hover:text-white"
                    >
                      {" "}
                      Forgot password?{" "}
                    </Link>{" "}
                  </div>{" "}
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-600 focus-visible:ring-white/20"
                  />{" "}
                </div>{" "}
                {/* Login Button */}{" "}
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full bg-white font-semibold text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {" "}
                  {loading ? "Logging in..." : "Log in"}{" "}
                </Button>{" "}
              </form>{" "}
              {/* Register */}{" "}
              <p className="mt-7 text-center text-sm text-zinc-400">
                {" "}
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-white underline underline-offset-4 hover:text-zinc-300"
                >
                  {" "}
                  Create an account{" "}
                </Link>{" "}
              </p>{" "}
            </CardContent>{" "}
          </Card>{" "}
          {/* Footer */}{" "}
          <p className="mt-6 text-center text-xs leading-5 text-zinc-600">
            {" "}
            By continuing, you agree to our{" "}
            <Link to="/terms" className="text-zinc-500 hover:text-zinc-300">
              {" "}
              Terms of Service{" "}
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-zinc-500 hover:text-zinc-300">
              {" "}
              Privacy Policy{" "}
            </Link>{" "}
            .{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default Login;
