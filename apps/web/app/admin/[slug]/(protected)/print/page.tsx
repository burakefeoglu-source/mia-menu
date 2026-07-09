import PrintPanel from '@/components/PrintPanel';

export default function PrintPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h2 className="text-base font-medium mb-1">Baskı</h2>
      <p className="text-xs text-gray-500 mb-4">
        Menünüzü A4 veya A5 kağıda baskıya hazır PDF olarak çıktı alın.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2.5 mb-5">
        <span className="text-blue-500 flex-shrink-0 mt-0.5">📋</span>
        <p className="text-xs text-blue-800 leading-relaxed">
          <strong>Yasal zorunluluk:</strong> Lokanta, restoran, kafe ve benzeri işyerlerinde tarife ve
          fiyat listesinin işyerinin <strong>giriş kapısının önüne ve hizmet sunulan masaların
          üstüne</strong> tüketiciler tarafından kolaylıkla görülebilir şekilde asılması zorunludur.
          Aşağıdaki şablonlardan baskı alarak bu yükümlülüğü karşılayabilirsiniz.
        </p>
      </div>
      <PrintPanel slug={params.slug} />
    </div>
  );
}
