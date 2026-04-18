import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 bg-light">
        {children}
      </div>
      <Footer />
    </>
  );
}
