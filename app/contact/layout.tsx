import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Premier Mobility",
  description:
    "Reach Premier Mobility at our head office in Pietermaritzburg or regional offices in Durban and Kempton Park. Call 086 100 2477.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
