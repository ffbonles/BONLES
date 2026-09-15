import React, { useMemo, useRef, useState } from 'react';
import {
  Image as ImageIcon,
  Link2,
  Loader2,
  Save,
  Sparkles,
  Trash2,
  Upload,
  Type,
} from 'lucide-react';
import { Setting } from '../../types';
import { gasSync } from '../../services/gasSyncService';

interface HomepageContentEditorProps {
  settings: Setting[];
  onChange: (settings: Setting[]) => void;
  onSave?: () => void;
}

type TextField = {
  key: string;
  label: string;
  description: string;
  multiline?: boolean;
  rows?: number;
};

type ContentBlockProps = {
  title: string;
  eyebrow: string;
  imageKey: string;
  imageLabel: string;
  imageDescription: string;
  imageSlot: string;
  fields: TextField[];
};

const FALLBACKS: Record<string, string> = {
  ANNOUNCEMENT_BAR_TEXT: 'Snack Tinggi Protein & Oleh-Oleh Khas Nusantara',
  PROMO_BANNER_TEXT: 'Pemesanan Langsung Terintegrasi WhatsApp',
  ANNOUNCEMENT_BAR_ACTIVE: 'TRUE',

  HERO_BADGE: 'Koleksi Resmi Kemasan Pouch Zipper',
  HERO_TITLE: 'Inovasi Snack Pouch Tinggi Protein & Amplang Borneo',
  HERO_SUBTITLE:
    'Dibuat dari ikan tenggiri segar dan bahan lokal berkualitas dalam kemasan standing pouch zipper modern berstandar BPOM & HACCP.',
  HERO_PRODUCT_NAME: 'Keripik Ikan Bawis',
  HERO_PRODUCT_TAGLINE: 'High Protein Fish Crunch',

  OUR_STORY_EYEBROW: 'Our Story & Dedication',
  OUR_STORY_TITLE: 'Perjalanan Rasa Autentik Nusantara',
  OUR_STORY_INTRO:
    'Dari kekayaan hasil perairan Kalimantan Timur, kami membawa pangan lokal Borneo ke dalam bentuk camilan modern yang memiliki nilai, karakter, dan cerita.',
  OUR_STORY_DEDICATION:
    'Menghubungkan kekayaan alam Borneo dengan kreativitas pengolahan modern untuk menghadirkan pengalaman rasa yang autentik.',
  OUR_STORY_QUOTE:
    'Kekayaan daerah bukan hanya untuk dikenang—tetapi bisa dikembangkan, dinikmati, dan dibawa lebih jauh melalui sebuah rasa.',
  OUR_STORY_PART1_TITLE: 'Berawal dari|Kekayaan Lokal',
  OUR_STORY_PART1_TEXT:
    'Berawal dari kekayaan hasil perairan Kalimantan Timur, kami ingin membuktikan bahwa pangan lokal Borneo dapat diolah menjadi camilan modern yang memiliki nilai dan cerita.',
  OUR_STORY_PART2_TITLE: 'Ikan Bawis|dalam Bentuk Modern',
  OUR_STORY_PART2_TEXT:
    'Ikan Bawis kami pilih dan olah menjadi keripik ikan tanpa tulang tengah, menghasilkan camilan yang renyah, praktis, dan kaya protein.',
  OUR_STORY_PART2_QUOTE:
    'Sebuah bahan pangan lokal diberi sentuhan pengolahan modern tanpa kehilangan karakter dan cerita asalnya.',
  OUR_STORY_PART3_TITLE: 'Sentuhan Rasa|Khas Borneo',
  OUR_STORY_PART3_TEXT:
    'Untuk memberikan pengalaman kuliner yang lebih khas, BONLES menghadirkan Sambal Bawang Dayak sebagai pendamping dalam satu sachet cocolan.',
  OUR_STORY_PART3_PRODUCT:
    'Keripik Ikan Bawis + Sambal Bawang Dayak',
  OUR_STORY_PART3_DETAIL:
    'Gurih-renyah berpadu dengan sensasi pedas dan karakter rempah khas Borneo.',
  OUR_STORY_PART3_BADGE: 'Signature Dipping Sachet',
  OUR_STORY_CTA_TEXT: 'Telusuri Cerita Kami',

  ABOUT_EYEBROW: 'Our Story',
  ABOUT_TITLE: 'Dari Borneo, diolah menjadi cerita yang bernilai.',
  ABOUT_DESCRIPTION:
    'Berawal dari kekayaan hasil perairan Kalimantan Timur, kami ingin membuktikan bahwa pangan lokal Borneo dapat diolah menjadi camilan modern yang memiliki nilai dan cerita.',
  ABOUT_DESCRIPTION_2:
    'Ikan Bawis kami pilih dan olah menjadi keripik ikan tanpa tulang tengah, sehingga menghasilkan camilan yang renyah, praktis, dan kaya protein.',
  ABOUT_DESCRIPTION_3:
    'Melalui BONLES, kami ingin membawa cita rasa dan kekayaan pangan lokal Borneo lebih dekat dengan masyarakat Indonesia, sekaligus membuka cerita tentang potensi pangan lokal kepada dunia.',
  ABOUT_VALUE_1_TITLE: 'Khas Borneo',
  ABOUT_VALUE_1_TEXT:
    'Berangkat dari kekayaan hasil perairan dan pangan lokal Kalimantan Timur.',
  ABOUT_VALUE_2_TITLE: 'Ikan Bawis',
  ABOUT_VALUE_2_TEXT:
    'Diolah menjadi keripik ikan tanpa tulang tengah yang renyah, praktis, dan kaya protein.',
  ABOUT_VALUE_3_TITLE: 'Modern Craft',
  ABOUT_VALUE_3_TEXT:
    'Pangan lokal diolah menjadi camilan modern dengan nilai dan pengalaman yang lebih tinggi.',
  ABOUT_VALUE_4_TITLE: 'From Borneo to the World',
  ABOUT_VALUE_4_TEXT:
    'Membawa cerita, cita rasa, dan potensi pangan lokal Borneo lebih jauh.',
};

const CONTENT_BLOCKS: ContentBlockProps[] = [
  {
    title: 'Hero / Halaman Utama',
    eyebrow: '02 — Hero',
    imageKey: 'HERO_IMAGE_URL',
    imageLabel: 'Gambar Hero Utama',
    imageDescription: 'Gambar utama yang tampil pada Hero halaman depan.',
    imageSlot: 'hero-main',
    fields: [
      { key: 'HERO_BADGE', label: 'Badge / Label', description: 'Label kecil di atas judul Hero.' },
      { key: 'HERO_TITLE', label: 'Judul Utama', description: 'Judul terbesar pada halaman depan.', multiline: true, rows: 3 },
      { key: 'HERO_SUBTITLE', label: 'Redaksi / Deskripsi', description: 'Paragraf pengantar di bawah judul Hero.', multiline: true, rows: 4 },
      { key: 'HERO_PRODUCT_NAME', label: 'Nama Produk Unggulan', description: 'Nama produk yang ditonjolkan di Hero.' },
      { key: 'HERO_PRODUCT_TAGLINE', label: 'Tagline Produk', description: 'Tagline pendek produk unggulan.' },
    ],
  },
  {
    title: 'Our Story — Pembuka',
    eyebrow: '03A — Cerita Brand',
    imageKey: 'OUR_STORY_IMAGE_URL',
    imageLabel: 'Gambar Our Story Utama',
    imageDescription: 'Gambar panorama pada pembuka Our Story.',
    imageSlot: 'our-story-main',
    fields: [
      { key: 'OUR_STORY_EYEBROW', label: 'Label Section', description: 'Label kecil di atas judul.' },
      { key: 'OUR_STORY_TITLE', label: 'Judul Our Story', description: 'Judul utama bagian cerita brand.', multiline: true, rows: 2 },
      { key: 'OUR_STORY_INTRO', label: 'Redaksi Pengantar', description: 'Paragraf tepat di bawah judul.', multiline: true, rows: 4 },
      { key: 'OUR_STORY_DEDICATION', label: 'Teks Dedikasi', description: 'Redaksi pada blok dedikasi.', multiline: true, rows: 3 },
      { key: 'OUR_STORY_QUOTE', label: 'Kutipan Penutup', description: 'Kutipan besar pada penutup Our Story.', multiline: true, rows: 3 },
      { key: 'OUR_STORY_CTA_TEXT', label: 'Teks CTA', description: 'Teks tombol/link untuk menelusuri cerita.' },
    ],
  },
  {
    title: 'Our Story — Cerita 01',
    eyebrow: '03B — Rooted in Borneo',
    imageKey: 'OUR_STORY_PART1_IMAGE_URL',
    imageLabel: 'Gambar Cerita 01',
    imageDescription: 'Visual untuk cerita tentang akar pangan lokal Borneo.',
    imageSlot: 'our-story-part1',
    fields: [
      { key: 'OUR_STORY_PART1_TITLE', label: 'Judul Cerita 01', description: 'Gunakan karakter | untuk memisahkan aksen judul.', multiline: true, rows: 2 },
      { key: 'OUR_STORY_PART1_TEXT', label: 'Redaksi Cerita 01', description: 'Isi cerita pertama.', multiline: true, rows: 6 },
    ],
  },
  {
    title: 'Our Story — Cerita 02',
    eyebrow: '03C — Modern Fish Snack',
    imageKey: 'OUR_STORY_PART2_IMAGE_URL',
    imageLabel: 'Gambar Cerita 02',
    imageDescription: 'Visual produk Ikan Bawis / Modern Snack.',
    imageSlot: 'our-story-part2',
    fields: [
      { key: 'OUR_STORY_PART2_TITLE', label: 'Judul Cerita 02', description: 'Gunakan karakter | untuk memisahkan aksen judul.', multiline: true, rows: 2 },
      { key: 'OUR_STORY_PART2_TEXT', label: 'Redaksi Cerita 02', description: 'Isi cerita kedua.', multiline: true, rows: 6 },
      { key: 'OUR_STORY_PART2_QUOTE', label: 'Kutipan Cerita 02', description: 'Kutipan pendek pada blok aksen.', multiline: true, rows: 3 },
    ],
  },
  {
    title: 'Our Story — Cerita 03',
    eyebrow: '03D — The Borneo Flavor',
    imageKey: 'OUR_STORY_PART3_IMAGE_URL',
    imageLabel: 'Gambar Cerita 03',
    imageDescription: 'Visual Sambal Bawang Dayak / Signature Dipping Sachet.',
    imageSlot: 'our-story-part3',
    fields: [
      { key: 'OUR_STORY_PART3_TITLE', label: 'Judul Cerita 03', description: 'Judul bagian rasa khas Borneo.', multiline: true, rows: 2 },
      { key: 'OUR_STORY_PART3_TEXT', label: 'Redaksi Cerita 03', description: 'Paragraf tentang Sambal Bawang Dayak.', multiline: true, rows: 5 },
      { key: 'OUR_STORY_PART3_PRODUCT', label: 'Nama Produk / Pairing', description: 'Nama kombinasi produk yang ditampilkan.' },
      { key: 'OUR_STORY_PART3_DETAIL', label: 'Redaksi Detail Pairing', description: 'Deskripsi singkat rasa / pairing.', multiline: true, rows: 3 },
      { key: 'OUR_STORY_PART3_BADGE', label: 'Badge Gambar', description: 'Label kecil yang tampil di atas gambar.' },
    ],
  },
  {
    title: 'Tentang Kami',
    eyebrow: '04 — About',
    imageKey: 'ABOUT_IMAGE_URL',
    imageLabel: 'Gambar Tentang Kami',
    imageDescription: 'Visual utama pada bagian Tentang Kami.',
    imageSlot: 'about-main',
    fields: [
      { key: 'ABOUT_EYEBROW', label: 'Label Section', description: 'Label kecil di atas judul About.' },
      { key: 'ABOUT_TITLE', label: 'Judul About', description: 'Judul utama bagian Tentang Kami.', multiline: true, rows: 2 },
      { key: 'ABOUT_DESCRIPTION', label: 'Redaksi 01', description: 'Paragraf pembuka.', multiline: true, rows: 4 },
      { key: 'ABOUT_DESCRIPTION_2', label: 'Redaksi 02', description: 'Paragraf tentang Ikan Bawis.', multiline: true, rows: 4 },
      { key: 'ABOUT_DESCRIPTION_3', label: 'Redaksi 03', description: 'Paragraf visi BONLES / Borneo to the world.', multiline: true, rows: 4 },
      { key: 'ABOUT_VALUE_1_TITLE', label: 'Nilai 01 — Judul', description: 'Judul kartu nilai pertama.' },
      { key: 'ABOUT_VALUE_1_TEXT', label: 'Nilai 01 — Redaksi', description: 'Deskripsi kartu nilai pertama.', multiline: true, rows: 3 },
      { key: 'ABOUT_VALUE_2_TITLE', label: 'Nilai 02 — Judul', description: 'Judul kartu nilai kedua.' },
      { key: 'ABOUT_VALUE_2_TEXT', label: 'Nilai 02 — Redaksi', description: 'Deskripsi kartu nilai kedua.', multiline: true, rows: 3 },
      { key: 'ABOUT_VALUE_3_TITLE', label: 'Nilai 03 — Judul', description: 'Judul kartu nilai ketiga.' },
      { key: 'ABOUT_VALUE_3_TEXT', label: 'Nilai 03 — Redaksi', description: 'Deskripsi kartu nilai ketiga.', multiline: true, rows: 3 },
      { key: 'ABOUT_VALUE_4_TITLE', label: 'Nilai 04 — Judul', description: 'Judul kartu nilai keempat.' },
      { key: 'ABOUT_VALUE_4_TEXT', label: 'Nilai 04 — Redaksi', description: 'Deskripsi kartu nilai keempat.', multiline: true, rows: 3 },
    ],
  },
];

const settingValue = (settings: Setting[], key: string) => {
  const found = settings.find((item) => item.SETTING === key);
  return found?.VALUE ?? FALLBACKS[key] ?? '';
};

const FieldEditor: React.FC<{
  field: TextField;
  value: string;
  onChange: (value: string) => void;
}> = ({ field, value, onChange }) => (
  <div className={field.multiline ? 'lg:col-span-2' : ''}>
    <label className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#D8B878]">
      <Type className="h-3 w-3" />
      {field.label}
    </label>
    <p className="mb-2 text-[11px] leading-5 text-[#81918A]">{field.description}</p>
    {field.multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={field.rows || 4}
        className="w-full resize-y rounded-sm border border-[#245442]/45 bg-[#061B16] px-3.5 py-3 text-sm leading-6 text-white outline-none transition-colors focus:border-[#C9A45C]"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-[#245442]/45 bg-[#061B16] px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#C9A45C]"
      />
    )}
  </div>
);

export const HomepageContentEditor: React.FC<HomepageContentEditorProps> = ({
  settings,
  onChange,
  onSave,
}) => {
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const map = useMemo(() => {
    const result: Record<string, Setting> = {};
    settings.forEach((item) => {
      result[item.SETTING] = item;
    });
    return result;
  }, [settings]);

  const updateField = (
    key: string,
    value: string,
    description = 'Konten homepage BONLES.'
  ) => {
    const now = new Date().toISOString();
    const existingIndex = settings.findIndex((item) => item.SETTING === key);
    const next = [...settings];

    const nextSetting: Setting = {
      SETTING: key,
      VALUE: value,
      DESCRIPTION: description,
      UPDATED_AT: now,
    };

    if (existingIndex >= 0) {
      next[existingIndex] = { ...next[existingIndex], ...nextSetting };
    } else {
      next.push(nextSetting);
    }

    onChange(next);
  };

  const handleImageUpload = async (
    imageKey: string,
    imageSlot: string,
    description: string,
    file: File
  ) => {
    if (!file.type.startsWith('image/')) {
      window.alert('File yang dipilih harus berupa gambar.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      window.alert('Ukuran gambar maksimal 10 MB.');
      return;
    }

    setUploadingKey(imageKey);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () =>
          reject(new Error('Gagal membaca file gambar.'));

        reader.readAsDataURL(file);
      });

      const result = await gasSync.uploadImageToDrive({
        categoryName: 'Homepage',
        sku: 'HOMEPAGE',
        base64,
        filename: `homepage-${imageSlot}-${Date.now()}.${file.name.split('.').pop() || 'jpg'}`,
        imageSlot,
      });

      if (!result.success || !result.data?.url) {
        throw new Error(result.message || 'Upload gambar gagal.');
      }

      updateField(imageKey, result.data.url, description);

      window.alert(
        'Gambar berhasil diunggah ke Google Drive. Klik "Simpan Konten Beranda" untuk menyimpan perubahan.'
      );
    } catch (error: any) {
      window.alert(error?.message || 'Gagal mengunggah gambar.');
    } finally {
      setUploadingKey(null);

      const input = inputRefs.current[imageKey];
      if (input) input.value = '';
    }
  };

  const renderImageEditor = (block: ContentBlockProps) => {
    const current = settingValue(settings, block.imageKey);
    const busy = uploadingKey === block.imageKey;

    return (
      <div className="rounded-sm border border-[#245442]/45 bg-[#061B16] p-4">
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-[#C9A45C]/30 bg-[#0D3027] text-[#D8B878]">
            <ImageIcon className="h-4 w-4" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D8B878]">
              {block.imageLabel}
            </label>
            <p className="mt-1 text-[11px] leading-5 text-[#81918A]">
              {block.imageDescription}
            </p>
          </div>
        </div>

        {current ? (
          <div className="mb-3 overflow-hidden rounded-sm border border-[#245442]/45 bg-[#09271F]">
            <img
              src={current}
              alt={block.imageLabel}
              className="h-52 w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="mb-3 flex h-52 items-center justify-center rounded-sm border border-dashed border-[#245442]/60 text-xs text-[#81918A]">
            Belum ada gambar
          </div>
        )}

        <div className="relative">
          <Link2 className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#81918A]" />
          <input
            type="url"
            value={current}
            onChange={(e) =>
              updateField(block.imageKey, e.target.value, block.imageDescription)
            }
            placeholder="https://... atau /images/..."
            className="w-full rounded-sm border border-[#245442]/45 bg-[#09271F] py-2.5 pl-9 pr-3 text-xs text-white outline-none focus:border-[#C9A45C]"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRefs.current[block.imageKey]?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-sm border border-[#C9A45C]/50 bg-[#0D3027] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#D8B878] hover:bg-[#103A2E] disabled:opacity-50"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            {busy ? 'Mengunggah...' : 'Upload dari Komputer'}
          </button>

          <input
            ref={(el) => {
              inputRefs.current[block.imageKey] = el;
            }}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                void handleImageUpload(
                  block.imageKey,
                  block.imageSlot,
                  block.imageDescription,
                  file
                );
              }
            }}
          />

          <button
            type="button"
            onClick={() =>
              updateField(block.imageKey, '', block.imageDescription)
            }
            className="inline-flex items-center gap-2 rounded-sm border border-red-900/40 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-red-300 hover:bg-red-950/30"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Hapus URL
          </button>
        </div>
      </div>
    );
  };

  const renderContentBlock = (block: ContentBlockProps) => (
    <section
      key={block.title}
      className="overflow-hidden rounded-sm border border-[#245442]/45 bg-[#09271F]"
    >
      <div className="border-b border-[#245442]/45 bg-[#0D3027] px-5 py-4">
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#C9A45C]">
          {block.eyebrow}
        </span>
        <h4 className="mt-1 text-xl font-serif-luxury text-white">
          {block.title}
        </h4>
        <p className="mt-1 text-xs text-[#81918A]">
          Edit gambar dan seluruh redaksi dalam satu bagian. Lebih mudah untuk
          melihat hubungan antara visual dan isi.
        </p>
      </div>

      <div className="grid gap-6 p-5 xl:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.15fr)] xl:items-start">
        <div className="xl:sticky xl:top-4">
          {renderImageEditor(block)}
        </div>

        <div className="grid gap-5 rounded-sm border border-[#245442]/30 bg-[#061B16] p-4 lg:grid-cols-2">
          {block.fields.map((field) => (
            <FieldEditor
              key={field.key}
              field={field}
              value={map[field.key]?.VALUE ?? FALLBACKS[field.key] ?? ''}
              onChange={(value) =>
                updateField(field.key, value, field.description)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="space-y-5">
      <div className="rounded-sm border border-[#C9A45C]/35 bg-gradient-to-r from-[#0D3429] to-[#09271F] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#D8B878]">
              <Sparkles className="h-4 w-4" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">
                CMS Halaman Depan
              </span>
            </div>

            <h3 className="mt-2 text-xl font-serif-luxury text-white">
              Edit Website Berdampingan
            </h3>

            <p className="mt-1 max-w-4xl text-xs leading-5 text-[#9FAFA7]">
              Setiap bagian website dikelompokkan bersama: gambar di sebelah
              kiri, judul dan redaksi di sebelah kanan. Admin tidak perlu
              mencari gambar dan teks di tempat berbeda.
            </p>
          </div>

          {onSave && (
            <button
              type="button"
              onClick={onSave}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm bg-[#C9A45C] px-4 py-2.5 text-xs font-bold text-black shadow-md hover:bg-[#D7B66F]"
            >
              <Save className="h-4 w-4" />
              Simpan Konten Beranda
            </button>
          )}
        </div>
      </div>

      <section className="rounded-sm border border-[#245442]/45 bg-[#09271F]">
        <div className="border-b border-[#245442]/45 bg-[#0D3027] px-5 py-4">
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#C9A45C]">
            01 — Bar Paling Atas
          </span>
          <h4 className="mt-1 text-lg font-serif-luxury text-white">
            Announcement Bar
          </h4>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-2">
          {[
            {
              key: 'ANNOUNCEMENT_BAR_TEXT',
              label: 'Teks Announcement',
              description: 'Teks yang tampil pada bar paling atas.',
            },
            {
              key: 'PROMO_BANNER_TEXT',
              label: 'Teks Promo Pendamping',
              description: 'Teks pendamping announcement pada desktop.',
            },
            {
              key: 'ANNOUNCEMENT_BAR_ACTIVE',
              label: 'Tampilkan Announcement',
              description: 'Gunakan TRUE untuk tampil dan FALSE untuk menyembunyikan.',
            },
          ].map((field) => (
            <FieldEditor
              key={field.key}
              field={field}
              value={map[field.key]?.VALUE ?? FALLBACKS[field.key] ?? ''}
              onChange={(value) =>
                updateField(field.key, value, field.description)
              }
            />
          ))}
        </div>
      </section>

      {CONTENT_BLOCKS.map(renderContentBlock)}

      <div className="flex justify-end border-t border-[#245442]/45 pt-4">
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-sm bg-[#C9A45C] px-5 py-3 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#D7B66F]"
          >
            <Save className="h-4 w-4" />
            Simpan Semua Perubahan
          </button>
        )}
      </div>
    </div>
  );
};
