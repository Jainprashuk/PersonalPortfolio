import DraftsAdmin from "./DraftsAdmin";

export const metadata = {
  title: "Draft review",
  robots: { index: false, follow: false },
};

// Production admin, gated by OTP login (handled inside DraftsAdmin). All data
// operations go through the Portfolio_Backend, so this works on the live site.
export default function AdminDraftsPage() {
  return <DraftsAdmin />;
}
