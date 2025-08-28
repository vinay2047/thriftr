    import crypto from "crypto"
    const ASSIGNMENT_SEED = process.env.ASSIGNMENT_SEED || "GHW25-12345"

    function getSeedChecksum() {
    const hash = crypto.createHash("md5").update(ASSIGNMENT_SEED).digest("hex")
    return hash.slice(0, 4).toUpperCase()
    }

    export function generateSKU(productId) {
    const checksum = getSeedChecksum()
    return `SKU-${productId}-${checksum}`
    }
