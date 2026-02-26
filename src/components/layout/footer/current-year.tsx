"use client";

/** 
 * Renders the current year on the client 
 * to avoid Date in Server Components. 
 * */
export function CurrentYear() {
  return <>{new Date().getFullYear()}</>;
}
