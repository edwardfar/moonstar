import { supabase } from '../../lib/supabase';

async function fetchProducts() {
  const { data: products, error } = await supabase.from('Products').select('*');
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return products || [];
}

export default async function Home() {
  const products = await fetchProducts();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <img
  src={`/${product.image}`}
  alt={product.name}
  className="w-32 h-40 object-cover rounded-md mb-2"
/>
            <p>{product.description}</p>
            <p>Retail Price: ${product.retail_price}</p>
            <p>Wholesale Price: ${product.wholesale_price}</p>
            <p>Distributor Price: ${product.distributor_price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
