import React from 'react';
import {
  Compass,
  Wallet,
  Map,
  BookOpen,
  Camera,
  Layers,
} from 'lucide-react';

export const Services: React.FC = () => {
  const services = [
    {
      icon: Compass,
      title: 'Trip Planning',
      description:
        'Custom 1, 2, and 3-day travel frameworks designed around your preferred pace, schedule, and trip duration.',
    },
    {
      icon: Layers,
      title: 'Personalized Itinerary',
      description:
        'Dynamic JavaScript engine that customizes daily activities based on your selected travel style and interests.',
    },
    {
      icon: Wallet,
      title: 'Budget Estimation',
      description:
        'Real-time cost calculations breakdown across accommodation, meals, local transit, entry tickets, and buffer margins.',
    },
    {
      icon: BookOpen,
      title: 'Destination Discovery',
      description:
        'In-depth exploration guides for Goa, Gokarna, Ooty, and Pondicherry featuring authentic local culture and heritage.',
    },
    {
      icon: Map,
      title: 'Interactive Maps',
      description:
        'Instant navigation links for every activity, temple, beach, viewpoint, and dining stop via Google Maps.',
    },
    {
      icon: Camera,
      title: 'Digital Memories Scrapbook',
      description:
        'Upload your travel snapshots, note dates and impressions, and preserve a digital diary of your journeys locally.',
    },
  ];

  return (
    <section id="services" className="py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-widest text-[#f04141] font-bold mb-2">
            Engineered Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Services We Provide
          </h2>
          <p className="mt-3 text-base text-stone-600">
            A comprehensive digital travel management suite built to turn rough vacation thoughts into realistic, enjoyable itineraries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-7 border border-stone-200/90 shadow-sm hover:shadow-md hover:border-stone-300 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-red-50 text-[#f04141] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
