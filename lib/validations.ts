export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AddressInput {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface ProductInput {
  name: string;
  slug?: string;
  description?: string;
  price: number;
  comparePrice?: number;
  categoryId: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isOffer?: boolean;
  isActive?: boolean;
  tags?: string[];
  sizes?: { size: string; stock: number }[];
}

export function validateRegister(data: RegisterInput) {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Valid email is required";
  }
  if (!data.password || data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateLogin(data: LoginInput) {
  const errors: Record<string, string> = {};

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Valid email is required";
  }
  if (!data.password) {
    errors.password = "Password is required";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateAddress(data: AddressInput) {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) errors.name = "Name is required";
  if (!data.phone || !/^\d{10}$/.test(data.phone))
    errors.phone = "Valid 10-digit phone is required";
  if (!data.line1?.trim()) errors.line1 = "Address line 1 is required";
  if (!data.city?.trim()) errors.city = "City is required";
  if (!data.state?.trim()) errors.state = "State is required";
  if (!data.pincode || !/^\d{6}$/.test(data.pincode))
    errors.pincode = "Valid 6-digit pincode is required";

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateProduct(data: ProductInput) {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) errors.name = "Product name is required";
  if (!data.price || data.price <= 0) errors.price = "Valid price is required";
  if (!data.categoryId) errors.categoryId = "Category is required";

  return { isValid: Object.keys(errors).length === 0, errors };
}
