type SellerProps = {
  seller: any;
};

export default function SellerDetails({ seller }: SellerProps) {
  if (!seller || typeof seller !== "object") return null;
  const location=seller.location
  return (
    <div className="p-4 border rounded-xl shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-2">Seller Details</h2>
      <p className="text-gray-700">{seller.name}</p>
      {seller.contactInfo && (
        <div className="text-sm text-gray-600 mt-1">
          <p>Email: {seller.contactInfo.contactEmail}</p>
          <p>Phone: {seller.contactInfo.phoneNo}</p>
          <p>Location: {location.city},{location.state},{location.country}</p>
        </div>
      )}
    </div>
  );
}
