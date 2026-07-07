import PrintPanel from '@/components/PrintPanel';

export default function PrintPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h2 className="text-base font-medium mb-1">Baskı</h2>
      <p className="text-xs text-gray-500 mb-5">
        Menünüzü A4 veya A5 kağıda baskıya hazır PDF olarak çıktı alın.
      </p>
      <PrintPanel slug={params.slug} />
    </div>
  );
}
