type SellerProps = {
  seller: any;
};

export default function SellerDetails({ seller }: SellerProps) {
  if (!seller || typeof seller !== "object") return null;

  return (
    <div className="p-4 border rounded-xl shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-2">Seller Details</h2>
      <p className="text-gray-700">{seller.name}</p>
      {seller.contactInfo && (
        <div className="text-sm text-gray-600 mt-1">
          <p>Email: {seller.contactInfo.email}</p>
          <p>Phone: {seller.contactInfo.phone}</p>
          <p>Location: {seller.contactInfo.location}</p>
        </div>
      )}
    </div>
  );
}
