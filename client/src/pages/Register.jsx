import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
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
      await api.post("/auth/register", formData);
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed.");
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
          {/* Register Card */}{" "}
          <Card className="border-white/[0.08] bg-[#0d0f12] text-white shadow-2xl">
            {" "}
            <CardHeader className="space-y-2 pb-6 text-center">
              {" "}
              <CardTitle className="text-2xl font-bold">
                {" "}
                Create your account{" "}
              </CardTitle>{" "}
              <CardDescription className="text-sm text-zinc-400">
                {" "}
                Join the community and start sharing your ideas with
                developers.{" "}
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
              {/* Register Form */}{" "}
              <form onSubmit={handleSubmit} className="space-y-5">
                {" "}
                {/* Name */}{" "}
                <div className="space-y-2">
                  {" "}
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-zinc-200"
                  >
                    {" "}
                    Name{" "}
                  </label>{" "}
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    autoComplete="name"
                    className="h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-600 focus-visible:ring-white/20"
                  />{" "}
                </div>{" "}
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
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-zinc-200"
                  >
                    {" "}
                    Password{" "}
                  </label>{" "}
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    autoComplete="new-password"
                    className="h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-600 focus-visible:ring-white/20"
                  />{" "}
                </div>{" "}
                {/* Register Button */}{" "}
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full bg-white font-semibold text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {" "}
                  {loading ? "Creating account..." : "Create account"}{" "}
                </Button>{" "}
              </form>{" "}
              {/* Login */}{" "}
              <p className="mt-7 text-center text-sm text-zinc-400">
                {" "}
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-white underline underline-offset-4 hover:text-zinc-300"
                >
                  {" "}
                  Log in{" "}
                </Link>{" "}
              </p>{" "}
            </CardContent>{" "}
          </Card>{" "}
          {/* Footer */}{" "}
          <p className="mt-6 text-center text-xs leading-5 text-zinc-600">
            {" "}
            By creating an account, you agree to our{" "}
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
export default Register;
