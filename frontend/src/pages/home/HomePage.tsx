import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate=useNavigate()
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">

      <section className="bg-purple-800 text-white h-screen w-full flex flex-col justify-center items-center text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to Thriftr</h1>
        <p className="text-lg md:text-2xl mb-8">Buy and sell pre-loved treasures effortlessly</p>
        <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" onClick={()=>navigate("/products")}>
          Get Started
        </Button>
      </section>

     
      <section className="w-full py-16 bg-card text-card-foreground">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose Thriftr?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 lg:px-24">
          {[
            { title: "Verified Sellers", desc: "Shop with confidence from trusted sellers." },
            { title: "Genuine Products", desc: "Every product is carefully checked for authenticity." },
            { title: "Secure Payments", desc: "Your transactions are protected end-to-end." },
            { title: "On-Time Deliveries", desc: "Get your orders delivered quickly and reliably." },
            { title: "Best Prices", desc: "Enjoy a wide variety of products at unbeatable prices." },
            { title: "Eco-Friendly Shopping", desc: "Support sustainable shopping by buying second-hand." },
          ].map((feature, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 bg-card text-card-foreground">
        <h2 className="text-3xl font-bold text-center mb-10">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 lg:px-24">
          {[
            { name: "Aarav", review: "Thriftr made selling my old clothes so easy. I love how quick and simple the process was!" },
            { name: "Meera", review: "I found a brand-new phone for half the price. Couldn’t believe how smooth the experience was." },
            { name: "Rohit", review: "The secure payments and on-time delivery gave me peace of mind. Definitely recommending this to friends." },
          ].map((user, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Avatar className="mx-auto mb-4">
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <p className="italic text-sm mb-2">"{user.review}"</p>
                <h4 className="font-semibold">{user.name}</h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Footer */}
      <footer className="bg-purple-800 text-white mt-auto w-full py-12 px-6 lg:px-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">About Us</h3>
            <p className="text-sm text-gray-200">
              Thriftr is your go-to platform for buying and selling pre-loved items. Sustainable, simple, and stylish.
            </p>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Instagram</a></li>
              <li><a href="#" className="hover:underline">Twitter</a></li>
              <li><a href="#" className="hover:underline">LinkedIn</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><a href="#" className="hover:underline">Sell an Item</a></li>
              <li><a href="#" className="hover:underline">How It Works</a></li>
              <li><a href="#" className="hover:underline">FAQs</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-purple-400 pt-6 text-center text-sm text-gray-200">
          &copy; {new Date().getFullYear()} Thriftr. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
