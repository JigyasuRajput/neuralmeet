"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client"; 
import { useState } from "react";

export default function Home() {
  const { data: session } = authClient.useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    authClient.signUp.email({
      email,
      password,
      name,
    }, {
      onError: (error) => {
        window.alert("something went wrong: ");
      },
      onSuccess: () => {
        window.alert("Success!");
      }
    });
  }

  const onLogin = () => {
    authClient.signIn.email({
      email,
      password,
    }, {
      onError: (error) => {
        window.alert("something went wrong: ");
      },
      onSuccess: () => {
        window.alert("Success!");
      }
    });
  }

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>Welcome, {session.user.name}!</h1>
        <Button onClick={() => authClient.signOut()}>Sign Out</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-10 min-h-screen p-8">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>
          <Input
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
          placeholder="email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          />
          <Input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
          <Input
          placeholder="confirm password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={onSubmit} className="w-full">
            Create User
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <Input
          placeholder="email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          />
          <Input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={onLogin} className="w-full">
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};