import { DiscoveryProducts } from "@/components/website/DiscoveryProducts";
import {
  getCart,
  getDiscoveryProducts,
  getProducts,
  getProductsByIds,
} from "@/lib/getData";
import { cookies } from "next/headers";
import Image from "next/image";
import { PiShieldCheckBold } from "react-icons/pi";
import { TbLock, TbTruck } from "react-icons/tb";

type ProductWithUpsellType = Omit<ProductType, "upsell"> & {
  upsell: {
    id: string;
    mainImage: string;
    pricing: {
      salePrice: number;
      basePrice: number;
      discountPercentage: number;
    };
    visibility: "DRAFT" | "PUBLISHED" | "HIDDEN";
    createdAt: string;
    updatedAt: string;
    products: {
      id: string;
      name: string;
      slug: string;
      mainImage: string;
      basePrice: number;
      options: {
        colors: Array<{
          name: string;
          image: string;
        }>;
        sizes: {
          inches: {
            columns: Array<{ label: string; order: number }>;
            rows: Array<{ [key: string]: string }>;
          };
          centimeters: {
            columns: Array<{ label: string; order: number }>;
            rows: Array<{ [key: string]: string }>;
          };
        };
      };
    }[];
  };
};

type CartType = {
  id: string;
  device_identifier: string;
  products: Array<{
    baseProductId: string;
    variantId: string;
    size: string;
    color: string;
  }>;
};

export default async function Cart() {
  const cookieStore = cookies();
  const deviceIdentifier = cookieStore.get("device_identifier")?.value;
  const cart = await getCart(deviceIdentifier);

  const productIds = cart
    ? cart.products.map((product) => product.baseProductId)
    : [];

  const baseProducts = (await getProductsByIds({
    ids: productIds,
    fields: ["id", "name", "slug", "pricing", "images"],
    visibility: "PUBLISHED",
  })) as ProductType[];

  const cartProducts = cart?.products
    .map((cartProduct) => {
      const baseProduct = baseProducts.find(
        (product) => product.id === cartProduct.baseProductId
      );

      return baseProduct
        ? {
            baseProductId: baseProduct.id,
            name: baseProduct.name,
            slug: baseProduct.slug,
            pricing: baseProduct.pricing,
            images: baseProduct.images,
            variantId: cartProduct.variantId,
            size: cartProduct.size,
            color: cartProduct.color,
          }
        : null;
    })
    .filter((product) => product !== null);

  const discoveryProducts = await getDiscoveryProducts({
    limit: 10,
  });

  console.log(cartProducts);

  return (
    <div className="max-w-[968px] mx-auto mt-[68px]">
      <div className="w-[calc(100%-20px)] mx-auto">
        <div className="flex flex-col gap-2 items-center pt-8 pb-12">
          <Image
            src="/icons/cart-thin.svg"
            alt="Cart"
            width={80}
            height={80}
            priority={true}
          />
          <p className="font-medium">Your Cart is Empty</p>
        </div>
        <div className="relative flex flex-row gap-10">
          <div className="w-[580px] h-max">
            <div className="pt-[40px] font-semibold">Shopping cart</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {/* {cartProducts.products.map(
                ({ id, poster, name, price, color, size }, index) => (
                  <div
                    key={index}
                    className={`${style.product} w-full h-[200px] p-[10px] flex gap-4 rounded-2xl select-none relative ease-in-out hover:ease-out hover:duration-300 hover:before:content-[''] hover:before:absolute hover:before:top-0 hover:before:bottom-0 hover:before:left-0 hover:before:right-0 hover:before:rounded-2xl hover:before:shadow-custom3`}
                  >
                    <div className="min-w-[180px] w-[180px] h-[180px] rounded-xl flex items-center justify-center overflow-hidden">
                      <Image
                        src={poster}
                        alt={name}
                        width={180}
                        height={180}
                        priority={true}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-[0.938rem] leading-5 line-clamp-1 w-60">
                        {name}
                      </div>
                      <div className="h-[30px] w-max px-3 font-medium text-base border rounded-full flex items-center justify-center">
                        <span>
                          {color}/{size}
                        </span>
                        <HiMiniChevronRight className="-mr-2" size={20} />
                      </div>
                      <div className="font-medium text-black">${price}</div>
                    </div>
                    <button className="w-[30px] h-[30px] rounded-full hidden absolute right-[6px] top-[6px] transition duration-300 ease-in-out hover:bg-gray2">
                      <AiOutlineDelete
                        className="fill-text-gray absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        size={20}
                      />
                    </button>
                  </div>
                )
              )} */}
            </div>
          </div>
          <div className="order-last w-[340px] min-w-[340px] sticky top-[68px] pt-[42px] h-max flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex gap-[6px] items-center">
                <TbLock className="stroke-green-600 -ml-[1px]" size={20} />
                <span className="text-sm text-gray">
                  Secure Checkout with SSL Encryption
                </span>
              </div>
              <div className="flex gap-[6px] items-center">
                <PiShieldCheckBold className="fill-green-600" size={18} />
                <span className="text-sm text-gray ml-[1px]">
                  Safe Payment Methods
                </span>
              </div>
              <div className="flex gap-[6px] items-center">
                <TbTruck className="stroke-green-600" size={20} />
                <span className="text-sm text-gray">Free Shipping</span>
              </div>
            </div>
            <div className="mb-2 flex items-center gap-1">
              <span className="font-medium">Total (5 Items):</span>
              <span className="font-bold text-xl">$108.99</span>
            </div>
            <div className="flex items-center mb-2">
              <div className="h-[20px] rounded-[3px] flex items-center justify-center">
                <Image
                  src="/images/payment-methods/visa.svg"
                  alt="Visa"
                  width={34}
                  height={34}
                  priority={true}
                />
              </div>
              <div className="ml-[10px] h-[18px] w-[36px] rounded-[3px] flex items-center justify-center">
                <Image
                  className="-ml-[4px]"
                  src="/images/payment-methods/mastercard.svg"
                  alt="Mastercard"
                  width={38}
                  height={38}
                  priority={true}
                />
              </div>
              <div className="ml-[5px] h-[20px] overflow-hidden rounded-[3px] flex items-center justify-center">
                <Image
                  src="/images/payment-methods/american-express.png"
                  alt="American Express"
                  width={60}
                  height={20}
                  priority={true}
                />
              </div>
              <div className="ml-[10px] h-[20px] rounded-[3px] flex items-center justify-center">
                <Image
                  src="/images/payment-methods/discover.svg"
                  alt="Discover"
                  width={64}
                  height={14}
                  priority={true}
                />
              </div>
              <div className="ml-[10px] h-[20px] rounded-[3px] flex items-center justify-center">
                <Image
                  src="/images/payment-methods/diners-club-international.svg"
                  alt="Diners Club International"
                  width={68}
                  height={10}
                  priority={true}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button className="w-full h-12 italic font-extrabold text-xl bg-sky-700 text-white rounded-full flex items-center justify-center">
                PayPal
              </button>
              <button className="w-full h-12 bg-black text-white rounded-full flex items-center justify-center">
                Debit or Credit Card
              </button>
            </div>
          </div>
        </div>
      </div>
      <DiscoveryProducts
        heading="Add These to Your Cart"
        products={discoveryProducts as ProductWithUpsellType[]}
        cart={cart as CartType}
      />
    </div>
  );
}
