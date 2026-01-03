"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "motion/react";
import { useAlert } from "@/lib/AlertContext";
import { HomePageWrapper } from "@/components/page-components/PageWrapper";
import LoadingFlower from "@/components/loading-components/LoadingFlower";
import TextAnimation from "@/components/ui/text/TextAnimation";
import RippleEffect from "@/components/ui/effects/RippleEffect";
import MainBtn from "@/components/ui/buttons/MainBtn";

export default function LoginPage() {
  const router = useRouter();
  const alert = useAlert();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      router.replace("/");
      alert.show("Logged in ✅", "success");
    } catch (err) {
      alert.show(`Login failed ❌`, "error");
    }
  };

  return (
    <HomePageWrapper>
      <LoadingFlower />

      <TextAnimation
        delay={4.5}
        text="Sign in Bea <3"
        className="text-5xl text-center font-semibold font-sec tracking-widest p-4 mb-8"
      />

      <motion.form
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.75, delay: 4.5 }}
        className="w-full max-w-sm space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
      >
        <div className="rounded-2xl shadow-sm space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            transition={{
              type: "spring",
              stiffness: 200,
              delay: 4.5,
            }}
          >
            <RippleEffect className="w-full">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border-2 border-main placeholder-main text-main rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm duration-300"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </RippleEffect>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            transition={{
              type: "spring",
              stiffness: 200,
              delay: 4.7,
            }}
          >
            <RippleEffect className="w-full">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border-2 border-main placeholder-main text-main rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm duration-300"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </RippleEffect>
          </motion.div>
        </div>

        <MainBtn onClick={login} className="w-full bg-main! rounded-md">
          Sign in
        </MainBtn>
      </motion.form>
    </HomePageWrapper>
  );
}
