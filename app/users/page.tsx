"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Search, User, X } from "lucide-react";

import { useUsersStore } from "@/store/user.store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/* ====================================================== */
/* PAGE */
/* ====================================================== */

export default function Page() {
  const { users, getUsers } = useUsersStore();
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (users.length === 0) getUsers();
  }, [users.length, getUsers]);

  const filtered = useMemo(() => {
    return users.filter((u) =>
      u.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [users, query]);

  /* ---------- iOS long press ---------- */
  function onPressStart(user: any) {
    longPressTimer.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(8);
      setSelectedUser(user);
    }, 380);
  }

  function onPressEnd() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Players
          </h1>
        </div>
      </div>

      {/* Layout */}
      <div className="mx-auto max-w-7xl px-6 py-6 grid md:grid-cols-[1fr_420px] gap-8">
        {/* LEFT — LIST */}
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search players"
              className="pl-11 h-12 rounded-xl"
            />
          </div>

          {/* Users list */}
          <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border">
            {filtered.map((user) => {
              const active = selectedUser?.$id === user.$id;

              return (
                <div
                  key={user.$id}
                  className={`
                    relative flex items-center gap-5
                    px-6 py-5
                    cursor-pointer select-none
                    transition-colors
                    ${active ? "bg-muted/40" : "hover:bg-muted/20"}
                  `}
                  onMouseDown={() => setSelectedUser(user)} // desktop click
                  onTouchStart={() => onPressStart(user)}   // mobile long press
                  onTouchEnd={onPressEnd}
                  onTouchMove={onPressEnd}
                >
                  {/* Active bar */}
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />
                  )}

                  <Avatar user={user} size={48} />

                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium truncate">
                      {user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Player profile
                    </p>
                  </div>

                  <div className="hidden md:block text-xs text-muted-foreground">
                    View
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — DESKTOP PROFILE ONLY */}
        <div className="hidden md:block">
          {selectedUser ? (
            <DesktopProfile
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
            />
          ) : (
            <div className="h-full rounded-3xl border border-dashed border-border flex items-center justify-center text-sm text-muted-foreground">
              Select a player
            </div>
          )}
        </div>
      </div>

      {/* MOBILE PROFILE ONLY */}
      <AnimatePresence>
        {selectedUser && (
          <div className="md:hidden">
            <MobileProfile
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ====================================================== */
/* DESKTOP PROFILE */
/* ====================================================== */

function DesktopProfile({ user, onClose }: any) {
  return (
    <Card className="rounded-3xl border border-border h-fit p-0">
      <ProfileContent user={user} onClose={onClose} />
    </Card>
  );
}

/* ====================================================== */
/* MOBILE PROFILE (iOS SHEET) */
/* ====================================================== */

function MobileProfile({ user, onClose }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/60 backdrop-blur-md"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="
          fixed bottom-0 left-0 right-0
          bg-background
          border-t border-border
          rounded-t-3xl
          max-h-[90vh]
          flex flex-col
        "
      >
        {/* Grab handle */}
        <div className="flex justify-center pt-3">
          <div className="h-1.5 w-10 rounded-full bg-muted" />
        </div>

        <ProfileContent user={user} onClose={onClose} mobile />
      </motion.div>
    </motion.div>
  );
}

/* ====================================================== */
/* PROFILE CONTENT */
/* ====================================================== */

function ProfileContent({ user, onClose, mobile }: any) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <p className="text-sm font-semibold uppercase tracking-wide">
          Player
        </p>
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X />
        </Button>
      </div>

      {/* Scrollable body */}
      <div
        className="px-6 py-8 space-y-10 overflow-y-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Identity */}
        <div className="flex flex-col items-center gap-5">
          <Avatar user={user} size={96} />
          <h2 className="text-2xl font-semibold">{user.name}</h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Points" value="12,430" />
          <Stat label="Rank" value="#42" />
          <Stat label="Games" value="128" />
          <Stat label="Last Active" value="2h ago" />
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full h-12 rounded-xl">
            Match History
          </Button>
        </div>
      </div>
    </>
  );
}

/* ====================================================== */
/* SMALL COMPONENTS */
/* ====================================================== */

function Avatar({ user, size }: any) {
  return (
    <div
      className="rounded-full border border-border overflow-hidden flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {user.avatar ? (
        <Image
          src={`/api/storage/preview/${user.avatar}`}
          alt={user.name}
          width={size}
          height={size}
        />
      ) : (
        <User className="text-muted-foreground" />
      )}
    </div>
  );
}

function Stat({ label, value }: any) {
  return (
    <div className="rounded-2xl border border-border p-4 text-center">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
