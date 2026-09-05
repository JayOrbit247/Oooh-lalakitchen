import { useMenuItems } from '@/hooks/useData';

interface MenuGroup {
  name: string;
  prices: number[];
}

function groupMenuItems(items: { name: string; price: number }[]): MenuGroup[] {
  const map = new Map<string, number[]>();
  for (const item of items) {
    const existing = map.get(item.name);
    if (existing) {
      existing.push(item.price);
    } else {
      map.set(item.name, [item.price]);
    }
  }
  return Array.from(map.entries()).map(([name, prices]) => ({ name, prices }));
}

function formatNaira(amount: number): string {
  return `\u20a6${amount.toLocaleString()}`;
}

export default function MenuPage() {
  const { items, loading } = useMenuItems({});

  const groups = groupMenuItems(items);

  return (
    <div className="min-h-screen bg-charcoal-50">
      {/* Page Header */}
      <div className="gradient-charcoal py-16 text-white">
        <div className="container-padding px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold sm:text-5xl">
            Oooh-Lala Kitchen Menu
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            Freshly prepared meals and sides available for order.
          </p>
        </div>
      </div>

      {/* Menu List */}
      <div className="container-padding px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card p-6">
                  <div className="h-6 w-1/3 shimmer-bg rounded" />
                  <div className="mt-4 space-y-2">
                    <div className="h-4 w-full shimmer-bg rounded" />
                    <div className="h-4 w-2/3 shimmer-bg rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : groups.length === 0 ? (
            <div className="rounded-2xl bg-white py-20 text-center">
              <p className="text-sm text-charcoal-500">No menu items available.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {groups.map((group) => (
                <div
                  key={group.name}
                  className="card overflow-hidden"
                >
                  <div className="border-b border-charcoal-100 bg-gradient-to-r from-primary-50 to-transparent px-6 py-4">
                    <h2 className="font-serif text-xl font-semibold text-charcoal-900">
                      {group.name}
                    </h2>
                  </div>
                  <ul className="divide-y divide-charcoal-50">
                    {group.prices.map((price, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-charcoal-50/50"
                      >
                        <span className="text-sm text-charcoal-700">
                          {group.prices.length > 1
                            ? `${group.name} \u2014 Option ${idx + 1}`
                            : group.name}
                        </span>
                        <span className="font-serif text-base font-semibold text-primary-600">
                          {formatNaira(price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
