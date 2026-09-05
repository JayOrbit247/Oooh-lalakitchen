import { UtensilsCrossed, MessageCircle } from 'lucide-react';

interface MenuItem {
  name: string;
  prices: number[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: 'Main Dishes',
    items: [
      { name: 'Chicken', prices: [2000, 3000, 4000] },
      { name: 'Turkey', prices: [2000, 3000, 4000] },
    ],
  },
  {
    title: 'Sides & Extras',
    items: [
      { name: 'Coleslaw', prices: [500] },
      { name: 'Moimoi', prices: [500] },
      { name: 'Egg', prices: [300] },
      { name: 'Fried Meat', prices: [300] },
      { name: 'Beef', prices: [300] },
      { name: 'Pomo', prices: [300] },
      { name: 'Takeaway Pack', prices: [300] },
      { name: 'Plantain', prices: [200] },
    ],
  },
];

function formatNaira(amount: number): string {
  return `\u20a6${amount.toLocaleString()}`;
}

const WHATSAPP_NUMBER = '2348117926084';
const WHATSAPP_MESSAGE = "Hello Oooh-Lala Kitchen, I'd like to place an order.";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-charcoal-50">
      {/* Page Header */}
      <div className="gradient-charcoal py-16 text-white">
        <div className="container-padding px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/20 ring-1 ring-gold-500/30">
            <UtensilsCrossed size={26} className="text-gold-400" />
          </div>
          <h1 className="font-serif text-4xl font-bold sm:text-5xl">
            Oooh-Lala Kitchen Menu
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            Freshly Prepared Meals Available for Order
          </p>
        </div>
      </div>

      {/* Menu Content */}
      <div className="container-padding px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-10">
              <div className="mb-5 flex items-center gap-4">
                <h2 className="font-serif text-2xl font-bold text-charcoal-900">
                  {section.title}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-primary-300 to-transparent" />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {section.items.map((item) => (
                  <div
                    key={item.name}
                    className="card card-hover flex flex-col gap-2 p-5"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-serif text-lg font-semibold text-charcoal-900">
                        {item.name}
                      </h3>
                      {item.prices.length > 1 && (
                        <span className="text-xs font-medium uppercase tracking-wide text-charcoal-400">
                          {item.prices.length} sizes
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      {item.prices.map((price, idx) => (
                        <span
                          key={idx}
                          className={`font-serif ${
                            item.prices.length > 1
                              ? 'text-base text-charcoal-700'
                              : 'text-xl font-bold text-primary-600'
                          }`}
                        >
                          {formatNaira(price)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Order on WhatsApp */}
          <div className="mt-10 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 p-6 text-center shadow-lg sm:p-8">
            <h2 className="font-serif text-xl font-bold text-white sm:text-2xl">
              Ready to Order?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
              Place your order directly on WhatsApp and we'll get it prepared fresh for you.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-green-700 shadow-xl transition-all duration-300 hover:bg-green-50 hover:shadow-2xl active:scale-95"
            >
              <MessageCircle size={20} />
              Order on WhatsApp
              <span className="text-green-500">08117926084</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
