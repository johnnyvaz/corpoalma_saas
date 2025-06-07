import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Alimentando Corpo e Alma - Programa de Saúde Cristã',
  description: 'Transforme sua relação com a saúde através de um programa de 5 semanas baseado nos princípios bíblicos de cuidado integral.',
  keywords: 'saúde cristã, programa bíblico, alimentação saudável, transformação, corpo e alma',
  authors: [{ name: 'Programa Alimentando Corpo e Alma' }],
  openGraph: {
    title: 'Alimentando Corpo e Alma - Programa de Saúde Cristã',
    description: 'Transforme sua relação com a saúde através de princípios bíblicos',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}