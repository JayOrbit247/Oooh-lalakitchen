import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/menu?category=${category.slug}`}
      className="card card-hover group relative flex flex-col overflow-hidden"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={category.image_url}
          alt={category.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-serif text-lg font-semibold text-white">{category.name}</h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-white/80">{category.description}</p>
        </div>
        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-charcoal-700 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2">
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
}
