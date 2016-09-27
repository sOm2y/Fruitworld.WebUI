namespace app.domain {
  export interface IBranch {
    branchId: string;
    name: string;
    contactName: string;
    phone: string;
    email: string;
    fax: string;
    apt: string;
    street: string;
    line1: string;
    city: string;
    state: string;
    postCode: string;
    country: string;
    fullAddress: string;
  }

  export class Branch implements IBranch {
    constructor(
      public branchId: string,
      public name: string,
      public contactName: string,
      public phone: string,
      public email: string,
      public fax: string,
      public apt: string,
      public street: string,
      public line1: string,
      public city: string,
      public state: string,
      public postCode: string,
      public country: string,
      public fullAddress: string,
    ) { }
  }
}
