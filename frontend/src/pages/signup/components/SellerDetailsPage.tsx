import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/stores/useAuthStore"
import { Mail, Phone, MapPin } from "lucide-react"

export default function SellerDetailsPage() {
  const { signup, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search)
  const name = queryParams.get("name") || ""
  const email = queryParams.get("email") || ""
  const password = queryParams.get("password") || ""

  const [formData, setFormData] = useState({
    name,
    email,
    password,
    role: "seller",
    contactInfo: { phoneNo: "", contactEmail: "" },
    location: { city: "", state: "", country: "" },
  })

  useEffect(() => {
    if (!name || !email || !password) {
      navigate("/signup")
    }
  }, [name, email, password, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.startsWith("contactInfo.")) {
      const key = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        contactInfo: { ...prev.contactInfo, [key]: value },
      }))
    } else if (name.startsWith("location.")) {
      const key = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [key]: value },
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    signup(formData as any)
    navigate("/")
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <Card className="w-full max-w-sm shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-center">
            Almost done — complete your seller profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            <div className="grid gap-2">
              <Label htmlFor="contactInfo.phoneNo">Phone No</Label>
              <div className="relative">
                <Phone className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4" />
                <Input
                  id="contactInfo.phoneNo"
                  name="contactInfo.phoneNo"
                  value={formData.contactInfo.phoneNo}
                  onChange={handleChange}
                  required
                  className="pl-8 h-9 text-sm"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contactInfo.contactEmail">Contact Email</Label>
              <div className="relative">
                <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4" />
                <Input
                  id="contactInfo.contactEmail"
                  name="contactInfo.contactEmail"
                  type="email"
                  value={formData.contactInfo.contactEmail}
                  onChange={handleChange}
                  required
                  className="pl-8 h-9 text-sm"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location.city">City</Label>
              <div className="relative">
                <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4" />
                <Input
                  id="location.city"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  required
                  className="pl-8 h-9 text-sm"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location.state">State</Label>
              <div className="relative">
                <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4" />
                <Input
                  id="location.state"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  required
                  className="pl-8 h-9 text-sm"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location.country">Country</Label>
              <div className="relative">
                <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4" />
                <Input
                  id="location.country"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleChange}
                  required
                  className="pl-8 h-9 text-sm"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registering..." : "Finish Signup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
