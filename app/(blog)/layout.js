import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export const metadata = {
  title: 'Blog | Gravitiq',
  description:
    'Insights on AI, business automation, and growth strategies from the Gravitiq team.',
};

export default function BlogLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
