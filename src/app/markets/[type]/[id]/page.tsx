import AssetDetailClient from "@/components/AssetDetailClient";

export async function generateStaticParams() {
  // For a PWA/Mobile app wrapper, we can pre-render a few popular ones
  // or just return an empty array if we want to rely on client-side fetching
  // but Next.js requires this for dynamic routes in 'output: export'
  return [
    { type: 'crypto', id: 'bitcoin' },
    { type: 'crypto', id: 'ethereum' },
    { type: 'crypto', id: 'solana' },
  ];
}

export default function AssetDetailPage({ params }: { params: { id: string; type: string } }) {
  return <AssetDetailClient id={params.id} type={params.type} />;
}
