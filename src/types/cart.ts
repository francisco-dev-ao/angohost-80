
export interface DomainWithOwnership {
  domain: string;
  hasOwnership: boolean;
  ownershipData?: {
    name: string;
    email: string;
    document: string;
    phone: string;
    address: string;
  };
}

export interface DomainOwnershipData {
  name: string;
  email: string;
  phone: string;
  document: string;
  address: string;
}
