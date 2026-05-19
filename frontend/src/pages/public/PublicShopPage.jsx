// src/pages/public/PublicShopPage.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

// ── Importe tes images ici au fur et à mesure ──────────────────────────────
import img1 from "../../assets/1.png";
import img2 from "../../assets/2.png";
import img3 from "../../assets/3.png";

// Bannières duo camping (ajoute quand tu as les images)
import duoGauche from "../../assets/duo-gauche.png";
import duoDroite from "../../assets/duo-droite.png";

// Sections latérales (ajoute quand tu as les images)
// import imgMobilite   from '../../assets/mobilite.png';
// import imgRunning    from '../../assets/running.png';
// import imgCamping    from '../../assets/camping.png';
// import imgFitness    from '../../assets/fitness.png';
// import imgApp        from '../../assets/app-banner.png';

// Tiles Par genre (ajoute quand tu as les images)
import genreHomme from "../../assets/genre-homme.png";
import genreFemme from "../../assets/genre-femme.png";
import genreEnfants from "../../assets/genre-enfants.png";
import genre99 from "../../assets/genre-99.png";
import genreCatalogue from "../../assets/genre-catalogue.png";
import genreBaisse from "../../assets/genre-baisse.png";

// Top catégories (ajoute quand tu as les images)
import catFitness from "../../assets/cat-fitness.jpg";
import catRunning from "../../assets/cat-running.jpg";
import catFootball from "../../assets/cat-Football.jpg";
import catCamping from "../../assets/cat-Camping.png";
import catRandonnée from "../../assets/cat-Randonnée.jpg";
import catVélos from "../../assets/cat-Vélos.png";
import catYoga from "../../assets/cat-Yoga.jpg";

// Indispensables (ajoute quand tu as les images)
// import indChaises    from '../../assets/ind-chaises.png';
// etc...

// Découvrez aussi (ajoute quand tu as les images)
// import discHomme     from '../../assets/disc-homme.png';
// etc...

// Services (ajoute quand tu as les images)
import svcFaq        from '../../assets/svc-faq.jpg';
import svcFidelite   from '../../assets/svc-fidelite.jpg';
import svcClickRetire from '../../assets/svc-click-retire.jpg';
// ──────────────────────────────────────────────────────────────────────────────

const IMG = (src) =>
  src
    ? src.startsWith("http")
      ? src
      : `${import.meta.env.VITE_API_URL}${src}`
    : null;

// ─── Hero Carousel ────────────────────────────────────────────────────────────

const CAT_IMAGES = {
  1: catFitness,
  2: catRunning,
  3: catCamping,
  4: catRandonnée,
  5: catVélos,
  6: catYoga,
  7: catFootball,
};
const SLIDES = [
  {
    image: img1,
    tag: "OFFRE LIMITÉE",
    title: "Profitez des promotions !",
    ctas: [
      { label: "Vélos & Matos", href: "#" },
      { label: "Homme", href: "#" },
      { label: "Femme", href: "#" },
    ],
  },
  {
    image: img2,
    tag: "NOUVEAUTÉ",
    title: "Gagnez 50 Dhs tout de suite !",
    ctas: [{ label: "Je fonce", href: "#" }],
  },
  {
    image: img3,
    tag: "LIVRAISON",
    title: "Livraison GRATUITE",
    ctas: [{ label: "J'en profite !", href: "#" }],
  },
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const go = (i) => {
    setCurrent(i);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setCurrent((c) => (c + 1) % SLIDES.length),
      5000,
    );
  };

  useEffect(() => {
    timerRef.current = setInterval(
      () => setCurrent((c) => (c + 1) % SLIDES.length),
      5000,
    );
    return () => clearInterval(timerRef.current);
  }, []);

  const s = SLIDES[current];

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-200"
      style={{ height: 400 }}
    >
      {s.image ? (
        <img
          src={s.image}
          alt={s.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center px-6">
            <Placeholder
              label="Bannière hero — 1440×400px"
              className="mx-auto mb-4"
              style={{ width: 120, height: 80 }}
            />
            <h2 className="text-gray-700 font-bold text-2xl mt-2">{s.title}</h2>
            <div className="flex gap-2 justify-center mt-4 flex-wrap">
              {s.ctas.map((cta) => (
                <a
                  key={cta.label}
                  href={cta.href}
                  className="bg-[#3643BA] text-white text-sm font-bold px-5 py-2 rounded hover:bg-[#2a35a0] transition-colors"
                >
                  {cta.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-white w-6" : "bg-white/50 w-2"}`}
          />
        ))}
      </div>
      {/* Arrows */}
      <button
        onClick={() => go((current - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow z-10 transition-colors"
      >
        <svg
          className="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={() => go((current + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow z-10 transition-colors"
      >
        <svg
          className="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}

// ─── Placeholder générique (affiché quand image = null) ───────────────────────
function Placeholder({ label, className = "", style = {} }) {
  return (
    <div
      className={`bg-gray-200 flex flex-col items-center justify-center gap-1 ${className}`}
      style={style}
    >
      <svg
        className="w-8 h-8 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586
             a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6
             a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      {label && (
        <span className="text-gray-500 text-[10px] font-medium text-center px-2">
          {label}
        </span>
      )}
    </div>
  );
}

// ─── Image ou Placeholder ─────────────────────────────────────────────────────
// Utilise ce composant partout : si `src` existe → <img>, sinon → placeholder
function Img({
  src,
  alt = "",
  label,
  className = "",
  style = {},
  imgClassName = "",
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`object-cover w-full h-full ${imgClassName} ${className}`}
        style={style}
      />
    );
  }
  return <Placeholder label={label} className={className} style={style} />;
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, cta, onCta }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {cta && (
        <button
          onClick={onCta}
          className="text-[#3643BA] text-sm font-semibold hover:underline flex items-center gap-1 shrink-0"
        >
          {cta}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ count = 4 }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3 h-3 ${s <= count ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969
            0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755
            1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1
            1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0
            00.951-.69l1.07-3.292z"
          />
        </svg>
      ))}
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, badge, onNavigate }) {
  const hasDiscount =
    product.old_price &&
    parseFloat(product.old_price) > parseFloat(product.price);
  const pct = hasDiscount
    ? Math.round(
        (1 - parseFloat(product.price) / parseFloat(product.old_price)) * 100,
      )
    : null;

  return (
    <div
      onClick={() => onNavigate(product.id)}
      className="bg-white border border-gray-200 rounded overflow-hidden hover:shadow-md transition-shadow cursor-pointer group flex-shrink-0"
      style={{ width: 192 }}
    >
      <div
        className="relative bg-gray-50 overflow-hidden"
        style={{ height: 192 }}
      >
        {badge && (
          <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            {badge}
          </span>
        )}
        {pct && (
          <span className="absolute top-2 right-2 z-10 bg-[#3643BA] text-white text-[10px] font-bold px-2 py-0.5 rounded">
            -{pct}%
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute bottom-2 left-2 z-10 bg-gray-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            Rupture
          </span>
        )}
        {IMG(product.image) ? (
          <img
            src={IMG(product.image)}
            alt={product.name}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Placeholder label="Photo à venir" className="w-full h-full" />
        )}
      </div>
      <div className="p-2.5">
        {product.store && (
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
            {product.store.name}
          </p>
        )}
        <h3
          className="text-xs text-gray-800 leading-snug line-clamp-2 mb-2"
          style={{ minHeight: "2rem" }}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <Stars count={4} />
          <span className="text-[10px] text-gray-400">
            ({Math.floor(Math.random() * 2000) + 100})
          </span>
        </div>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-sm font-bold text-gray-900">
            {parseFloat(product.price).toFixed(2)} MAD
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              {parseFloat(product.old_price).toFixed(2)} MAD
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Product Carousel ─────────────────────────────────────────────────────────
function ProductCarousel({ products, badge, onNavigate }) {
  const ref = useRef(null);
  const scroll = (dir) =>
    ref.current?.scrollBy({ left: dir * 210, behavior: "smooth" });

  if (!products || products.length === 0) return <SkeletonCarousel />;

  return (
    <div className="relative group/car">
      <button
        onClick={() => scroll(-1)}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 shadow-md rounded-full w-9 h-9 items-center justify-center hidden group-hover/car:flex hover:bg-gray-50 transition-all"
      >
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div
        ref={ref}
        className="flex gap-3 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            badge={badge}
            onNavigate={onNavigate}
          />
        ))}
      </div>
      <button
        onClick={() => scroll(1)}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 shadow-md rounded-full w-9 h-9 items-center justify-center hidden group-hover/car:flex hover:bg-gray-50 transition-all"
      >
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCarousel() {
  return (
    <div className="flex gap-3 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 rounded border border-gray-100 overflow-hidden"
          style={{ width: 192 }}
        >
          <div className="bg-gray-100 animate-pulse" style={{ height: 192 }} />
          <div className="p-2.5 space-y-2">
            <div className="h-2 bg-gray-100 animate-pulse rounded w-1/3" />
            <div className="h-3 bg-gray-100 animate-pulse rounded" />
            <div className="h-3 bg-gray-100 animate-pulse rounded w-3/4" />
            <div className="h-4 bg-gray-100 animate-pulse rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PublicShopPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const productsRef = useRef(null);

  useEffect(() => {
    api
      .get("/api/categories/")
      .then((r) => setCategories(r.data))
      .catch(() => {});
    api
      .get("/api/products/")
      .then((r) => setProducts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      setSearch(e.detail);
      productsRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    window.addEventListener("public-search", handler);
    return () => window.removeEventListener("public-search", handler);
  }, []);

  const goProducts = () =>
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  const goProduct = (id) => navigate(`/product/${id}`);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      !selectedCategory || p.category?.id === selectedCategory;

    return matchSearch && matchCategory;
  });
  const promoProducts = products.filter((_, i) => i % 3 === 0).slice(0, 10);
  const newProducts = products.filter((_, i) => i % 3 === 1).slice(0, 10);
  const featProducts = products.filter((_, i) => i % 3 === 2).slice(0, 10);

  // ── Données des sections avec images ──────────────────────────────────────
  // Pour chaque image : remplace `null` par ton import quand tu l'as
  // Exemple : null  →  genreHomme   (après avoir décommenté l'import en haut)

  const GENRE_TILES = [
    { label: "Homme", image: genreHomme, ph: "genre-homme.png — 400×500px" },
    { label: "Femme", image: genreFemme, ph: "genre-femme.png — 400×500px" },
    {
      label: "Enfants",
      image: genreEnfants,
      ph: "genre-enfants.png — 400×500px",
    },
    { label: "< 99 DH", image: genre99, ph: "genre-99.png — 400×500px" },
    {
      label: "Catalogue",
      image: genreCatalogue,
      ph: "genre-catalogue.png — 400×500px",
    },
    {
      label: "Baisse de prix",
      image: genreBaisse,
      ph: "genre-baisse.png — 400×500px",
    },
  ];

  const ESSENTIALS = [
    {
      label: "Chaises & tables",
      image: null,
      ph: "ind-chaises.png — 200×200px",
    },
    { label: "Tentes", image: null, ph: "ind-tentes.png — 200×200px" },
    { label: "Glacières", image: null, ph: "ind-glacieres.png — 200×200px" },
    { label: "Gourdes", image: null, ph: "ind-gourdes.png — 200×200px" },
    {
      label: "Matelas & tapis",
      image: null,
      ph: "ind-matelas.png — 200×200px",
    },
    {
      label: "Chaussures randonnée",
      image: null,
      ph: "ind-chaussures.png — 200×200px",
    },
  ];

  const DISCOVER_TILES = [
    {
      label: "Chaussures Homme",
      image: null,
      ph: "disc-homme.png — 350×200px",
    },
    {
      label: "Chaussures Femme",
      image: null,
      ph: "disc-femme.png — 350×200px",
    },
    { label: "Sportswear", image: null, ph: "disc-sportswear.png — 350×200px" },
    { label: "Padel", image: null, ph: "disc-padel.png — 350×200px" },
  ];

  const SERVICES = [
    {
      label: "Service client — FAQ",
      image: svcFaq,
      ph: "svc-faq.png — 450×200px",
    },
    {
      label: "Programme de fidélité",
      image: svcFidelite,
      ph: "svc-fidelite.png — 450×200px",
    },
    {
      label: "Cliquez & Retirez en magasin",
      image: svcClickRetire,
      ph: "svc-click-retire.png — 450×200px",
    },
  ];

  // Images sections latérales
  const imgMobilite = null; // → import imgMobilite from '../../assets/mobilite.png'
  const imgRunning = null; // → import imgRunning  from '../../assets/running.png'
  const imgCamping = null; // → import imgCamping  from '../../assets/camping.png'
  const imgFitness = null; // → import imgFitness  from '../../assets/fitness.png'
  const imgAppBanner = null; // → import imgApp      from '../../assets/app-banner.png'
  const imgDuoG = duoGauche; // → import duoGauche   from '../../assets/duo-gauche.png'
  const imgDuoD = duoDroite; // → import duoDroite   from '../../assets/duo-droite.png'

  const catTiles =
    categories.length > 0
      ? categories.slice(0, 7).map((cat) => ({
          ...cat,
          image: CAT_IMAGES[cat.id] ?? null,
        }))
      : [
          { id: 1, name: "Fitness", image: catFitness },
          { id: 2, name: "Running", image: catRunning },
          { id: 3, name: "Camping", image: catCamping },
          { id: 4, name: "Randonnée", image: catRandonnée },
          { id: 5, name: "Vélos", image: catVélos },
          { id: 6, name: "Yoga", image: catYoga },
          { id: 7, name: "Football", image: catFootball },
        ];

  return (
    <div className="bg-white text-gray-900">
      {/* ── 1. HERO SLIDER ──────────────────────────────────────────── */}
      <HeroCarousel />

      {/* ── 2. PAR GENRE ────────────────────────────────────────────── */}
      <section className="max-w-screen-2xl mx-auto px-6 pt-8 pb-4">
        <SectionHeader title="Par genre !" />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {GENRE_TILES.map((t) => (
            <button
              key={t.label}
              className="group flex flex-col items-center gap-2"
            >
              <div
                className="w-full overflow-hidden rounded"
                style={{ aspectRatio: "4/5" }}
              >
                <Img
                  src={t.image}
                  alt={t.label}
                  label={t.ph}
                  className="w-full h-full"
                  imgClassName="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-sm font-semibold text-gray-800 group-hover:text-[#3643BA] transition-colors">
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── 3. DERNIÈRE CHANCE ──────────────────────────────────────── */}
      <section className="max-w-screen-2xl mx-auto px-6 py-6 border-t border-gray-100">
        <SectionHeader
          title="Dernière chance ! ⏳"
          subtitle="Profitez de nos dernières pièces avant épuisement total des stocks"
          cta="Découvrir plus"
          onCta={goProducts}
        />
        {loading ? (
          <SkeletonCarousel />
        ) : (
          <ProductCarousel
            products={promoProducts}
            badge="Dernière chance"
            onNavigate={goProduct}
          />
        )}
      </section>

      {/* ── 4. DUO PROMO BANNERS ────────────────────────────────────── */}
      <section className="max-w-screen-2xl mx-auto px-6 py-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div
            className="rounded overflow-hidden"
            style={{ aspectRatio: "7/3" }}
          >
            <Img
              src={imgDuoG}
              alt="Duo gauche"
              label="duo-gauche.png — 700×300px"
              className="w-full h-full"
            />
          </div>
          <div
            className="rounded overflow-hidden"
            style={{ aspectRatio: "7/3" }}
          >
            <Img
              src={imgDuoD}
              alt="Duo droite"
              label="duo-droite.png — 700×300px"
              className="w-full h-full"
            />
          </div>
        </div>
        <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-6 py-4">
          <div>
            <p className="font-bold text-lg text-gray-900">
              Offre Duo Camping : -50 DHS offerts
            </p>
            <p className="text-sm text-gray-500">
              Ajoutez 1 table + 1 chaise au panier et bénéficiez de -50 DHS
              immédiatement !
            </p>
          </div>
          <button className="bg-[#3643BA] text-white text-sm font-bold px-6 py-2.5 rounded hover:bg-[#2a35a0] transition-colors shrink-0 ml-4">
            J'en profite !
          </button>
        </div>
      </section>

      {/* ── 5. PRIX EN BAISSE ───────────────────────────────────────── */}
      <section className="max-w-screen-2xl mx-auto px-6 py-6 border-t border-gray-100">
        <SectionHeader
          title="Prix en baisse, et c'est définitif !"
          cta="Voir la sélection (500+ produits)"
          onCta={goProducts}
        />
        {loading ? (
          <SkeletonCarousel />
        ) : (
          <ProductCarousel
            products={newProducts}
            badge="Baisse définitive"
            onNavigate={goProduct}
          />
        )}
      </section>

      {/* ── 6. TOP CATÉGORIES ───────────────────────────────────────── */}
      <section className="max-w-screen-2xl mx-auto px-6 py-6 border-t border-gray-100">
        <SectionHeader
          title="Top catégories"
          cta="Voir tous les sports"
          onCta={goProducts}
        />
        <div
          className="flex gap-5 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {catTiles.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                productsRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex flex-col items-center gap-2 shrink-0 group"
            >
              <div className="w-28 h-28 rounded overflow-hidden">
                <Img
                  src={cat.image}
                  alt={cat.name}
                  label={`cat-${cat.name.toLowerCase()}.png`}
                  className="w-full h-full"
                  imgClassName="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span
                className="text-sm font-semibold text-gray-700 group-hover:text-[#3643BA] transition-colors text-center"
                style={{ width: 112 }}
              >
                {cat.name}
              </span>
            </button>
            
          ))}
                  <button
  onClick={() => setSelectedCategory(null)}
  className="px-4 py-2 bg-gray-200 rounded"
>
  Toutes les catégories
</button></div>
      </section>

      {/* ── 7. LES INDISPENSABLES ─────────────────────────────────────
      <section className="max-w-screen-2xl mx-auto px-6 py-6 border-t border-gray-100">
        <SectionHeader
          title="Les Indispensables"
          subtitle="Tout ce qu'il vous faut !"
        />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {ESSENTIALS.map((item) => (
            <button
              key={item.label}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className="w-full rounded overflow-hidden"
                style={{ aspectRatio: "1/1" }}
              >
                <Img
                  src={item.image}
                  alt={item.label}
                  label={item.ph}
                  className="w-full h-full"
                />
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-[#3643BA] transition-colors text-center">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </section> */}

      {/* ── 8. MOBILITÉ URBAINE ─────────────────────────────────────── */}
      <section className="max-w-screen-2xl mx-auto px-6 py-6 border-t border-gray-100">
        <SectionHeader
          title="Mobilité Urbaine"
          subtitle="La ville autrement"
          cta="Découvrir"
          onCta={goProducts}
        />
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <div className="md:col-span-1">
            <div
              className="w-full rounded overflow-hidden"
              style={{ aspectRatio: "3/4" }}
            >
              <Img
                src={imgMobilite}
                alt="Mobilité Urbaine"
                label="mobilite.png — 300×400px"
                className="w-full h-full"
              />
            </div>
            <button className="mt-3 bg-[#3643BA] text-white text-sm font-bold px-5 py-2 rounded hover:bg-[#2a35a0] transition-colors w-full">
              J'en profite !
            </button>
          </div>
          <div className="md:col-span-3 overflow-hidden pt-1">
            {loading ? (
              <SkeletonCarousel />
            ) : (
              <ProductCarousel
                products={featProducts.slice(0, 8)}
                onNavigate={goProduct}
              />
            )}
          </div>
        </div>
      </section>

      {/* ── 9. RUNNING & TRAIL ──────────────────────────────────────── */}
      <section className="max-w-screen-2xl mx-auto px-6 py-6 border-t border-gray-100">
        <SectionHeader
          title="Running & Trail"
          subtitle="Préparez vos prochaines courses"
          cta="Découvrir plus"
          onCta={goProducts}
        />
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <div className="md:col-span-1">
            <div
              className="w-full rounded overflow-hidden"
              style={{ aspectRatio: "3/4" }}
            >
              <Img
                src={imgRunning}
                alt="Running"
                label="running.png — 300×400px"
                className="w-full h-full"
              />
            </div>
          </div>
          <div className="md:col-span-3 overflow-hidden pt-1">
            {loading ? (
              <SkeletonCarousel />
            ) : (
              <ProductCarousel
                products={promoProducts.slice(0, 8)}
                onNavigate={goProduct}
              />
            )}
          </div>
        </div>
      </section>

      {/* ── 10. APP DOWNLOAD BANNER ─────────────────────────────────── */}
      <section className="max-w-screen-2xl mx-auto px-6 py-6 border-t border-gray-100">
        <div className="grid md:grid-cols-2 rounded overflow-hidden border border-gray-100">
          <div style={{ aspectRatio: "7/2.6" }}>
            <Img
              src={imgAppBanner}
              alt="App Banner"
              label="app-banner.png — 700×260px"
              className="w-full h-full"
            />
          </div>
          <div className="bg-[#3643BA] text-white flex flex-col items-center justify-center p-8 gap-3 text-center">
            <p className="font-black text-2xl">Notre application</p>
            <p className="text-blue-200 text-sm max-w-xs">
              Téléchargez l'application & activez vos points en coupons et
              bénéficiez d'avantages exclusifs !
            </p>
            <button className="bg-white text-[#3643BA] font-bold px-6 py-2.5 rounded hover:bg-blue-50 transition-colors text-sm mt-1">
              Je télécharge l'app !
            </button>
          </div>
        </div>
      </section>

      {/* ── 11. CAMPING & BIVOUAC ───────────────────────────────────── */}
      <section className="max-w-screen-2xl mx-auto px-6 py-6 border-t border-gray-100">
        <SectionHeader
          title="Camping & Bivouac"
          subtitle="Évadez-vous ce week-end"
          cta="Voir plus"
          onCta={goProducts}
        />
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <div className="md:col-span-1">
            <div
              className="w-full rounded overflow-hidden"
              style={{ aspectRatio: "1/1" }}
            >
              <Img
                src={imgCamping}
                alt="Camping"
                label="camping.png — 300×300px"
                className="w-full h-full"
              />
            </div>
          </div>
          <div className="md:col-span-3 overflow-hidden pt-1">
            {loading ? (
              <SkeletonCarousel />
            ) : (
              <ProductCarousel
                products={newProducts.slice(0, 8)}
                onNavigate={goProduct}
              />
            )}
          </div>
        </div>
      </section>

      {/* ── 12. FITNESS ─────────────────────────────────────────────── */}
      <section className="max-w-screen-2xl mx-auto px-6 py-6 border-t border-gray-100">
        <SectionHeader
          title="Fitness"
          subtitle="Boostez vos séances, à la maison ou en salle !"
          cta="J'en profite !"
          onCta={goProducts}
        />
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <div className="md:col-span-1">
            <div
              className="w-full rounded overflow-hidden"
              style={{ aspectRatio: "1/1" }}
            >
              <Img
                src={imgFitness}
                alt="Fitness"
                label="fitness.png — 300×300px"
                className="w-full h-full"
              />
            </div>
          </div>
          <div className="md:col-span-3 overflow-hidden pt-1">
            {loading ? (
              <SkeletonCarousel />
            ) : (
              <ProductCarousel
                products={featProducts.slice(0, 8)}
                onNavigate={goProduct}
              />
            )}
          </div>
        </div>
      </section>

      {/* ── 13. DÉCOUVREZ AUSSI ─────────────────────────────────────── */}
      <section className="max-w-screen-2xl mx-auto px-6 py-6 border-t border-gray-100">
        <SectionHeader
          title="Découvrez aussi :"
          cta="Voir tous les sports"
          onCta={goProducts}
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DISCOVER_TILES.map((item) => (
            <button
              key={item.label}
              className="group relative rounded overflow-hidden"
              style={{ aspectRatio: "7/4" }}
            >
              <Img
                src={item.image}
                alt={item.label}
                label={item.ph}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors rounded" />
              <span className="absolute bottom-3 left-3 text-white font-bold text-sm drop-shadow">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── 14. TOUS LES PRODUITS ───────────────────────────────────── */}
      <section
        ref={productsRef}
        className="max-w-screen-2xl mx-auto px-6 py-10 border-t border-gray-100"
      >
        <SectionHeader
          title={search ? `Résultats pour "${search}"` : "Tous les produits"}
          subtitle={`${filtered.length} article(s)`}
        />
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="rounded border border-gray-100 overflow-hidden"
              >
                <div
                  className="bg-gray-100 animate-pulse"
                  style={{ height: 200 }}
                />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-400 text-lg">Aucun produit trouvé.</p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 text-[#3643BA] text-sm underline"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((product) => (
              <div
                key={product.id}
                onClick={() => goProduct(product.id)}
                className="bg-white border border-gray-200 rounded overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div
                  className="relative bg-gray-50 overflow-hidden"
                  style={{ height: 200 }}
                >
                  {product.stock === 0 && (
                    <span className="absolute top-2 left-2 z-10 bg-gray-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Rupture
                    </span>
                  )}
                  {IMG(product.image) ? (
                    <img
                      src={IMG(product.image)}
                      alt={product.name}
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Placeholder
                      label="Photo à venir"
                      className="w-full h-full"
                    />
                  )}
                </div>
                <div className="p-3">
                  {product.store && (
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      {product.store.name}
                    </p>
                  )}
                  <h3 className="text-xs text-gray-800 leading-snug line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  {product.category && (
                    <p className="text-[10px] text-gray-400 mb-1">
                      {product.category.name}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mb-1.5">
                    <Stars count={4} />
                    <span className="text-[10px] text-gray-400">
                      ({Math.floor(Math.random() * 2000) + 100})
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {parseFloat(product.price).toFixed(2)} MAD
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 15. SERVICES ────────────────────────────────────────────── */}
      <section className="max-w-screen-2xl mx-auto px-6 py-10 border-t border-gray-100">
        <SectionHeader title="Besoin d'aide ? Découvrez nos services" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {SERVICES.map((item) => (
            <button
              key={item.label}
              className="group relative rounded overflow-hidden"
              style={{ aspectRatio: "9/4" }}
            >
              <Img
                src={item.image}
                alt={item.label}
                label={item.ph}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors" />
              <span className="absolute bottom-4 left-4 text-white font-bold text-sm drop-shadow">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-gray-100 pt-8">
          {[
            {
              icon: "🏆",
              title: "Plus de 65 sports",
              desc: "Une sélection pour chaque passion sportive",
            },
            {
              icon: "🛡️",
              title: "Garantie 2 ans",
              desc: "Tous nos produits sont garantis minimum deux ans.",
            },
            {
              icon: "🔄",
              title: "Retour et échange",
              desc: "Politique de retour et d'échange simple et rapide.",
            },
            {
              icon: "🚚",
              title: "Livraison à domicile",
              desc: "Commandez en ligne et recevez votre colis chez vous.",
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="text-2xl shrink-0">{item.icon}</span>
              <div>
                <p className="font-bold text-sm text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
