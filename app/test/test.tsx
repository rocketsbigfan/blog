"use client";
import useTestFetch from "./useTestFetch";

export default function Test() {
  useTestFetch()

  return (
    <div>
      <h1>Test Component</h1>
      <p>This is a test component to verify the setup.</p>
    </div>
  );
}