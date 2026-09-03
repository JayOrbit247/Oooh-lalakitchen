import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category, MenuItem, Testimonial, Promotion } from '@/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => {
        setCategories((data as Category[]) ?? []);
        setLoading(false);
      });
  }, []);

  return { categories, loading };
}

export function useMenuItems(filters?: {
  categoryId?: string;
  search?: string;
  popularOnly?: boolean;
  sortBy?: 'popularity' | 'price_low' | 'price_high' | 'rating';
  maxPrice?: number;
}) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = supabase
      .from('menu_items')
      .select('*, category:categories(*)')
      .eq('is_available', true);

    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    if (filters?.popularOnly) {
      query = query.eq('is_popular', true);
    }

    if (filters?.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters?.sortBy === 'price_low') {
      query = query.order('price', { ascending: true });
    } else if (filters?.sortBy === 'price_high') {
      query = query.order('price', { ascending: false });
    } else if (filters?.sortBy === 'rating') {
      query = query.order('rating', { ascending: false });
    } else {
      query = query.order('is_popular', { ascending: false }).order('sort_order');
    }

    query.then(({ data }) => {
      let result = (data as MenuItem[]) ?? [];
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q)
        );
      }
      setItems(result);
      setLoading(false);
    });
  }, [
    filters?.categoryId,
    filters?.search,
    filters?.popularOnly,
    filters?.sortBy,
    filters?.maxPrice,
  ]);

  return { items, loading };
}

export function useMenuItem(slug: string | undefined) {
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    supabase
      .from('menu_items')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data }) => {
        setItem((data as MenuItem) ?? null);
        setLoading(false);
      });
  }, [slug]);

  return { item, loading };
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setTestimonials((data as Testimonial[]) ?? []);
        setLoading(false);
      });
  }, []);

  return { testimonials, loading };
}

export function usePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('promotions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => {
        setPromotions((data as Promotion[]) ?? []);
        setLoading(false);
      });
  }, []);

  return { promotions, loading };
}
