import { MapPin, Phone, Clock, Navigation, Car, Bike } from 'lucide-react';

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-charcoal-50">
      <div className="gradient-charcoal py-16 text-white">
        <div className="container-padding px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold sm:text-5xl">Our Location</h1>
          <p className="mt-3 text-white/70">
            Visit us or get your favorite meals delivered in our service areas.
          </p>
        </div>
      </div>

      <div className="container-padding px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Map */}
          <div className="card overflow-hidden">
            <div className="relative h-full min-h-[400px]">
              <iframe
                title="Oooh-Lala Kitchen Location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=3.28%2C6.65%2C3.35%2C6.72&layer=mapnik&marker=6.6866%2C3.3167"
                className="h-full min-h-[400px] w-full border-0"
                loading="lazy"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-serif text-2xl font-bold text-charcoal-900">Main Branch</h2>
              <p className="mt-1 font-serif text-lg text-primary-600">Oooh-Lala Kitchen & Food Delivery</p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                    <MapPin size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal-900">Address</p>
                    <p className="text-sm text-charcoal-600">
                      Agbelekale, Abule-Egba<br />
                      Lagos State, Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50">
                    <Phone size={20} className="text-gold-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal-900">Contact Numbers</p>
                    <p className="text-sm text-charcoal-600">08117926084</p>
                    <p className="text-sm text-charcoal-600">08101581209</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50">
                    <Clock size={20} className="text-success-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal-900">Business Hours</p>
                    <p className="text-sm text-charcoal-600">Monday - Sunday</p>
                    <p className="text-sm text-charcoal-600">8:00 AM - 11:00 PM</p>
                  </div>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/dir/?api=1&destination=6.6866,3.3167"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 btn-primary w-full"
              >
                <Navigation size={18} />
                Get Directions
              </a>
            </div>

            {/* Delivery Areas */}
            <div className="card p-6">
              <h2 className="font-serif text-xl font-bold text-charcoal-900">Delivery Areas</h2>
              <p className="mt-2 text-sm text-charcoal-600">
                We deliver to the following areas with an estimated delivery time of 30-45 minutes.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {['Agbelekale', 'Ekoro Road', 'Ayobo', 'White-House', 'Megida'].map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-2 rounded-xl bg-charcoal-50 px-4 py-3"
                  >
                    <Bike size={18} className="text-primary-600" />
                    <span className="text-sm font-medium text-charcoal-700">{area}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl bg-gold-50 px-4 py-3">
                <Car size={20} className="text-gold-600" />
                <p className="text-sm text-charcoal-700">
                  Delivery fee: ₦1,000 within all service areas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
