export interface Address {
    id: string;
    userId?: number;
    recipientName?: string;
    name?: string;
    phone: string;
    province: string;
    ward: string;
    street: string;
    isDefault: boolean;
    label?: string
}
export interface AddressFormInput {
    id?: string;
    name: string;
    phone: string;
    province: string;
    ward: string;
    street: string;
    isDefault: boolean;
}
export interface MappedAddress {
    id: string;
    name: string;
    phone: string;
    address: string;
    isDefault: boolean;
    label: string;
    province: string;
    ward: string;
    street: string;
}