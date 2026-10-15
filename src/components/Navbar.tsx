import { motion } from "framer-motion";
import { useState } from "react";
import Button from "@/components/ui/Button";
import {
  getLocalizedPath,
  useTranslations,
  type Lang,
} from "@/i18n/ui";

export default function Navbar({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [isMobileNavbarOpen, setIsMobileNavbarOpen] = useState(false);
  const closeMobileNavbar = () => setIsMobileNavbarOpen(false);
  const mobileNavbarVariants = {
    open: {
      opacity: 1,
      x: 0,
    },
    closed: {
      opacity: 0,
      x: "100%",
    },
  };

  return (
    <nav className="sticky top-0 z-60 w-full max-w-full overflow-x-clip border-b border-white/5 bg-[#0a0a0a]/80 px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-4 lg:px-8">
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-7xl
          items-center
          justify-between
        "
      >
        <a
          href={`${import.meta.env.BASE_URL}${getLocalizedPath("#hero", lang)}`}
          className="
            flex
            shrink-0
            items-center
            gap-2
            text-white
            transition-opacity
            hover:opacity-80
          "
        >
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="logo"
            className="w-6 h-6"
          />

          <span
            className="
              text-lg
              font-bold
              tracking-wide
            "
          >
            SparksLyse
          </span>
        </a>

        <div
          className="
            hidden
            items-center
            gap-6

            xl:flex
            lg:gap-8
          "
        >
          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}${getLocalizedPath("#about", lang)}`}
            rel="noreferrer"
          >
            {t("index.about")}
          </Button>

          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}${getLocalizedPath("equipe", lang)}`}
            rel="noreferrer"
          >
            {t("comp_navbar.ourteam")}
          </Button>

          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}${getLocalizedPath("train", lang)}`}
            rel="noreferrer"
          >
            {t("comp_navbar.train")}
          </Button>

          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}${getLocalizedPath("#faq", lang)}`}
          >
            {t("index.faq")}
          </Button>

          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}${getLocalizedPath("#soutien", lang)}`}
          >
            {t("index.support")}
          </Button>

          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}${getLocalizedPath("blog", lang)}`}
          >
            {t("comp_navbar.blog")}
          </Button>
        </div>

        <Button
          variant="button-red"
          href={`${import.meta.env.BASE_URL}${getLocalizedPath("chat", lang)}`}
          className="hidden xl:inline-flex"
        >
          {t("start")}
        </Button>

        <Button
          id="mobile-menu-button"
          type="button"
          size="lg"
          aria-label={isMobileNavbarOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMobileNavbarOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMobileNavbarOpen(!isMobileNavbarOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10 xl:hidden"
        >
          {isMobileNavbarOpen ? (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12" /> <path d="M18 6L6 18" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M4 6h16" /> <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          )}
        </Button>
      </div>
      <motion.div
        animate={isMobileNavbarOpen ? "open" : "closed"}
        variants={mobileNavbarVariants}
        id="mobile-menu"
        aria-hidden={!isMobileNavbarOpen}
        inert={!isMobileNavbarOpen}
        className="absolute left-0 right-0 top-full z-40 w-full max-w-full overflow-hidden bg-[#0a0a0a] xl:hidden"
      >
        <div className="flex flex-col gap-1 border-t border-white/5 w-[90%] pb-3 pt-3">
          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}${getLocalizedPath("#about", lang)}`}
            rel="noreferrer"
            className="rounded-lg"
            onClick={closeMobileNavbar}
          >
            {t("index.about")}
          </Button>

          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}${getLocalizedPath("about", lang)}`}
            rel="noreferrer"
            className="rounded-lg"
            onClick={closeMobileNavbar}
          >
            {t("comp_navbar.ourteam")}
          </Button>

          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}${getLocalizedPath("train", lang)}`}
            rel="noreferrer"
            className="rounded-lg"
            onClick={closeMobileNavbar}
          >
            {t("comp_navbar.train")}
          </Button>

          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}${getLocalizedPath("#faq", lang)}`}
            className="rounded-lg"
          >
            {t("index.faq")}
          </Button>

          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}${getLocalizedPath("#soutien", lang)}`}
            className="rounded-lg"
          >
            {t("index.support")}
          </Button>

          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}${getLocalizedPath("blog", lang)}`}
            className="rounded-lg"
          >
            {t("comp_navbar.blog")}
          </Button>

          <Button
            variant="button-red"
            className="bg-[#dba0a0]/10! hover:bg-[#dba0a0]/20!"
            href={`${import.meta.env.BASE_URL}${getLocalizedPath("chat", lang)}`}
          >
            {t("start")}
          </Button>
        </div>
      </motion.div>
    </nav>
  );
}
