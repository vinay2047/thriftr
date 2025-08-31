import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


function AboutPage() {
  console.log(import.meta.env.VITE_ASSIGNMENT_SEED);
  return (
    <div>
        <div className="mb-20">

     <Navbar />
        </div>
    <Card className="p-4 border">
      <h2 className="text-xl font-semibold">Assignment Seed</h2>
      <Badge className="mt-2">{import.meta.env.VITE_ASSIGNMENT_SEED}</Badge>
    </Card>
    </div>
  );
}

export default AboutPage;
