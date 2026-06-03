"use client";

import { useState } from "react";
import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Better-Auth এর মাধ্যমে ইমেইল ও পাসওয়ার্ড দিয়ে সাইন-ইন
        const { error: authError } = await authClient.signIn.email({
            email,
            password,
            callbackURL: "/"
        });

        setLoading(false);

        if (authError) {
            toast.error(authError.message || "Invalid email or password!");
        } else {
            toast.success("Welcome back! Logged in successfully.");
            router.push("/");
            router.refresh();
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/"
            });
        } catch {
            toast.error("Google sign in failed!");
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* 🌌 থিমের সাথে ম্যাচিং ব্যাকগ্রাউন্ড গ্লো (সাইন-আপের মতই ভাইব ধরে রাখতে) */}
            <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>

            {/* 🔮 মেইন কার্ড */}
            <div className="w-full max-w-md bg-[#1c1c1e]/80 backdrop-blur-xl p-8 rounded-2xl border border-white/[0.12] shadow-[0_12px_40px_0_rgba(0,0,0,0.5)] space-y-6 z-10">

                <div className="space-y-1 text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                    <p className="text-sm text-gray-400">Sign in to your YouTube clone account</p>
                </div>

                <Form className="flex flex-col gap-5 w-full" onSubmit={onSubmit}>

                    {/* Email Field */}
                    <TextField
                        isRequired
                        name="email"
                        type="email"
                        className="w-full flex flex-col gap-1.5"
                        validate={(value) => {
                            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                return "Please enter a valid email address";
                            }
                            return null;
                        }}
                    >
                        <Label className="text-gray-200 text-sm font-semibold">Email Address</Label>
                        <Input
                            placeholder="shanto@example.com"
                            className="bg-white/[0.07] hover:bg-white/[0.1] focus-within:!bg-white/[0.1] border-2 border-white/[0.15] focus-within:border-white/50 rounded-xl transition duration-200 h-12 text-white placeholder:text-gray-500 px-3 flex items-center"
                        />
                        <FieldError className="text-red-400 text-xs mt-1 font-medium" />
                    </TextField>

                    {/* Password Field */}
                    <TextField
                        isRequired
                        name="password"
                        type="password"
                        className="w-full flex flex-col gap-1.5"
                    >
                        <div className="flex items-center justify-between">
                            <Label className="text-gray-200 text-sm font-semibold">Password</Label>
                            <Link href="/forgot-password" className="text-xs text-blue-400 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <Input
                            placeholder="Enter your password"
                            className="bg-white/[0.07] hover:bg-white/[0.1] focus-within:!bg-white/[0.1] border-2 border-white/[0.15] focus-within:border-white/50 rounded-xl transition duration-200 h-12 text-white placeholder:text-gray-500 px-3 flex items-center"
                        />
                        <FieldError className="text-red-400 text-xs mt-1 font-medium" />
                    </TextField>

                    <Button 
                        type="submit" 
                        isDisabled={loading} 
                        className="w-full mt-2 bg-white text-black font-bold hover:bg-gray-200 h-12 rounded-xl transition shadow-md text-sm"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </Form>

                {/* Divider */}
                <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-white/[0.12]"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-wider font-medium">Or continue with</span>
                    <div className="flex-grow border-t border-white/[0.12]"></div>
                </div>

                {/* Google Sign In */}
                <Button
                    onClick={handleGoogleSignIn}
                    className="w-full bg-[#27272a]/80 hover:bg-[#3f3f46] text-white flex items-center justify-center gap-3 h-12 rounded-xl border-2 border-white/[0.1] transition duration-200 font-semibold text-sm"
                >
                    <FcGoogle className="h-5 w-5" />
                    <span>Sign in with Google</span>
                </Button>

                <p className="text-center text-sm text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-white hover:underline font-bold">
                        Sign Up
                    </Link>
                </p>

            </div>
        </div>
    );
}
