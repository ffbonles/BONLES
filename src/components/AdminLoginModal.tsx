import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  X,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { authService } from '../services/auth';
import { BonlesLogo } from './BonlesLogo';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await authService.login(
        username,
        password,
        rememberMe
      );

      if (result.success) {
        onLoginSuccess();
        onClose();
        setUsername('');
        setPassword('');
      } else {
        setErrorMessage(result.message);
      }
    } catch {
      setErrorMessage(
        'Tidak dapat menghubungi server autentikasi. Periksa koneksi lalu coba lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50 overflow-y-auto
        flex items-center justify-center
        p-4 sm:p-6
        bg-[#061B16]/95
        backdrop-blur-xl
        animate-fade-in
      "
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="
            absolute top-1/2 left-1/2
            -translate-x-1/2 -translate-y-1/2
            w-[420px] h-[420px]
            rounded-full
            bg-[#16805F]/10
            blur-[100px]
          "
        />

        <div
          className="
            absolute top-0 right-0
            w-[260px] h-[260px]
            rounded-full
            bg-[#C9A45C]/5
            blur-[90px]
          "
        />
      </div>

      <div
        className="
          relative
          w-full max-w-md
          overflow-hidden
          rounded-2xl
          bg-[#09271F]
          border border-[#16805F]/30
          shadow-2xl shadow-black/50
          text-[#FCFAF5]
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-admin-title"
      >
        {/* Premium top accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#16805F] via-[#C9A45C] to-[#16805F]" />

        {/* Subtle inner highlight */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-white/[0.03]" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4 z-10
            flex items-center justify-center
            w-8 h-8
            rounded-lg
            text-[#9EAAA4]
            hover:text-[#FCFAF5]
            hover:bg-white/5
            transition-all duration-200
            cursor-pointer
          "
          aria-label="Tutup dialog login"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative p-6 sm:p-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-5">
              <div
                className="
                  flex items-center justify-center
                  px-4 py-2.5
                  rounded-xl
                  bg-[#061B16]
                  border border-[#16805F]/25
                  shadow-lg shadow-black/10
                "
              >
                <BonlesLogo size="sm" variant="horizontal" />
              </div>
            </div>

            {/* Security badge */}
            <div
              className="
                inline-flex items-center gap-2
                px-3 py-1.5
                rounded-full
                bg-[#C9A45C]/10
                border border-[#C9A45C]/30
                text-[#C9A45C]
                text-[9px]
                font-bold
                tracking-[0.18em]
                uppercase
              "
            >
              <Lock className="w-3 h-3" />
              <span>Protected Gateway</span>
            </div>

            <div className="mt-5">
              <h2
                id="modal-admin-title"
                className="
                  text-xl sm:text-2xl
                  font-serif
                  font-medium
                  tracking-tight
                  text-[#FCFAF5]
                "
              >
                Autentifikasi Bonles Food Admin
              </h2>

              <p
                className="
                  text-[11px] sm:text-xs
                  leading-relaxed
                  text-[#9EAAA4]
                  mt-2
                  max-w-sm
                  mx-auto
                "
              >
                Masukkan kredensial resmi untuk mengakses
                database dan panel kontrol.
              </p>
            </div>
          </div>

          {/* Error */}
          {errorMessage && (
            <div
              className="
                mt-5
                p-3.5
                rounded-xl
                bg-[#D96B61]/10
                border border-[#D96B61]/35
                text-[#FCFAF5]
                flex items-start gap-3
                animate-shake
              "
            >
              <div
                className="
                  shrink-0
                  flex items-center justify-center
                  w-8 h-8
                  rounded-lg
                  bg-[#D96B61]/10
                "
              >
                <ShieldAlert className="w-4 h-4 text-[#D96B61]" />
              </div>

              <div className="flex-1 pt-0.5">
                <span className="font-semibold block text-xs text-[#F0A49D]">
                  Akses Ditolak
                </span>

                <p className="text-[11px] leading-relaxed text-[#CDBDB8] mt-1">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label
                htmlFor="admin-username"
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[#C9A45C]
                  flex items-center gap-2
                "
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Username / Email</span>
              </label>

              <div className="relative">
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username atau email..."
                  required
                  autoFocus
                  className="
                    w-full
                    h-11
                    rounded-xl
                    px-4
                    bg-[#061B16]
                    border border-[#16805F]/25
                    text-sm
                    text-[#FCFAF5]
                    placeholder-[#64736D]
                    outline-none
                    transition-all duration-200
                    focus:border-[#16805F]
                    focus:ring-2
                    focus:ring-[#16805F]/15
                    hover:border-[#16805F]/45
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="admin-password"
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[#C9A45C]
                  flex items-center gap-2
                "
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Password</span>
              </label>

              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  required
                  className="
                    w-full
                    h-11
                    rounded-xl
                    px-4 pr-12
                    bg-[#061B16]
                    border border-[#16805F]/25
                    text-sm
                    text-[#FCFAF5]
                    placeholder-[#64736D]
                    outline-none
                    transition-all duration-200
                    focus:border-[#16805F]
                    focus:ring-2
                    focus:ring-[#16805F]/15
                    hover:border-[#16805F]/45
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    flex items-center justify-center
                    w-8 h-8
                    rounded-lg
                    text-[#788780]
                    hover:text-[#FCFAF5]
                    hover:bg-white/5
                    transition-all
                    cursor-pointer
                  "
                  title={
                    showPassword
                      ? 'Sembunyikan password'
                      : 'Lihat password'
                  }
                  aria-label={
                    showPassword
                      ? 'Sembunyikan password'
                      : 'Lihat password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label
              className="
                flex items-center gap-2.5
                text-[#B7C2BD]
                hover:text-[#FCFAF5]
                cursor-pointer
                select-none
                group
              "
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="
                  w-4 h-4
                  rounded
                  bg-[#061B16]
                  border-[#16805F]/40
                  text-[#16805F]
                  focus:ring-2
                  focus:ring-[#16805F]/20
                  focus:ring-offset-0
                  focus:ring-offset-[#09271F]
                  cursor-pointer
                "
              />

              <span className="text-[11px]">
                Ingat sesi login ini
              </span>
            </label>

            {/* Submit */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="
                  group
                  w-full
                  min-h-12
                  px-4
                  rounded-xl
                  bg-gradient-to-r
                  from-[#16805F]
                  to-[#126A50]
                  hover:from-[#1D966F]
                  hover:to-[#16805F]
                  active:scale-[0.99]
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  text-white
                  font-semibold
                  text-[11px]
                  tracking-[0.12em]
                  uppercase
                  flex items-center justify-center gap-2
                  transition-all duration-200
                  shadow-lg
                  shadow-[#16805F]/20
                  hover:shadow-[#16805F]/30
                  cursor-pointer
                "
              >
                {isLoading ? (
                  <>
                    <span
                      className="
                        w-4 h-4
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                        animate-spin
                      "
                    />
                    <span>Memverifikasi Otoritas...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />

                    <span>
                      Buka Panel Administrasi
                    </span>

                    <ArrowRight
                      className="
                        w-3.5 h-3.5
                        transition-transform
                        group-hover:translate-x-1
                      "
                    />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security footer */}
          <div
            className="
              mt-6
              pt-4
              border-t border-[#16805F]/15
            "
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldCheck className="w-3 h-3 text-[#4FCB91]" />

              <span
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[#718079]
                "
              >
                Secure Administration
              </span>
            </div>

            <p
              className="
                text-[9px]
                text-[#718079]
                leading-relaxed
                text-center
                max-w-sm
                mx-auto
              "
            >
              Sistem pengamanan sesi PT. Bonles Food Nusantara.
              Seluruh aktivitas login dicatat pada audit log.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
