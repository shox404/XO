"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { InputGroupInput, InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Key, Check, LoaderIcon } from "lucide-react";

export default function AuthPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const router = useRouter();

  const { user, loading, sentEmail, requestCode, verifyCode } = useAuthStore();

  useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  const handleRequestCode = async () => {
    if (!email) return;

    if (email === sentEmail) {
      setStep(2);
      return;
    }

    await requestCode(email);
    setStep(2);
  };

  const handleVerifyCode = async () => {
    if (!code) return;
    await verifyCode(email, code);
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100dvh-49px)] px-4">
      <Card className="w-full max-w-md shadow-lg border rounded-lg">
        <CardHeader>
          <CardTitle className="text-center">
            {step === 1 ? "Login with Email" : "Enter the Code"}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1
              ? "We will send a 6-digit code to your email"
              : "Check your email and enter the code"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <InputGroup>
                <InputGroupAddon>
                  <Mail className="text-gray-400 w-4 h-4" />
                </InputGroupAddon>
                <InputGroupInput
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
              <Button
                className="w-full flex items-center justify-center gap-2"
                onClick={handleRequestCode}
                disabled={loading || !email}
              >
                {loading
                  ? <div className="flex items-center gap-1"><LoaderIcon className="animate-spin" /> Sending</div>
                  : "Send Code"}
                {!loading && <Check className="w-4 h-4" />}
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <InputGroup>
                <InputGroupAddon>
                  <Key className="text-gray-400 w-4 h-4" />
                </InputGroupAddon>
                <InputGroupInput
                  type="text"
                  placeholder="6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </InputGroup>
              <Button
                className="w-full"
                onClick={handleVerifyCode}
                disabled={loading || !code}
              >
                {loading ? "Verifying..." : "Login"}
              </Button>
              <Button
                variant="link"
                className="w-full mt-2"
                onClick={() => {
                  setStep(1);
                  setCode("");
                }}
              >
                Change Email
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
