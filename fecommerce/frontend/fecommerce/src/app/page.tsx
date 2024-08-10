import { Card, Button, Image } from "@nextui-org/react";

const Home: React.FC = async () => {
  const products = new Array(6).fill(0);

  const data = await fetch('https://api.example.com/...').then((res) =>
    res.json()
  );

  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Not Amazon</h1>
      </header>

      <main className="p-8">
        <div className="mb-8">
          <img
            src="/images/hero.jpg"
            alt="Hero"
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((_, index) => (
            <Card key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src="/images/product.jpg"
                width="100%"
                height={140}
                alt="Product Image"
              />
              <div className="p-4">
                <h4 className="text-xl font-bold">Product Name</h4>
                <p className="text-gray-500">
                  Product description goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold">$189.99</span>
                  <Button size="sm">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
