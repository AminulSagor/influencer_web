"use client";
import { useLogout } from "@/hooks/useLogout";
import React from "react";

const Page = () => {
  const { logout } = useLogout();
  return (
    <div>
      <button onClick={logout}>click</button>
    </div>
  );
};

export default Page;
