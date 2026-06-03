"use client";

import { useState } from "react";
import { Button, Description, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignUpPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        const image = formData.get("image") as string; // 👈 ১. ইমেজ ইউআরএল কালেক্ট করুন

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            setLoading(false);
            return;
        }

        const { error: authError } = await authClient.signUp.email({
            email,
            password,
            name,
            image, // 👈 ২. Better-Auth এ পাস করে দিন
            callbackURL: "/"
        });

        setLoading(false);

        if (authError) {
            toast.error(authError.message || "Something went wrong!");
        } else {
            toast.success("Account created successfully!");
            router.push("/");
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
            {/* 🌌 গ্লাস লুক আরও ফুটিয়ে তোলার জন্য ব্যাকগ্রাউন্ড গ্লো */}
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>

            {/* 🔮 মেইন কার্ড */}
            <div className="w-full max-w-md bg-[#1c1c1e]/80 backdrop-blur-xl p-8 rounded-2xl border border-white/[0.12] shadow-[0_12px_40px_0_rgba(0,0,0,0.5)] space-y-6 z-10">

                <div className="space-y-1 text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
                    <p className="text-sm text-gray-400">Join our YouTube clone community</p>
                </div>

                <Form className="flex flex-col gap-5 w-full" onSubmit={onSubmit}>

                    {/* Name Field */}
                    <TextField isRequired name="name" type="text" className="w-full flex flex-col gap-1.5">
                        <Label className="text-gray-200 text-sm font-semibold">Full Name</Label>
                        <Input
                            placeholder="Mohiuddin Shanto"
                            className="bg-white/[0.07] hover:bg-white/[0.1] focus-within:!bg-white/[0.1] border-2 border-white/[0.15] focus-within:border-white/50 rounded-xl transition duration-200 h-12 text-white placeholder:text-gray-500 px-3 flex items-center"
                        />
                        <FieldError className="text-red-400 text-xs mt-1 font-medium" />
                    </TextField>

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
                        <Label className="text-gray-200 text-sm font-semibold">Email</Label>
                        <Input
                            placeholder="shanto@example.com"
                            className="bg-white/[0.07] hover:bg-white/[0.1] focus-within:!bg-white/[0.1] border-2 border-white/[0.15] focus-within:border-white/50 rounded-xl transition duration-200 h-12 text-white placeholder:text-gray-500 px-3 flex items-center"
                        />
                        <FieldError className="text-red-400 text-xs mt-1 font-medium" />
                    </TextField>

                    {/* Image Field */}
                    {/* Profile Image URL Field */}
                    <TextField name="image" type="url" className="w-full flex flex-col gap-1.5">
                        <Label className="text-gray-200 text-sm font-semibold">Profile Image URL</Label>
                        <Input
                            placeholder="https://example.com/avatar.jpg"
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
                        validate={(value) => {
                            if (value.length < 8) return "Password must be at least 8 characters";
                            if (!/[A-Z]/.test(value)) return "Must contain at least one uppercase letter";
                            if (!/[0-9]/.test(value)) return "Must contain at least one number";
                            return null;
                        }}
                    >
                        <Label className="text-gray-200 text-sm font-semibold">Password</Label>
                        <Input
                            placeholder="Enter your password"
                            className="bg-white/[0.07] hover:bg-white/[0.1] focus-within:!bg-white/[0.1] border-2 border-white/[0.15] focus-within:border-white/50 rounded-xl transition duration-200 h-12 text-white placeholder:text-gray-500 px-3 flex items-center"
                        />
                        <Description className="text-gray-400 text-[11px] mt-0.5 leading-tight">
                            At least 8 characters, 1 uppercase, 1 number
                        </Description>
                        <FieldError className="text-red-400 text-xs mt-1 font-medium" />
                    </TextField>

                    {/* Confirm Password Field */}
                    <TextField isRequired name="confirmPassword" type="password" className="w-full flex flex-col gap-1.5">
                        <Label className="text-gray-200 text-sm font-semibold">Confirm Password</Label>
                        <Input
                            placeholder="Repeat your password"
                            className="bg-white/[0.07] hover:bg-white/[0.1] focus-within:!bg-white/[0.1] border-2 border-white/[0.15] focus-within:border-white/50 rounded-xl transition duration-200 h-12 text-white placeholder:text-gray-500 px-3 flex items-center"
                        />
                        <FieldError className="text-red-400 text-xs mt-1 font-medium" />
                    </TextField>

                    <Button type="submit" isDisabled={loading} className="w-full mt-2 bg-white text-black font-bold hover:bg-gray-200 h-12 rounded-xl transition shadow-md text-sm">
                        {loading ? "Creating account..." : "Sign Up"}
                    </Button>
                </Form>

                <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-white/[0.12]"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-wider font-medium">Or continue with</span>
                    <div className="flex-grow border-t border-white/[0.12]"></div>
                </div>

                <Button
                    onClick={handleGoogleSignIn}
                    className="w-full bg-[#27272a]/80 hover:bg-[#3f3f46] text-white flex items-center justify-center gap-3 h-12 rounded-xl border-2 border-white/[0.1] transition duration-200 font-semibold text-sm"
                >
                    <FcGoogle className="h-5 w-5" />
                    <span>Sign up with Google</span>
                </Button>

                <p className="text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-white hover:underline font-bold">
                        Sign In
                    </Link>
                </p>

            </div>
        </div>
    );
}
