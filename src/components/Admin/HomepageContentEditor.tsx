import React, { useMemo } from 'react';
import { Save, Sparkles } from 'lucide-react';
import { Setting } from '../../types';

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

const GROUPS: Array<{ title: string; eyebrow: string; fields: Field[] }> = [
  {
    title: 'Announcement Bar',
    eyebrow: '01 — Bar Paling Atas',
    fields: [
      { key: 'ANNOUNCEMENT_BAR_TEXT', label: 'Teks Announcement', description: 'Teks yang tampil pada bar paling atas halaman.', multiline: false },
      { key: 'PROMO_BANNER_TEXT', label: 'Teks Promo Pendamping', description: 'Teks pendamping announcement pada desktop.', multiline: false },
      { key: 'ANNOUNCEMENT_BAR_ACTIVE', label: 'Tampilkan Announcement', description: 'Gunakan TRUE untuk tampil dan FALSE untuk menyembunyikan.', multiline: false },
    ],
  },
  {
    title: 'Hero / Halaman Utama',
    eyebrow: '02 — Hero',
    fields: [
      { key: 'HERO_BADGE', label: 'Badge / Label', description: 'Label kecil di atas judul utama Hero.' },
      { key: 'HERO_TITLE', label: 'Judul Utama', description: 'Judul terbesar pada halaman depan.', multiline: true },
      { key: 'HERO_SUBTITLE', label: 'Deskripsi Hero', description: 'Paragraf pengantar di bawah judul Hero.', multiline: true },
      { key: 'HERO_PRODUCT_NAME', label: 'Nama Produk Unggulan', description: 'Nama produk yang ditonjolkan di Hero.' },
      { key: 'HERO_PRODUCT_TAGLINE', label: 'Tagline Produk', description: 'Tagline pendek produk unggulan.' },
    ],
  },
  {
    title: 'Our Story & Dedication',
    eyebrow: '03 — Cerita Brand',
    fields: [
      { key: 'OUR_STORY_EYEBROW', label: 'Label Section', description: 'Label kecil di atas judul.', multiline: false },
      { key: 'OUR_STORY_TITLE', label: 'Judul Our Story', description: 'Judul utama yang terlihat pada screenshot halaman depan.', multiline: true },
      { key: 'OUR_STORY_INTRO', label: 'Paragraf Pengantar', description: 'Paragraf tepat di bawah judul Our Story.', multiline: true },
      { key: 'OUR_STORY_DEDICATION', label: 'Teks Dedikasi', description: 'Teks pada blok garis vertikal di samping judul.', multiline: true },
      { key: 'OUR_STORY_QUOTE', label: 'Kutipan Penutup', description: 'Kutipan besar pada bagian penutup Our Story.', multiline: true },
      { key: 'OUR_STORY_PART1_TITLE', label: 'Cerita 01 — Judul', description: 'Gunakan karakter | untuk memisahkan baris/aksen. Contoh: Berawal dari|Kekayaan Lokal.', multiline: true },
      { key: 'OUR_STORY_PART1_TEXT', label: 'Cerita 01 — Isi', description: 'Isi cerita bagian pertama.', multiline: true },
      { key: 'OUR_STORY_PART2_TITLE', label: 'Cerita 02 — Judul', description: 'Gunakan karakter | untuk memisahkan baris/aksen.', multiline: true },
      { key: 'OUR_STORY_PART2_TEXT', label: 'Cerita 02 — Isi', description: 'Isi cerita bagian kedua.', multiline: true },
      { key: 'OUR_STORY_PART2_QUOTE', label: 'Cerita 02 — Kutipan', description: 'Kutipan pendek pada blok aksen.', multiline: true },
      { key: 'OUR_STORY_CTA_TEXT', label: 'Teks CTA', description: 'Teks link untuk menelusuri cerita.', multiline: false },
    ],
  },
  {
    title: 'Tentang Kami',
    eyebrow: '04 — About',
    fields: [
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

export const HomepageContentEditor: React.FC<HomepageContentEditorProps> = ({ settings, onChange, onSave }) => {
  const map = useMemo(() => {
    const result: Record<string, Setting> = {};
    settings.forEach((item) => { result[item.SETTING] = item; });
    return result;
  }, [settings]);

  const updateField = (field: Field, value: string) => {
    const now = new Date().toISOString();
    const existingIndex = settings.findIndex((item) => item.SETTING === field.key);
    const next = [...settings];
    const nextSetting: Setting = {
      SETTING: field.key,
      VALUE: value,
      DESCRIPTION: field.description,
      UPDATED_AT: now,
    };

    if (existingIndex >= 0) next[existingIndex] = { ...next[existingIndex], ...nextSetting };
    else next.push(nextSetting);
    onChange(next);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-sm border border-[#C9A45C]/35 bg-gradient-to-r from-[#0D3429] to-[#09271F] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#D8B878]">
              <Sparkles className="h-4 w-4" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">CMS Halaman Depan</span>
            </div>
            <h3 className="mt-2 text-xl font-serif-luxury text-white">Edit Teks Website Tanpa Menyentuh Kode</h3>
            <p className="mt-1 max-w-3xl text-xs leading-5 text-[#9FAFA7]">
              Semua field di bawah tersimpan sebagai Settings di Google Spreadsheet. Setelah disimpan, pengunjung akan membaca konten terbaru dari Spreadsheet.
            </p>
          </div>
          {onSave && (
            <button type="button" onClick={onSave} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm bg-[#C9A45C] px-4 py-2.5 text-xs font-bold text-black shadow-md shadow-[#C9A45C]/10 hover:bg-[#D7B66F]">
              <Save className="h-4 w-4" />
              Simpan Konten Beranda
            </button>
          )}
        </div>
      </div>

      {GROUPS.map((group) => (
        <section key={group.title} className="overflow-hidden rounded-sm border border-[#245442]/45 bg-[#09271F]">
          <div className="border-b border-[#245442]/45 bg-[#0D3027] px-5 py-4">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#C9A45C]">{group.eyebrow}</span>
            <h4 className="mt-1 text-lg font-serif-luxury text-white">{group.title}</h4>
          </div>
          <div className="grid gap-5 p-5 lg:grid-cols-2">
            {group.fields.map((field) => {
              const current = map[field.key]?.VALUE ?? FALLBACKS[field.key] ?? '';
              return (
                <div key={field.key} className={field.multiline ? 'lg:col-span-2' : ''}>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#D8B878]">{field.label}</label>
                  <p className="mb-2 text-[11px] leading-5 text-[#81918A]">{field.description}</p>
                  {field.multiline ? (
                    <textarea
                      value={current}
                      onChange={(e) => updateField(field, e.target.value)}
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full resize-y rounded-sm border border-[#245442]/45 bg-[#061B16] px-3.5 py-3 text-sm leading-6 text-white outline-none transition-colors focus:border-[#C9A45C]"
                    />
                  ) : (
                    <input
                      type="text"
                      value={current}
                      onChange={(e) => updateField(field, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full rounded-sm border border-[#245442]/45 bg-[#061B16] px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#C9A45C]"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};
