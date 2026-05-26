import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ShoppingBag, Heart, Search, Menu, Star, Trash2, Plus, Minus, Truck, ShieldCheck, RefreshCcw } from 'lucide-react';
import './style.css';

const products = [
  { id: 1, name: 'Classic White Tee', category: 'Basic', price: 18, rating: 4.9, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', desc: 'Soft everyday cotton t-shirt with a clean relaxed fit.' },
  { id: 2, name: 'Black Street Tee', category: 'Streetwear', price: 22, rating: 4.8, img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', desc: 'Bold black t-shirt for casual street outfits.' },
  { id: 3, name: 'Oversized Beige Tee', category: 'Oversized', price: 26, rating: 4.7, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', desc: 'Trendy oversized fit with a warm neutral color.' },
  { id: 4, name: 'Graphic Summer Tee', category: 'Graphic', price: 24, rating: 4.6, img: 'https://images.unsplash.com/photo-1506629905607-d405b7a30db9?auto=format&fit=crop&w=900&q=80', desc: 'Lightweight graphic tee made for sunny days.' },
  { id: 5, name: 'Pink Soft Tee', category: 'Basic', price: 20, rating: 4.9, img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', desc: 'Cute pastel pink t-shirt with a soft premium feel.' },
  { id: 6, name: 'Minimal Logo Tee', category: 'Minimal', price: 23, rating: 4.8, img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80', desc: 'Simple branded t-shirt for a modern clean look.' }
];

function App() {
  const [page, setPage] = useState('home');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filtered = useMemo(() => products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  }), [query, category]);

  const addToCart = product => {
    setCart(prev => {
      const found = prev.find(item => item.id === product.id);
      if (found) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const changeQty = (id, amount) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: item.qty + amount } : item).filter(item => item.qty > 0));
  };

  const toggleWishlist = product => {
    setWishlist(prev => prev.some(item => item.id === product.id) ? prev.filter(item => item.id !== product.id) : [...prev, product]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return <>
    <nav className="navbar">
      <button className="brand" onClick={() => setPage('home')}>Sohaik<span>.</span></button>
      <div className="links">
        {['home', 'shop', 'about', 'contact'].map(link => <button key={link} onClick={() => setPage(link)} className={page === link ? 'active' : ''}>{link}</button>)}
      </div>
      <div className="nav-icons">
        <button onClick={() => setPage('wishlist')}><Heart size={20}/><small>{wishlist.length}</small></button>
        <button onClick={() => setPage('cart')}><ShoppingBag size={20}/><small>{cartCount}</small></button>
        <Menu className="mobile" />
      </div>
    </nav>

    {page === 'home' && <Home setPage={setPage} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />}
    {page === 'shop' && <Shop filtered={filtered} categories={categories} category={category} setCategory={setCategory} query={query} setQuery={setQuery} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />}
    {page === 'wishlist' && <Wishlist wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />}
    {page === 'cart' && <Cart cart={cart} changeQty={changeQty} total={total} />}
    {page === 'about' && <About />}
    {page === 'contact' && <Contact />}

    <footer>© 2026 Sohaik T-Shirts. Made for comfy everyday style.</footer>
  </>;
}

function Home({ setPage, addToCart, toggleWishlist, wishlist }) {
  return <main>
    <section className="hero">
      <div>
        <p className="tag">New collection 2026</p>
        <h1>Fresh T-Shirts for Every Mood.</h1>
        <p>Discover soft basics, oversized fits, and graphic tees made to style your day with comfort.</p>
        <div className="hero-actions">
          <button className="primary" onClick={() => setPage('shop')}>Shop Now</button>
          <button className="secondary" onClick={() => setPage('about')}>About Us</button>
        </div>
      </div>
      <img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80" alt="tshirt fashion" />
    </section>

    <section className="features">
      <Feature icon={<Truck/>} title="Fast Delivery" text="Quick local delivery for your orders." />
      <Feature icon={<ShieldCheck/>} title="Premium Quality" text="Soft cotton and comfortable fits." />
      <Feature icon={<RefreshCcw/>} title="Easy Exchange" text="Simple size exchange policy." />
    </section>

    <section className="section-title"><h2>Best Sellers</h2><p>Customer favorites this week</p></section>
    <div className="grid">{products.slice(0,3).map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} toggleWishlist={toggleWishlist} liked={wishlist.some(w => w.id === p.id)} />)}</div>
  </main>;
}

function Feature({ icon, title, text }) { return <div className="feature">{icon}<h3>{title}</h3><p>{text}</p></div>; }

function Shop(props) {
  return <main>
    <section className="shop-head">
      <h1>Shop T-Shirts</h1>
      <div className="search"><Search size={18}/><input placeholder="Search t-shirts..." value={props.query} onChange={e => props.setQuery(e.target.value)} /></div>
      <div className="chips">{props.categories.map(c => <button key={c} onClick={() => props.setCategory(c)} className={props.category === c ? 'selected' : ''}>{c}</button>)}</div>
    </section>
    <div className="grid">{props.filtered.map(p => <ProductCard key={p.id} product={p} addToCart={props.addToCart} toggleWishlist={props.toggleWishlist} liked={props.wishlist.some(w => w.id === p.id)} />)}</div>
  </main>;
}

function ProductCard({ product, addToCart, toggleWishlist, liked }) {
  return <article className="card">
    <div className="image-wrap"><img src={product.img} alt={product.name}/><button className={liked ? 'heart liked' : 'heart'} onClick={() => toggleWishlist(product)}><Heart size={19}/></button></div>
    <div className="card-body"><span>{product.category}</span><h3>{product.name}</h3><p>{product.desc}</p><div className="rating"><Star size={16} fill="currentColor"/> {product.rating}</div><div className="card-bottom"><strong>${product.price}</strong><button onClick={() => addToCart(product)}>Add to Cart</button></div></div>
  </article>;
}

function Wishlist({ wishlist, toggleWishlist, addToCart }) {
  return <main><section className="section-title"><h1>Wishlist</h1><p>Your saved t-shirts</p></section>{wishlist.length === 0 ? <Empty text="No items in wishlist yet."/> : <div className="grid">{wishlist.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} toggleWishlist={toggleWishlist} liked />)}</div>}</main>;
}

function Cart({ cart, changeQty, total }) {
  return <main><section className="section-title"><h1>Your Cart</h1><p>Review your selected t-shirts</p></section>{cart.length === 0 ? <Empty text="Your cart is empty."/> : <div className="cart-layout"><div>{cart.map(item => <div className="cart-item" key={item.id}><img src={item.img}/><div><h3>{item.name}</h3><p>${item.price}</p><div className="qty"><button onClick={() => changeQty(item.id, -1)}><Minus size={16}/></button><span>{item.qty}</span><button onClick={() => changeQty(item.id, 1)}><Plus size={16}/></button><button className="remove" onClick={() => changeQty(item.id, -item.qty)}><Trash2 size={16}/></button></div></div></div>)}</div><aside><h2>Order Summary</h2><p>Subtotal: <b>${total}</b></p><p>Delivery: <b>$3</b></p><h3>Total: ${total + 3}</h3><button className="primary full">Checkout</button></aside></div>}</main>;
}

function About() { return <main><section className="about"><h1>About Sohaik</h1><p>Sohaik is a simple modern t-shirt shop focused on comfortable everyday outfits. Our style is casual, clean, and easy to wear — from basic tees to oversized and graphic designs.</p><p>We believe a good t-shirt should feel soft, look stylish, and match everything in your closet.</p></section></main>; }
function Contact() { return <main><section className="contact"><h1>Contact Us</h1><p>Have a question about sizes, orders, or delivery? Send us a message.</p><form><input placeholder="Your name"/><input placeholder="Email address"/><textarea placeholder="Your message"></textarea><button className="primary" type="button">Send Message</button></form></section></main>; }
function Empty({ text }) { return <div className="empty"><ShoppingBag size={40}/><p>{text}</p></div>; }

createRoot(document.getElementById('root')).render(<App />);
