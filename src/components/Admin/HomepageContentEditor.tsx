import React, { useMemo, useRef, useState } from 'react';
import { Image as ImageIcon, Link2, Loader2, Save, Sparkles, Trash2, Upload } from 'lucide-react';
import { Setting } from '../../types';
import { gasSync } from '../../services/gasSyncService';

interface HomepageContentEditorProps {
  settings: Setting[];
  onChange: (settings: Setting[]) => void;
  onSave?: () => void;
}

type Field = {
  key: string;
  label: string;
  description: string;
  multiline?: boolean;
  placeholder?: string;
};

type ImageField = {
  key: string;
  label: string;
  description: string;
  slot: string;
};

const GROUPS: Array<{ title: string; eyebrow: string; fields: Field[] }> = [
  {
    title: 'Announcement Bar', eyebrow: '01 — Bar Paling Atas', fields: [
      { key: 'ANNOUNCEMENT_BAR_TEXT', label: 'Teks Announcement', description: 'Teks yang tampil pada bar paling atas halaman.' },
      { key: 'PROMO_BANNER_TEXT', label: 'Teks Promo Pendamping', description: 'Teks pendamping announcement pada desktop.' },
      { key: 'ANNOUNCEMENT_BAR_ACTIVE', label: 'Tampilkan Announcement', description: 'Gunakan TRUE untuk tampil dan FALSE untuk menyembunyikan.' },
    ],
  },
  {
    title: 'Hero / Halaman Utama', eyebrow: '02 — Hero', fields: [
      { key: 'HERO_BADGE', label: 'Badge / Label', description: 'Label kecil di atas judul utama Hero.' },
      { key: 'HERO_TITLE', label: 'Judul Utama', description: 'Judul terbesar pada halaman depan.', multiline: true },
      { key: 'HERO_SUBTITLE', label: 'Deskripsi Hero', description: 'Paragraf pengantar di bawah judul Hero.', multiline: true },
      { key: 'HERO_PRODUCT_NAME', label: 'Nama Produk Unggulan', description: 'Nama produk yang ditonjolkan di Hero.' },
      { key: 'HERO_PRODUCT_TAGLINE', label: 'Tagline Produk', description: 'Tagline pendek produk unggulan.' },
    ],
  },
  {
    title: 'Our Story & Dedication', eyebrow: '03 — Cerita Brand', fields: [
      { key: 'OUR_STORY_EYEBROW', label: 'Label Section', description: 'Label kecil di atas judul.', multiline: false },
      { key: 'OUR_STORY_TITLE', label: 'Judul Our Story', description: 'Judul utama yang terlihat pada halaman depan.', multiline: true },
      { key: 'OUR_STORY_INTRO', label: 'Paragraf Pengantar', description: 'Paragraf tepat di bawah judul Our Story.', multiline: true },
      { key: 'OUR_STORY_DEDICATION', label: 'Teks Dedikasi', description: 'Teks pada blok garis vertikal di samping judul.', multiline: true },
      { key: 'OUR_STORY_QUOTE', label: 'Kutipan Penutup', description: 'Kutipan besar pada bagian penutup Our Story.', multiline: true },
      { key: 'OUR_STORY_PART1_TITLE', label: 'Cerita 01 — Judul', description: 'Gunakan karakter | untuk memisahkan baris/aksen.', multiline: true },
      { key: 'OUR_STORY_PART1_TEXT', label: 'Cerita 01 — Isi', description: 'Isi cerita bagian pertama.', multiline: true },
      { key: 'OUR_STORY_PART2_TITLE', label: 'Cerita 02 — Judul', description: 'Gunakan karakter | untuk memisahkan baris/aksen.', multiline: true },
      { key: 'OUR_STORY_PART2_TEXT', label: 'Cerita 02 — Isi', description: 'Isi cerita bagian kedua.', multiline: true },
      { key: 'OUR_STORY_PART2_QUOTE', label: 'Cerita 02 — Kutipan', description: 'Kutipan pendek pada blok aksen.', multiline: true },
      { key: 'OUR_STORY_CTA_TEXT', label: 'Teks CTA', description: 'Teks link untuk menelusuri cerita.' },
    ],
  },
  {
    title: 'Tentang Kami', eyebrow: '04 — About', fields: [
      { key: 'ABOUT_EYEBROW', label: 'Label Section', description: 'Label kecil di atas judul About.' },
      { key: 'ABOUT_TITLE', label: 'Judul About', description: 'Judul utama bagian Tentang Kami.', multiline: true },
      { key: 'ABOUT_DESCRIPTION', label: 'Paragraf 01', description: 'Paragraf pembuka Tentang Kami.', multiline: true },
      { key: 'ABOUT_DESCRIPTION_2', label: 'Paragraf 02', description: 'Paragraf tentang Ikan Bawis.', multiline: true },
      { key: 'ABOUT_DESCRIPTION_3', label: 'Paragraf 03', description: 'Paragraf visi BONLES / Borneo to the world.', multiline: true },
      { key: 'ABOUT_VALUE_1_TITLE', label: 'Nilai 01 — Judul', description: 'Judul kartu nilai pertama.' },
      { key: 'ABOUT_VALUE_1_TEXT', label: 'Nilai 01 — Deskripsi', description: 'Deskripsi kartu nilai pertama.', multiline: true },
      { key: 'ABOUT_VALUE_2_TITLE', label: 'Nilai 02 — Judul', description: 'Judul kartu nilai kedua.' },
      { key: 'ABOUT_VALUE_2_TEXT', label: 'Nilai 02 — Deskripsi', description: 'Deskripsi kartu nilai kedua.', multiline: true },
      { key: 'ABOUT_VALUE_3_TITLE', label: 'Nilai 03 — Judul', description: 'Judul kartu nilai ketiga.' },
      { key: 'ABOUT_VALUE_3_TEXT', label: 'Nilai 03 — Deskripsi', description: 'Deskripsi kartu nilai ketiga.', multiline: true },
      { key: 'ABOUT_VALUE_4_TITLE', label: 'Nilai 04 — Judul', description: 'Judul kartu nilai keempat.' },
      { key: 'ABOUT_VALUE_4_TEXT', label: 'Nilai 04 — Deskripsi', description: 'Deskripsi kartu nilai keempat.', multiline: true },
    ],
  },
];

const IMAGE_FIELDS: ImageField[] = [
  { key: 'HERO_IMAGE_URL', label: 'Gambar Hero Utama', description: 'Gambar utama pada Hero halaman depan.', slot: 'hero-main' },
  { key: 'OUR_STORY_IMAGE_URL', label: 'Gambar Our Story Utama', description: 'Gambar panorama pada pembuka Our Story.', slot: 'our-story-main' },
  { key: 'OUR_STORY_PART1_IMAGE_URL', label: 'Gambar Cerita 01', description: 'Gambar pada bagian Rooted in Borneo.', slot: 'our-story-part1' },
  { key: 'OUR_STORY_PART2_IMAGE_URL', label: 'Gambar Cerita 02', description: 'Gambar produk Ikan Bawis / Modern Snack.', slot: 'our-story-part2' },
  { key: 'OUR_STORY_PART3_IMAGE_URL', label: 'Gambar Cerita 03', description: 'Gambar Sambal Bawang Dayak / Signature Dipping Sachet.', slot: 'our-story-part3' },
  { key: 'ABOUT_IMAGE_URL', label: 'Gambar Tentang Kami', description: 'Gambar visual pada bagian Tentang Kami.', slot: 'about-main' },
];

const FALLBACKS: Record<string, string> = {
  ANNOUNCEMENT_BAR_TEXT: 'Snack Tinggi Protein & Oleh-Oleh Khas Nusantara',
  PROMO_BANNER_TEXT: 'Pemesanan Langsung Terintegrasi WhatsApp',
  ANNOUNCEMENT_BAR_ACTIVE: 'TRUE',
  HERO_BADGE: 'Koleksi Resmi Kemasan Pouch Zipper',
  HERO_TITLE: 'Inovasi Snack Pouch Tinggi Protein & Amplang Borneo',
  HERO_SUBTITLE: 'Dibuat dari ikan tenggiri segar dan bahan lokal berkualitas dalam kemasan standing pouch zipper modern berstandar BPOM & HACCP.',
  HERO_PRODUCT_NAME: 'Keripik Ikan Bawis',
  HERO_PRODUCT_TAGLINE: 'High Protein Fish Crunch',
  OUR_STORY_EYEBROW: 'Our Story & Dedication',
  OUR_STORY_TITLE: 'Perjalanan Rasa Autentik Nusantara',
  OUR_STORY_INTRO: 'Dari kekayaan hasil perairan Kalimantan Timur, kami membawa pangan lokal Borneo ke dalam bentuk camilan modern yang memiliki nilai, karakter, dan cerita.',
  OUR_STORY_DEDICATION: 'Menghubungkan kekayaan alam Borneo dengan kreativitas pengolahan modern untuk menghadirkan pengalaman rasa yang autentik.',
  OUR_STORY_QUOTE: 'Kekayaan daerah bukan hanya untuk dikenang—tetapi bisa dikembangkan, dinikmati, dan dibawa lebih jauh melalui sebuah rasa.',
  OUR_STORY_PART1_TITLE: 'Berawal dari|Kekayaan Lokal',
  OUR_STORY_PART1_TEXT: 'Berawal dari kekayaan hasil perairan Kalimantan Timur, kami ingin membuktikan bahwa pangan lokal Borneo dapat diolah menjadi camilan modern yang memiliki nilai dan cerita.',
  OUR_STORY_PART2_TITLE: 'Ikan Bawis|dalam Bentuk Modern',
  OUR_STORY_PART2_TEXT: 'Ikan Bawis kami pilih dan olah menjadi keripik ikan tanpa tulang tengah, menghasilkan camilan yang renyah, praktis, dan kaya protein.',
  OUR_STORY_PART2_QUOTE: 'Sebuah bahan pangan lokal diberi sentuhan pengolahan modern tanpa kehilangan karakter dan cerita asalnya.',
  OUR_STORY_CTA_TEXT: 'Telusuri Cerita Kami',
  ABOUT_EYEBROW: 'Our Story',
  ABOUT_TITLE: 'Dari Borneo, diolah menjadi cerita yang bernilai.',
  ABOUT_DESCRIPTION: 'Berawal dari kekayaan hasil perairan Kalimantan Timur, kami ingin membuktikan bahwa pangan lokal Borneo dapat diolah menjadi camilan modern yang memiliki nilai dan cerita.',
  ABOUT_DESCRIPTION_2: 'Ikan Bawis kami pilih dan olah menjadi keripik ikan tanpa tulang tengah, sehingga menghasilkan camilan yang renyah, praktis, dan kaya protein.',
  ABOUT_DESCRIPTION_3: 'Melalui BONLES, kami ingin membawa cita rasa dan kekayaan pangan lokal Borneo lebih dekat dengan masyarakat Indonesia, sekaligus membuka cerita tentang potensi pangan lokal kepada dunia.',
  ABOUT_VALUE_1_TITLE: 'Khas Borneo', ABOUT_VALUE_1_TEXT: 'Berangkat dari kekayaan hasil perairan dan pangan lokal Kalimantan Timur.',
  ABOUT_VALUE_2_TITLE: 'Ikan Bawis', ABOUT_VALUE_2_TEXT: 'Diolah menjadi keripik ikan tanpa tulang tengah yang renyah, praktis, dan kaya protein.',
  ABOUT_VALUE_3_TITLE: 'Modern Craft', ABOUT_VALUE_3_TEXT: 'Pangan lokal diolah menjadi camilan modern dengan nilai dan pengalaman yang lebih tinggi.',
  ABOUT_VALUE_4_TITLE: 'From Borneo to the World', ABOUT_VALUE_4_TEXT: 'Membawa cerita, cita rasa, dan potensi pangan lokal Borneo lebih jauh.',
};

const settingValue = (settings: Setting[], key: string) => {
  const found = settings.find((item) => item.SETTING === key);
  return found?.VALUE ?? FALLBACKS[key] ?? '';
};

export const HomepageContentEditor: React.FC<HomepageContentEditorProps> = ({ settings, onChange, onSave }) => {
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const map = useMemo(() => {
    const result: Record<string, Setting> = {};
    settings.forEach((item) => { result[item.SETTING] = item; });
    return result;
  }, [settings]);

  const updateField = (key: string, value: string, description = 'Konten homepage BONLES.') => {
    const now = new Date().toISOString();
    const existingIndex = settings.findIndex((item) => item.SETTING === key);
    const next = [...settings];
    const nextSetting: Setting = { SETTING: key, VALUE: value, DESCRIPTION: description, UPDATED_AT: now };
    if (existingIndex >= 0) next[existingIndex] = { ...next[existingIndex], ...nextSetting };
    else next.push(nextSetting);
    onChange(next);
  };

  const handleImageUpload = async (field: ImageField, file: File) => {
    if (!file.type.startsWith('image/')) {
      window.alert('File yang dipilih harus berupa gambar.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      window.alert('Ukuran gambar maksimal 10 MB.');
      return;
    }
    setUploadingKey(field.key);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
        reader.readAsDataURL(file);
      });
      const result = await gasSync.uploadImageToDrive({
        categoryName: 'Homepage',
        sku: 'HOMEPAGE',
        base64,
        filename: `homepage-${field.slot}-${Date.now()}.${file.name.split('.').pop() || 'jpg'}`,
        imageSlot: field.slot,
      });
      if (!result.success || !result.data?.url) throw new Error(result.message || 'Upload gambar gagal.');
      updateField(field.key, result.data.url, field.description);
      window.alert('Gambar berhasil diunggah ke Google Drive. Klik "Simpan Konten Beranda" untuk menyimpan perubahan homepage.');
    } catch (error: any) {
      window.alert(error?.message || 'Gagal mengunggah gambar.');
    } finally {
      setUploadingKey(null);
      const input = inputRefs.current[field.key];
      if (input) input.value = '';
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-sm border border-[#C9A45C]/35 bg-gradient-to-r from-[#0D3429] to-[#09271F] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#D8B878]"><Sparkles className="h-4 w-4" /><span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">CMS Halaman Depan</span></div>
            <h3 className="mt-2 text-xl font-serif-luxury text-white">Edit Teks & Gambar Website</h3>
            <p className="mt-1 max-w-3xl text-xs leading-5 text-[#9FAFA7]">Teks dan URL gambar tersimpan sebagai Settings. Gambar upload akan masuk ke Google Drive, lalu URL-nya disimpan ke Google Sheets.</p>
          </div>
          {onSave && <button type="button" onClick={onSave} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm bg-[#C9A45C] px-4 py-2.5 text-xs font-bold text-black shadow-md hover:bg-[#D7B66F]"><Save className="h-4 w-4" />Simpan Konten Beranda</button>}
        </div>
      </div>

      <section className="overflow-hidden rounded-sm border border-[#245442]/45 bg-[#09271F]">
        <div className="border-b border-[#245442]/45 bg-[#0D3027] px-5 py-4"><span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#C9A45C]">05 — Media Homepage</span><h4 className="mt-1 text-lg font-serif-luxury text-white">Gambar & Media Website</h4><p className="mt-1 text-xs leading-5 text-[#81918A]">Anda dapat memasukkan URL gambar atau upload gambar langsung dari komputer. Upload akan disimpan ke Google Drive.</p></div>
        <div className="grid gap-5 p-5 lg:grid-cols-2">
          {IMAGE_FIELDS.map((field) => {
            const current = settingValue(settings, field.key);
            const busy = uploadingKey === field.key;
            return <div key={field.key} className="rounded-sm border border-[#245442]/45 bg-[#061B16] p-4">
              <div className="mb-3 flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-[#C9A45C]/30 bg-[#0D3027] text-[#D8B878]"><ImageIcon className="h-4 w-4" /></div><div><label className="block text-xs font-bold uppercase tracking-wider text-[#D8B878]">{field.label}</label><p className="mt-1 text-[11px] leading-5 text-[#81918A]">{field.description}</p></div></div>
              {current ? <div className="mb-3 overflow-hidden rounded-sm border border-[#245442]/45 bg-[#09271F]"><img src={current} alt={field.label} className="h-40 w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} /></div> : <div className="mb-3 flex h-40 items-center justify-center rounded-sm border border-dashed border-[#245442]/60 text-xs text-[#81918A]">Belum ada gambar</div>}
              <div className="relative"><Link2 className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#81918A]" /><input type="url" value={current} onChange={(e) => updateField(field.key, e.target.value, field.description)} placeholder="https://... atau /images/..." className="w-full rounded-sm border border-[#245442]/45 bg-[#09271F] py-2.5 pl-9 pr-3 text-xs text-white outline-none focus:border-[#C9A45C]" /></div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => inputRefs.current[field.key]?.click()} disabled={busy} className="inline-flex items-center gap-2 rounded-sm border border-[#C9A45C]/50 bg-[#0D3027] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#D8B878] hover:bg-[#103A2E] disabled:opacity-50">{busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}{busy ? 'Mengunggah...' : 'Upload dari Komputer'}</button>
                <input ref={(el) => { inputRefs.current[field.key] = el; }} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) void handleImageUpload(field, file); }} />
                <button type="button" onClick={() => updateField(field.key, '', field.description)} className="inline-flex items-center gap-2 rounded-sm border border-red-900/40 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-red-300 hover:bg-red-950/30"><Trash2 className="h-3.5 w-3.5" />Hapus URL</button>
              </div>
            </div>;
          })}
        </div>
      </section>

      {GROUPS.map((group) => <section key={group.title} className="overflow-hidden rounded-sm border border-[#245442]/45 bg-[#09271F]"><div className="border-b border-[#245442]/45 bg-[#0D3027] px-5 py-4"><span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#C9A45C]">{group.eyebrow}</span><h4 className="mt-1 text-lg font-serif-luxury text-white">{group.title}</h4></div><div className="grid gap-5 p-5 lg:grid-cols-2">{group.fields.map((field) => { const current = map[field.key]?.VALUE ?? FALLBACKS[field.key] ?? ''; return <div key={field.key} className={field.multiline ? 'lg:col-span-2' : ''}><label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#D8B878]">{field.label}</label><p className="mb-2 text-[11px] leading-5 text-[#81918A]">{field.description}</p>{field.multiline ? <textarea value={current} onChange={(e) => updateField(field.key, e.target.value, field.description)} placeholder={field.placeholder} rows={4} className="w-full resize-y rounded-sm border border-[#245442]/45 bg-[#061B16] px-3.5 py-3 text-sm leading-6 text-white outline-none transition-colors focus:border-[#C9A45C]" /> : <input type="text" value={current} onChange={(e) => updateField(field.key, e.target.value, field.description)} placeholder={field.placeholder} className="w-full rounded-sm border border-[#245442]/45 bg-[#061B16] px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#C9A45C]" />}</div>; })}</div></section>)}
    </div>
  );
};
