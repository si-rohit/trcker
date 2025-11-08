import { Suspense } from "react";
import RegisterClient from "./RegisterClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <RegisterClient />
    </Suspense>
  );
}
